// Registers this site's WebMCP tools, so a browser agent standing on any page
// of from.so can search the publications, look someone up, read the CV, and
// move the tab -- from the data in _data/, not by scraping the rendered HTML.
//
// WebMCP is `document.modelContext.registerTool()`. It is a W3C Community Group
// draft, not a shipped web platform feature: as of August 2026 it exists in
// Chrome behind an origin trial and nowhere else. So the first thing this file
// does is look for the API and return if it is absent, which is what happens
// for essentially every human visitor. Nothing below runs, and nothing is
// fetched, until an agent actually calls a tool.
//
// THE TWO NAMESPACES. The spec moved the entry point from `navigator` to
// `document` in July 2026, and Chrome's origin trial still ships the old one.
// We prefer `document.modelContext` and fall back, rather than registering on
// both: where both exist they are the same object, and registering twice with
// the same name rejects with InvalidStateError.
//
// WHERE THE DATA COMES FROM. /assets/mcp/index.json and /assets/mcp/cv.json,
// built by _plugins/mcp_index.rb out of _data/. Their paths reach this file as
// data attributes on its own script tag, written by _includes/webmcp_script.html
// (which both layouts include) so that they survive a baseurl change.
// Each is fetched at most once, lazily, the first time a tool that needs it is
// called -- so an agent that only asks about people never downloads the CV.
//
// WRITING A TOOL. Chrome's budgets are the constraint worth designing to:
// roughly 500 characters of tool description, 150 per parameter, and 1.5K of
// output per call. So descriptions say when NOT to use the tool as well as when
// to, and every list tool takes a `limit` and returns compact lines rather than
// JSON. A tool that returns everything it knows is a tool that gets truncated.
//
// A failure is a returned string, never a thrown error. Throwing gives the
// agent an opaque error and no way forward; a sentence naming the tool to call
// next gets it unstuck. That is the only case where a payload addresses the
// model at all -- everything else is data, with no instructions in it.
//
// ANNOTATIONS. `readOnlyHint: true` on everything that only reads, because the
// hint defaults to false and an agent is told to assume a tool mutates state --
// which costs a confirmation prompt on what is really a lookup. The two tools
// that do something (navigate_to_page, set_cv_display_options) leave it off.
// `untrustedContentHint` is deliberately absent everywhere: every string these
// tools can return was written into _data/ by the group. If this site ever
// renders content it did not author -- comments, an imported feed -- the tool
// that returns it needs that annotation.
//
// NAVIGATION IS ALLOWLISTED. navigate_to_page never takes a URL. It takes an
// id, resolves it against the records in index.json, and refuses anything that
// does not resolve, so a tool call cannot be talked into an off-site redirect.
(function () {
  'use strict';

  // The spec's namespace first, then the one Chrome's origin trial shipped.
  var modelContext = (typeof document !== 'undefined' && document.modelContext) ||
    (typeof navigator !== 'undefined' && navigator.modelContext);
  if (!modelContext || typeof modelContext.registerTool !== 'function') return;

  var script = document.currentScript;
  if (!script) return;
  var INDEX_URL = script.dataset.mcpIndex;
  var CV_URL = script.dataset.mcpCv;
  // What page the agent's user is actually looking at, so the "current" paper
  // or person can be the default rather than something it has to guess.
  var PAGE = {
    path: script.dataset.mcpPage || location.pathname,
    paperId: script.dataset.mcpPaperId || null,
    personId: script.dataset.mcpPersonId || null,
    isCv: script.dataset.mcpCvPage === 'true'
  };

  // ---------------------------------------------------------------- loading

  var cache = {};

  function load(url) {
    if (!cache[url]) {
      cache[url] = fetch(url, { credentials: 'omit' }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).catch(function (error) {
        // Do not cache a failure: a call that failed on a flaky network
        // should be retryable rather than poisoning every later call.
        delete cache[url];
        throw error;
      });
    }
    return cache[url];
  }

  var index = function () { return load(INDEX_URL); };
  var cv = function () { return load(CV_URL); };

  // ------------------------------------------------------------ formatting

  // WHAT A TOOL RETURNS. A plain string. The spec types the execute callback as
  // `Promise<any>` and defines no algorithm over the resolved value, so there is
  // no structure a client is obliged to unwrap; Chromium JSON-stringifies an
  // object return and passes a string through untouched. Returning the MCP-style
  // {content:[{type:'text',...}]} envelope therefore risks handing the model the
  // literal JSON of the envelope instead of the text inside it, while a bare
  // string reads correctly under either behaviour. Everything funnels through
  // here so there is one line to change if that ever stops being true.
  //
  // The cap is a backstop against a data change quietly producing an enormous
  // answer, not a budget -- the tools are sized so ordinary results land at
  // 1-3K (see the note on Chrome's budgets at the top of this file). It sits
  // above the largest answer this corpus can legitimately produce, which is
  // get_cv's numbered publication list: one line per paper, so it grows by
  // about 90 characters a year and is ~7K today. Truncating that mid-list would
  // be worse than returning it, since half a code-to-title mapping is not a
  // mapping. If it ever approaches this, give that section a type filter rather
  // than raising the number again.
  var MAX_REPLY_CHARS = 8000;

  function reply(text) {
    var out = String(text == null ? '' : text);
    if (out.length <= MAX_REPLY_CHARS) return out;
    return out.slice(0, MAX_REPLY_CHARS - 90) +
      '\n…[truncated] Ask again for a narrower slice — a smaller limit, or fewer sections.';
  }

  // Absolute, canonical from.so URLs -- an agent quoting a link wants the one
  // that works when pasted somewhere else, not one relative to this tab.
  var origin = null;
  function url(data, path) {
    if (!path) return null;
    if (origin === null) origin = (data.site && data.site.url) || location.origin;
    return origin.replace(/\/$/, '') + path;
  }

  function truncate(text, max) {
    if (!text || text.length <= max) return text || '';
    return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
  }

  function lines(parts) {
    return parts.filter(function (part) { return part; }).join('\n');
  }

  function plural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
  }

  // The site's own prose links records by root-relative path, which is a dead
  // link once an agent quotes it somewhere else. Absolutize them and leave
  // everything else -- including the Markdown -- alone.
  function absoluteLinks(data, text) {
    if (!text) return text;
    return text.replace(/\]\((\/[^)]*)\)/g, function (_, path) {
      return '](' + url(data, path) + ')';
    });
  }

  // One publication as a compact three-line entry. Long author lists are cut
  // to the first three, because a 12-author list crowds out the next result.
  // No PDF or DOI link here: at ~110 characters each they would double the
  // length of a result list, and get_publication has them.
  //
  // keepIds are authors the cut must not hide. A search filtered by author
  // otherwise returns pages of papers none of whose visible names is the one
  // that was asked about, which reads as the wrong answer.
  function pubLine(data, pub, n, keepIds) {
    var authors = pub.authors || '';
    var ids = pub.author_ids || [];
    if (ids.length > 4) {
      var shown = ids.slice(0, 3);
      var held = (keepIds || []).filter(function (id) {
        return ids.indexOf(id) !== -1 && shown.indexOf(id) === -1;
      });
      authors = shown.concat(held).map(function (id) {
        var person = byId(data.people, id);
        return person ? person.name : id;
      }).join(', ') + ', et al.';
    }
    return lines([
      (n ? n + '. ' : '') + pub.title,
      '   ' + authors + ' — ' + (pub.venue || 'unpublished') +
        (pub.award ? ' — ' + pub.award : ''),
      '   ' + url(data, pub.path),
      pub.summary ? '   ' + truncate(pub.summary, 150) : null
    ]);
  }

  function personLine(data, person) {
    var where = person.path ? url(data, person.path) : person.homepage;
    return lines([
      '- ' + person.name + (person.title ? ' — ' + person.title : ''),
      where ? '  ' + where : null
    ]);
  }

  // --------------------------------------------------------------- lookups

  function byId(records, id) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === id) return records[i];
    }
    return null;
  }

  // A model fills these in from a JSON Schema, but nothing enforces the schema
  // before execute runs, so every value that reaches a string or array
  // operation is coerced first. A number where a string was declared should
  // search for that number, not reject the call.
  function asText(value) {
    return value == null ? '' : String(value);
  }

  function asArray(value) {
    if (value == null) return [];
    return Object.prototype.toString.call(value) === '[object Array]' ? value : [value];
  }

  function normalize(text) {
    return asText(text).toLowerCase()
      // Strip accents so "Zurich" finds "Zürich", and punctuation so a pasted
      // citation's title matches the one in the data.
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function terms(query) {
    var normalized = normalize(query);
    return normalized ? normalized.split(' ') : [];
  }

  // Resolve a person by id, full name, or any part of a name. Returns every
  // match so an ambiguous "Zhang" can be reported rather than silently
  // resolved to whichever record happens to come first.
  function findPeople(data, who) {
    var needle = normalize(who);
    if (!needle) return [];
    var exact = [];
    var partial = [];
    data.people.forEach(function (person) {
      if (person.id === who || normalize(person.name) === needle) {
        exact.push(person);
      } else if (normalize(person.name).split(' ').indexOf(needle) !== -1 ||
        normalize(person.name).indexOf(needle) !== -1 || person.id.indexOf(needle.replace(/ /g, '_')) !== -1) {
        partial.push(person);
      }
    });
    return exact.length ? exact : partial;
  }

  // Agents paste titles at least as often as ids, so both resolve. The exact
  // title is tried on its own before any substring matching: several titles
  // here are prefixes of others ("CFlow: …" and "Demonstration of CFlow: …"),
  // and a substring pass alone would find two matches for a title that was
  // given exactly right and then resolve to neither.
  function findPublication(data, key) {
    var exact = byId(data.publications, key);
    if (exact) return exact;

    var needle = normalize(key);
    if (!needle) return null;

    var titled = data.publications.filter(function (pub) {
      return normalize(pub.title) === needle;
    });
    if (titled.length) return titled[0];

    var matches = data.publications.filter(function (pub) {
      return normalize(pub.title).indexOf(needle) !== -1;
    });
    return matches.length === 1 ? matches[0] : null;
  }

  // ---------------------------------------------------------------- search

  // Score by where the term hits, so a title match outranks a paper that
  // merely mentions the word in its abstract. Every term must hit something;
  // a two-word query is an AND, which is what a person typing one expects.
  function score(pub, queryTerms) {
    var haystacks = [
      { text: normalize(pub.title), weight: 10 },
      { text: normalize(pub.summary), weight: 4 },
      { text: normalize(pub.authors), weight: 4 },
      { text: normalize(pub.venue + ' ' + (pub.venue_full_name || '')), weight: 3 },
      { text: normalize((pub.research_area_ids || []).join(' ')), weight: 2 },
      { text: normalize(pub.abstract), weight: 1 }
    ];
    var total = 0;
    for (var i = 0; i < queryTerms.length; i++) {
      var term = queryTerms[i];
      var best = 0;
      for (var j = 0; j < haystacks.length; j++) {
        if (haystacks[j].text.indexOf(term) !== -1 && haystacks[j].weight > best) {
          best = haystacks[j].weight;
        }
      }
      if (!best) return 0;
      total += best;
    }
    return total;
  }

  function searchPublications(data, input) {
    var results = data.publications.slice();
    var matchedAuthors = null;
    var authorIds = [];

    if (input.author) {
      var people = findPeople(data, input.author);
      if (!people.length) return { error: 'No person on this site matches "' + input.author + '".' };
      var ids = people.map(function (person) { return person.id; });
      // A partial name can match more than one person ("Zhang" matches four).
      // Filtering on all of them is the useful behaviour, but the answer has to
      // say so, or the caller reads a union as one person's record.
      if (people.length > 1) {
        matchedAuthors = people.map(function (person) { return person.name; });
      }
      authorIds = ids;
      results = results.filter(function (pub) {
        return (pub.author_ids || []).some(function (id) { return ids.indexOf(id) !== -1; });
      });
    }
    if (input.research_area) {
      results = results.filter(function (pub) {
        return (pub.research_area_ids || []).indexOf(input.research_area) !== -1;
      });
    }
    if (input.venue) {
      var venue = normalize(input.venue);
      results = results.filter(function (pub) {
        return normalize(pub.venue + ' ' + (pub.venue_full_name || '') + ' ' + pub.venue_id).indexOf(venue) !== -1;
      });
    }
    if (input.type) {
      results = results.filter(function (pub) { return pub.type === input.type; });
    }
    if (input.year_from) {
      results = results.filter(function (pub) { return pub.year >= input.year_from; });
    }
    if (input.year_to) {
      results = results.filter(function (pub) { return pub.year <= input.year_to; });
    }
    if (input.award_winning) {
      results = results.filter(function (pub) { return !!pub.award; });
    }

    var queryTerms = terms(input.query);
    if (queryTerms.length) {
      results = results.map(function (pub) {
        return { pub: pub, score: score(pub, queryTerms) };
      }).filter(function (hit) {
        return hit.score > 0;
      }).sort(function (a, b) {
        // Ties break newest-first, which is the order index.json already
        // carries, so equally relevant papers read as they do on /research.
        return b.score - a.score;
      }).map(function (hit) { return hit.pub; });
    }

    return { results: results, matchedAuthors: matchedAuthors, authorIds: authorIds };
  }

  // ----------------------------------------------------------------- tools

  // The sections get_cv will read, in the order oney_cv.html renders them.
  // "publications" is not a key of cv.json -- it is assembled from the index
  // plus that file's publication_codes map.
  var CV_SECTIONS = ['contact', 'education', 'professional_experience', 'publications', 'grants',
    'awards', 'invited_presentations', 'service', 'teaching', 'supervised_students', 'press', 'patents'];

  var TOOLS = [
    {
      name: 'search_publications',
      description:
        'Search the SPOT research group\'s publications by topic, author, venue, year, or research area. ' +
        'Returns a ranked list of titles with authors, venue, and links. Use this to find papers; use ' +
        'get_publication afterwards for one paper\'s abstract, BibTeX, or PDF. Every filter is optional and ' +
        'they combine (AND). Omit "query" to list everything matching the filters, newest first.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Words to match against title, summary, abstract, authors, and venue. All words must match.'
          },
          author: {
            type: 'string',
            description: 'Only papers co-authored by this person. A full or partial name, e.g. "Oney" or "Ashley Zhang".'
          },
          research_area: {
            type: 'string',
            description: 'Only papers in this research area. Use list_research_areas to get the valid ids.'
          },
          venue: {
            type: 'string',
            description: 'Only papers at venues matching this, e.g. "CHI", "UIST", "VL/HCC".'
          },
          type: {
            type: 'string',
            enum: ['conference', 'journal', 'poster', 'workshop', 'demo', 'doctoralconsortium',
              'panel', 'bookchapter', 'preprint', 'thesis'],
            description: 'Only papers of this publication type.'
          },
          year_from: { type: 'integer', description: 'Only papers published in this year or later.' },
          year_to: { type: 'integer', description: 'Only papers published in this year or earlier.' },
          award_winning: {
            type: 'boolean',
            description: 'True to return only papers with a best paper award or honorable mention.'
          },
          limit: { type: 'integer', description: 'How many papers to return. Default 6, maximum 15.' }
        }
      },
      execute: function (input) {
        return index().then(function (data) {
          var found = searchPublications(data, input);
          if (found.error) return reply(found.error);

          // Capped at 15 because a page of results runs ~330 characters each,
          // and a bigger one would be cut mid-entry by the reply cap.
          var limit = Math.min(Math.max(input.limit || 6, 1), 15);
          var page = found.results.slice(0, limit);
          if (!page.length) return reply('No publications match. Try fewer filters, or list_research_areas to see what this group works on.');

          return reply(lines([
            found.matchedAuthors
              ? '"' + input.author + '" matched ' + found.matchedAuthors.join(', ') +
                '; these are the papers by any of them.'
              : null,
            'Found ' + plural(found.results.length, 'publication') +
              (found.results.length > page.length ? ', showing the first ' + page.length : '') + ':',
            '',
            page.map(function (pub, i) { return pubLine(data, pub, i + 1, found.authorIds); }).join('\n\n')
          ]));
        });
      }
    },

    {
      name: 'get_publication',
      description:
        'Get everything about one publication: full abstract, complete author list, venue, awards, DOI, ' +
        'PDF link, and a ready-to-paste BibTeX entry. Identify the paper by its id (from search_publications) ' +
        'or by its exact title. On a /papers/ page you may omit the identifier to get the paper being viewed. ' +
        'For several papers\' citations at once, use get_bibtex instead.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          publication: {
            type: 'string',
            description: 'The publication id or its exact title. Omit to use the paper on the current page.'
          }
        }
      },
      execute: function (input) {
        return index().then(function (data) {
          var key = input.publication || PAGE.paperId;
          if (!key) return reply('No paper specified, and the current page is not a paper page. Use search_publications to find one.');

          var pub = findPublication(data, key);
          if (!pub) return reply('No publication matches "' + key + '". Use search_publications to find its id.');

          var authors = (pub.author_ids || []).map(function (id) {
            var person = byId(data.people, id);
            var name = person ? person.name : id;
            return name + ((pub.student_author_ids || []).indexOf(id) !== -1 ? ' (student at the time)' : '');
          }).join(', ');

          var areas = (pub.research_area_ids || []).map(function (id) {
            var area = byId(data.research_areas, id);
            return area ? area.title : id;
          });

          return reply(lines([
            pub.title,
            '',
            'Authors: ' + authors,
            'Venue: ' + (pub.venue_full_name || pub.venue || 'unpublished') +
              (pub.year ? ', ' + pub.year : '') + (pub.venue_location ? ', ' + pub.venue_location : ''),
            'Type: ' + (pub.type || 'unknown'),
            pub.award ? 'Award: ' + pub.award : null,
            areas.length ? 'Research area: ' + areas.join('; ') : null,
            'Page: ' + url(data, pub.path),
            pub.pdf_path ? 'PDF: ' + url(data, pub.pdf_path) : null,
            pub.doi ? 'DOI: https://doi.org/' + pub.doi : null,
            '',
            pub.abstract ? 'Abstract: ' + pub.abstract
              : (pub.summary ? 'Summary: ' + pub.summary : 'No abstract on file.'),
            '',
            'BibTeX:',
            pub.bibtex
          ]));
        });
      }
    },

    {
      name: 'get_bibtex',
      description:
        'Get BibTeX entries for one or more of this group\'s publications, ready to paste into a .bib file. ' +
        'Pass publication ids or exact titles. Use this when citing several papers at once; get_publication ' +
        'already includes the BibTeX for a single paper alongside its abstract.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          publications: {
            type: 'array',
            items: { type: 'string' },
            description: 'Publication ids or exact titles, from search_publications.'
          }
        },
        required: ['publications']
      },
      execute: function (input) {
        return index().then(function (data) {
          var wanted = asArray(input.publications);
          if (!wanted.length) return reply('No publications given. Use search_publications to find ids first.');
          // 25 entries is about 8K of BibTeX, which is where the reply cap is.
          if (wanted.length > 25) {
            return reply('That is ' + wanted.length + ' publications; ask for at most 25 at a time so the ' +
              'entries come back whole.');
          }

          var entries = [];
          var missing = [];
          wanted.forEach(function (key) {
            var pub = findPublication(data, key);
            if (pub) entries.push(pub.bibtex); else missing.push(key);
          });

          return reply(lines([
            entries.join('\n\n'),
            missing.length ? '\nNot found: ' + missing.join(', ') : null
          ]) || 'None of those matched a publication on this site.');
        });
      }
    },

    {
      name: 'list_people',
      description:
        'List the people on this site. By default returns the current members of the SPOT group (the faculty ' +
        'lead, postdocs, and PhD students). Set "group" to also get PhD/postdoc alumni, the undergraduate and ' +
        'master\'s collaborators, or the external co-authors from other institutions. Use get_person for one ' +
        'person\'s bio, links, and papers.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          group: {
            type: 'string',
            enum: ['current_members', 'alumni', 'student_collaborators', 'external_collaborators', 'everyone'],
            description: 'Which set of people to list. Defaults to current_members.'
          }
        }
      },
      execute: function (input) {
        return index().then(function (data) {
          var groups = {
            current_members: ['current_member'],
            alumni: ['alum'],
            student_collaborators: ['ugrad_ms_collaborator'],
            external_collaborators: ['external_collaborator'],
            everyone: ['current_member', 'alum', 'ugrad_ms_collaborator', 'external_collaborator', 'unlisted']
          };
          var which = input.group || 'current_members';
          var wanted = groups[which] || groups.current_members;

          var labels = {
            current_member: 'Current members',
            alum: 'PhD and postdoc alumni',
            ugrad_ms_collaborator: 'Undergraduate and master\'s collaborators',
            external_collaborator: 'External co-authors (not group members)',
            unlisted: 'Other'
          };

          var out = [];
          wanted.forEach(function (status) {
            var people = data.people.filter(function (person) { return person.group_status === status; });
            if (!people.length) return;
            // External co-authors are in the data for their names on papers,
            // and there are a hundred of them; listing all of them buries the
            // answer to any question that was really about the group.
            var shown = status === 'external_collaborator' ? people.slice(0, 25) : people;
            out.push(labels[status] + ' (' + people.length + '):');
            out.push(shown.map(function (person) { return personLine(data, person); }).join('\n'));
            if (shown.length < people.length) {
              out.push('  … and ' + (people.length - shown.length) +
                ' more; use search_publications with an author name to find a specific one.');
            }
            out.push('');
          });

          return reply(lines(out) || 'No one in that group.');
        });
      }
    },

    {
      name: 'get_person',
      description:
        'Get one person\'s bio, role, homepage, other links, and the papers they co-authored on this site. ' +
        'For the few people with a long-form profile page, the full profile too. ' +
        'Accepts a full or partial name ("Oney", "Ashley Zhang") or a person id. On a /people/ page you may ' +
        'omit the name to get the person whose page is being viewed. Use list_people to see who is here.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          person: {
            type: 'string',
            description: 'A full or partial name, or a person id. Omit to use the person on the current page.'
          },
          include_publications: {
            type: 'boolean',
            description: 'Include their publication list. Default true.'
          }
        }
      },
      execute: function (input) {
        return index().then(function (data) {
          var key = input.person || PAGE.personId;
          if (!key) return reply('No person specified, and the current page is not a person page. Use list_people to see who is on this site.');

          var matches = findPeople(data, key);
          if (!matches.length) return reply('No one on this site matches "' + key + '".');
          if (matches.length > 1) {
            return reply(lines([
              '"' + key + '" matches ' + matches.length + ' people. Ask again with one of:',
              matches.slice(0, 10).map(function (person) {
                return '- ' + person.name + ' (id: ' + person.id + ')';
              }).join('\n'),
              matches.length > 10 ? '… and ' + (matches.length - 10) + ' more; give a fuller name.' : null
            ]));
          }

          var person = matches[0];
          var statusText = {
            current_member: 'Current member of the SPOT group',
            alum: 'Alum of the SPOT group',
            ugrad_ms_collaborator: 'Undergraduate or master\'s collaborator',
            external_collaborator: 'External co-author, not a member of the group',
            unlisted: 'In the publication data but not listed on the team page'
          }[person.group_status];

          var pubs = (person.publication_ids || []).map(function (id) { return byId(data.publications, id); })
            .filter(Boolean);

          var body = [
            person.name + (person.pronouns ? ' (' + person.pronouns + ')' : ''),
            person.title ? person.title.replace(/, /g, ' — ') : null,
            statusText,
            person.path ? 'Page: ' + url(data, person.path) : null,
            person.homepage ? 'Homepage: ' + person.homepage : null,
            person.name_recording ? 'Name pronunciation recording: ' + url(data, person.name_recording) : null
          ];
          (person.links || []).forEach(function (link) {
            body.push(link.description + ': ' + (link.url.charAt(0) === '/' ? url(data, link.url) : link.url));
          });
          if (person.bio) body.push('', absoluteLinks(data, person.bio));
          // The long-form profile from their page, when they have one. After
          // the bio, which stays the one-paragraph summary.
          if (person.profile) body.push('', absoluteLinks(data, person.profile));

          if (input.include_publications !== false && pubs.length) {
            body.push('', 'Publications on this site (' + pubs.length + '), newest first:');
            body.push(pubs.slice(0, 12).map(function (pub) {
              return '- ' + pub.title + ' — ' + (pub.venue || 'unpublished');
            }).join('\n'));
            if (pubs.length > 12) {
              body.push('… and ' + (pubs.length - 12) + ' more; use search_publications with author "' +
                person.name + '".');
            }
          }

          return reply(lines(body));
        });
      }
    },

    {
      name: 'list_research_areas',
      description:
        'List the SPOT group\'s research focus areas: what each one is about, who works on it, and how many ' +
        'papers it covers. Call this first when asked what the group works on, or to get the area ids that ' +
        'search_publications takes as its research_area filter.',
      annotations: { readOnlyHint: true },
      inputSchema: { type: 'object', properties: {} },
      execute: function () {
        return index().then(function (data) {
          return reply(data.research_areas.map(function (area) {
            var people = (area.member_ids || []).map(function (id) {
              var person = byId(data.people, id);
              return person ? person.name : id;
            });
            return lines([
              area.title + '  (id: ' + area.id + ')',
              '  ' + truncate(area.description, 190),
              '  People: ' + people.join(', '),
              '  ' + plural((area.publication_ids || []).length, 'publication') + ' — ' + url(data, area.path)
            ]);
          }).join('\n\n'));
        });
      }
    },

    {
      name: 'list_news',
      description:
        'List news items from the SPOT group in reverse chronological order: paper acceptances, awards, job ' +
        'news, and where members will be presenting. Filter by person or by date. Use this for "what is new" ' +
        'or "what has this group been up to" questions.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          person: { type: 'string', description: 'Only items mentioning this person. A full or partial name.' },
          since: { type: 'string', description: 'Only items on or after this date, as YYYY-MM-DD.' },
          limit: { type: 'integer', description: 'How many items to return. Default 8, maximum 30.' }
        }
      },
      execute: function (input) {
        return index().then(function (data) {
          var items = data.news.slice();
          var matchedPeople = null;

          if (input.person) {
            var matches = findPeople(data, input.person);
            if (!matches.length) return reply('No one on this site matches "' + input.person + '".');
            var ids = matches.map(function (person) { return person.id; });
            // As in search_publications: a partial name can be several people,
            // and a union has to be labelled as one.
            if (matches.length > 1) {
              matchedPeople = matches.map(function (person) { return person.name; });
            }
            items = items.filter(function (item) {
              return (item.person_ids || []).some(function (id) { return ids.indexOf(id) !== -1; });
            });
          }
          if (input.since) {
            items = items.filter(function (item) { return item.date >= input.since; });
          }

          var limit = Math.min(Math.max(input.limit || 8, 1), 30);
          var page = items.slice(0, limit);
          if (!page.length) return reply('No news items match.');

          return reply(lines([
            matchedPeople
              ? '"' + input.person + '" matched ' + matchedPeople.join(', ') +
                '; these are the items mentioning any of them.\n'
              : null,
            page.map(function (item) {
              return item.date + ': ' + absoluteLinks(data, item.text);
            }).join('\n\n'),
            items.length > page.length
              ? '\n(' + plural(items.length - page.length, 'older item') + ' not shown.)' : null,
            '\nFull list: ' + url(data, '/news/')
          ]));
        });
      }
    },

    {
      name: 'get_group_info',
      description:
        'Get an overview of the SPOT research group: what it studies, its contact address, its affiliations ' +
        'and sponsors, how to apply or get involved as a prospective PhD, master\'s, undergraduate, or high ' +
        'school student, and the guides it publishes (including its PhD application guide). Call this for ' +
        '"who are they", "how do I join", "should I apply", or "how do I contact them" questions.',
      annotations: { readOnlyHint: true },
      inputSchema: { type: 'object', properties: {} },
      execute: function () {
        return index().then(function (data) {
          var counts = {};
          data.people.forEach(function (person) {
            counts[person.group_status] = (counts[person.group_status] || 0) + 1;
          });

          return reply(lines([
            data.site.name + ' — ' + data.site.url,
            data.site.description,
            '',
            absoluteLinks(data, data.group.overview),
            data.group.announcement ? '\nAnnouncement: ' + absoluteLinks(data, data.group.announcement) : null,
            '',
            'Research areas: ' + data.research_areas.map(function (area) { return area.title; }).join('; '),
            'Size: ' + (counts.current_member || 0) + ' current members, ' + (counts.alum || 0) + ' alumni, ' +
              data.publications.length + ' publications on the site.',
            'Contact: ' + data.site.contact_email,
            'Affiliated with: ' + data.group.affiliations.map(function (item) { return item.name; }).join(', '),
            'Support: ' + data.group.sponsors.map(function (item) { return item.name; }).join(', '),
            '',
            'Joining the group:',
            absoluteLinks(data, data.group.joining),
            data.writing.length ? '\nGuides the group has published (' + url(data, '/writing/') + '):' : null,
            data.writing.map(function (post) {
              return '- ' + post.title + (post.date ? ' (' + post.date + ')' : '') +
                (post.url ? ' — ' + post.url : '');
            }).join('\n')
          ]));
        });
      }
    },

    {
      name: 'get_cv',
      description:
        'Read sections of Steve Oney\'s academic CV: education, positions held, grants, awards, invited talks, ' +
        'service, teaching, students supervised, press coverage, patents, and the CV\'s numbered publication ' +
        'list. This is the only place most of that exists on the site. Ask for the sections you need rather ' +
        'than all of them. To search papers use search_publications; for his bio use get_person.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        properties: {
          sections: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['contact', 'education', 'professional_experience', 'grants', 'awards',
                'invited_presentations', 'service', 'teaching', 'supervised_students', 'press', 'patents',
                'publications']
            },
            description: 'Which sections to return. Defaults to contact, education, and professional_experience. ' +
              '"publications" is the CV\'s numbered list (J.3, C.31, ...) and is long.'
          }
        }
      },
      execute: function (input) {
        return Promise.all([index(), cv()]).then(function (both) {
          var data = both[0];
          var record = both[1];
          var asked = asArray(input.sections);
          var wanted = asked.length ? asked : ['contact', 'education', 'professional_experience'];

          var out = [record.name + ' — CV: ' + url(data, record.path)];
          wanted.forEach(function (section) {
            if (section === 'publications') {
              out.push('', 'PUBLICATIONS, as numbered on the CV. The code counts down from each type\'s ' +
                'total, so it shifts when an older paper of that type is added.');
              out.push(data.publications.filter(function (pub) {
                return record.publication_codes[pub.id];
              }).map(function (pub) {
                return record.publication_codes[pub.id] + '  ' + pub.title + ' (' + (pub.venue || '') + ')';
              }).join('\n'));
              return;
            }
            if (section === 'contact') {
              var affiliation = record.affiliation || {};
              out.push('', 'CONTACT', lines([
                [affiliation.department, affiliation.university].filter(Boolean).join(', '),
                [affiliation.office, affiliation.street, affiliation.city].filter(Boolean).join(', '),
                (record.contact || {}).email,
                (record.contact || {}).homepage
              ]));
              return;
            }
            // An agent can pass anything the schema's enum does not stop, so
            // this checks the list of real sections rather than which keys
            // cv.json happens to have -- person_id, name and path are on that
            // record too, and are not sections.
            if (CV_SECTIONS.indexOf(section) === -1) {
              out.push('', 'There is no "' + section + '" section on this CV. The sections are: ' +
                CV_SECTIONS.join(', ') + '.');
              return;
            }
            var items = record[section];
            if (!items || !items.length) {
              out.push('', section.toUpperCase(), '(nothing recorded)');
              return;
            }
            out.push('', section.toUpperCase().replace(/_/g, ' ') + ' (' + items.length + ')');
            out.push(items.map(function (item) { return '- ' + cvEntry(section, item); }).join('\n'));
          });

          return reply(lines(out));
        });
      }
    },

    {
      name: 'navigate_to_page',
      description:
        'Open a page of this website in the current tab, so the user can see what is being discussed. Takes ' +
        'the id of a publication, person, or research area, or the name of a section of the site — never a ' +
        'URL. Only use this when the user asks to be shown or taken somewhere; to read information, use the ' +
        'other tools, which do not move the page.',
      inputSchema: {
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            enum: ['home', 'research', 'team', 'news', 'writing', 'cv', 'publication', 'person', 'research_area'],
            description: 'What kind of page to open.'
          },
          id: {
            type: 'string',
            description: 'Required when destination is publication, person, or research_area: that record\'s id.'
          }
        },
        required: ['destination']
      },
      execute: function (input) {
        return index().then(function (data) {
          var path = null;
          var label = null;

          var needsId = ['publication', 'person', 'research_area'];
          if (needsId.indexOf(input.destination) !== -1 && !input.id) {
            return reply('Opening a ' + input.destination.replace('_', ' ') +
              ' needs its id in "id". Use ' +
              { publication: 'search_publications', person: 'list_people', research_area: 'list_research_areas' }[input.destination] +
              ' to find one.');
          }

          if (input.destination === 'publication') {
            var pub = input.id && findPublication(data, input.id);
            if (!pub) return reply('No publication matches "' + (input.id || '') + '". Use search_publications to find its id.');
            path = pub.path;
            label = pub.title;
          } else if (input.destination === 'person') {
            var matches = input.id ? findPeople(data, input.id) : [];
            if (matches.length !== 1) {
              return reply(matches.length
                ? '"' + input.id + '" matches several people; give one id.'
                : 'No one on this site matches "' + (input.id || '') + '".');
            }
            // Most people in the data have no page here; sending the tab to a
            // /team anchor that does not exist would silently do nothing.
            if (!matches[0].path) {
              return reply(matches[0].name + ' has no page on this site' +
                (matches[0].homepage ? '; their homepage is ' + matches[0].homepage : '.'));
            }
            path = matches[0].path;
            label = matches[0].name;
          } else if (input.destination === 'research_area') {
            var area = input.id && byId(data.research_areas, input.id);
            if (!area) return reply('No research area has the id "' + (input.id || '') + '". Use list_research_areas.');
            path = area.path;
            label = area.title;
          } else {
            var named = { home: '/', research: '/research/', team: '/team/', news: '/news/', writing: '/writing/', cv: '/oney_cv/' };
            // hasOwnProperty, not `named[x]`: "constructor" and "toString" are
            // truthy on any object literal, and would sail past a `!path` check
            // straight into location.assign.
            if (!Object.prototype.hasOwnProperty.call(named, input.destination)) {
              return reply('Unknown destination "' + asText(input.destination) + '". Sections of this site: ' +
                Object.keys(named).join(', ') + '.');
            }
            path = named[input.destination];
            label = input.destination;
          }

          // Same-origin by construction: `path` came out of index.json, so the
          // caller never supplies a URL and there is nothing to parse or escape.
          // "Already here" only when there is no fragment to scroll to. A
          // /team/#someone target while standing on /team/ is precisely the
          // case where the move is the point, so it must still happen.
          if (path.indexOf('#') === -1 && location.pathname.replace(/\/+$/, '/') === path) {
            return reply('Already on ' + label + ' (' + url(data, path) + ').');
          }

          // Return the result BEFORE navigating. Unloading the document while
          // the tool call is still outstanding loses the reply, so the agent is
          // told where it is going and the navigation happens just after.
          setTimeout(function () { location.assign(path); }, 100);
          return reply('Opening ' + label + ' — ' + url(data, path) + '.');
        });
      }
    }
  ];

  // The CV's three toggles are the only interactive state on this site, so
  // this tool exists only where they do.
  if (PAGE.isCv) {
    TOOLS.push({
      name: 'set_cv_display_options',
      description:
        'Turn the display options on Steve Oney\'s CV page on or off, so the reader can see them: underlining ' +
        'authors who were students when a paper was published, listing undergraduate and master\'s mentees, ' +
        'and showing paper awards. All three are off by default. Only available while the CV page is open, ' +
        'and it only changes what that page shows — it returns none of the revealed content itself.',
      inputSchema: {
        type: 'object',
        properties: {
          students: { type: 'boolean', description: 'Underline authors who were students at the time of publication.' },
          mentees: { type: 'boolean', description: 'Include undergraduate and master\'s collaborators in Students Supervised.' },
          awards: { type: 'boolean', description: 'Include paper awards in the Awards section.' }
        }
      },
      execute: function (input) {
        var changed = [];
        var missing = [];
        ['students', 'mentees', 'awards'].forEach(function (param) {
          if (typeof input[param] !== 'boolean') return;
          var toggle = document.querySelector('.cv-toggle[data-param="' + param + '"] input[type="checkbox"]');
          if (!toggle) { missing.push(param); return; }
          if (toggle.checked !== input[param]) {
            toggle.checked = input[param];
            // Let cv.js do the work: it owns the body class and the URL
            // parameter, and duplicating that here would let the two drift.
            toggle.dispatchEvent(new Event('change', { bubbles: true }));
          }
          changed.push(param + '=' + input[param]);
        });

        if (!changed.length && !missing.length) return reply('Nothing to change; pass at least one of students, mentees, or awards.');
        return reply(lines([
          changed.length ? 'CV display options set: ' + changed.join(', ') + '.' : null,
          missing.length ? 'Not available on this page: ' + missing.join(', ') + '.' : null
        ]));
      }
    });
  }

  // A CV record is one of several shapes; render each as one readable line
  // rather than dumping its keys.
  function cvEntry(section, item) {
    var dates = [item.date_start, item.date_end].filter(Boolean).join('–') || item.date || item.year || '';
    if (section === 'education') {
      var degrees = (item.degrees || []).map(function (pair) { return pair.join(' in '); }).join(', ');
      return [degrees, item.university, item.location, dates].filter(Boolean).join(' — ');
    }
    if (section === 'professional_experience') {
      return [item.title, item.institution, item.location, dates].filter(Boolean).join(' — ');
    }
    if (section === 'grants') {
      return [item.title, item.sponsor, item.program, item.amount ? '$' + item.amount : null,
        stripMarkdown(item.team), dates].filter(Boolean).join(' — ');
    }
    if (section === 'supervised_students') {
      return [item.student_name, item.category && item.category.replace(/_/g, ' '), item.thesis_title,
        item.current_position ? 'now: ' + item.current_position : null, dates].filter(Boolean).join(' — ');
    }
    if (section === 'teaching') {
      return [item.number, item.title, item.institution, dates].filter(Boolean).join(' — ');
    }
    return [item.title || item.name || item.role, item.venue || item.institution || item.publication ||
      item.sponsor, stripMarkdown(item.description), dates].filter(Boolean).join(' — ');
  }

  // CV strings carry Markdown emphasis for the rendered page ("**Steve Oney
  // (PI)**"); the asterisks are noise in a tool result.
  function stripMarkdown(text) {
    if (!text) return null;
    return String(text).replace(/\*\*/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  }

  // Every tool answers with a string, including when it fails -- see the note
  // at the top of the file. A rejected promise reaches the agent as an opaque
  // error it cannot act on, so this converts the two things that can still
  // produce one (an unreachable JSON file, and a bug here) into a sentence
  // that says what to do instead. Each tool's own handler already replies to
  // the failures it can anticipate; this only catches what it did not.
  function guarded(tool) {
    var run = tool.execute;
    tool.execute = function (input) {
      try {
        return Promise.resolve(run(input || {})).catch(recover);
      } catch (error) {
        return Promise.resolve(recover(error));
      }
    };
    return tool;
  }

  function recover(error) {
    console.warn('WebMCP: tool call failed', error);
    return reply('This site\'s data could not be read, so the tool has no answer. ' +
      'The same information is on the page itself — https://from.so has the publications at /research/, ' +
      'the people at /team/, and the news at /news/.');
  }

  // Registration is per-document and dies with it, so there is nothing to
  // unregister; the AbortSignal the spec provides is for tools that come and
  // go within a page, which none of these do. Failures are logged and skipped
  // one at a time: one bad tool should not take the rest of them down.
  //
  // registerTool is specified to return a promise, but Chrome shipped a build
  // where it returns undefined and throws synchronously instead, so both the
  // try/catch and the duck-typed .catch below are load-bearing.
  TOOLS.map(guarded).forEach(function (tool) {
    try {
      var registered = modelContext.registerTool(tool);
      if (registered && typeof registered.catch === 'function') {
        registered.catch(function (error) {
          console.warn('WebMCP: could not register ' + tool.name, error);
        });
      }
    } catch (error) {
      console.warn('WebMCP: could not register ' + tool.name, error);
    }
  });
})();
