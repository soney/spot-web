// This site's WebMCP tools, so a browser agent standing on any page of from.so
// can search the publications, look someone up, read the CV, or open a page
// -- from the data in _data/, not by scraping whatever HTML is on screen.
//
// This file is the IMPERATIVE half: ten tools registered through
// `document.modelContext.registerTool()`, as described at
// https://developer.chrome.com/docs/ai/webmcp/imperative-api. The site's one
// DECLARATIVE tool, set_cv_display_options, is not here at all -- it is the
// `<form toolname="...">` in _includes/cv_body.html, whose checkboxes are the
// parameters and whose submit handler in assets/js/cv.js answers the agent.
// The browser registers that one from the markup; there is nothing to do here.
//
// WebMCP exists only in Chrome, in the origin trial that _config.yml's token
// opts from.so into, or locally behind chrome://flags/#enable-webmcp-testing.
// Everywhere else `document.modelContext` is undefined and the first line of
// the IIFE returns: nothing is fetched, nothing changes on the page.
//
// DATA. /assets/mcp/index.json and /assets/mcp/cv.json, built from _data/ by
// _plugins/mcp_index.rb. Their URLs arrive as data attributes on this script's
// own tag (written by _includes/webmcp_script.html) so they survive a baseurl
// change. Each file is fetched at most once, the first time a tool needs it.
//
// RESULTS. Every tool resolves to a plain string, including when it fails.
// Chrome hands a string to the agent untouched, JSON-encodes anything else,
// and turns a thrown error into an opaque "Tool was executed but the
// invocation failed" -- so a failure here is a sentence naming the tool to
// call next, never an exception. That sentence is the only place a result
// addresses the model; everything else is data with no instructions in it.
//
// ANNOTATIONS. `readOnlyHint: true` on every tool that only reads, because the
// hint defaults to false and an agent then assumes the call has side effects.
// navigate_to_page, the one tool here that does something, leaves it off.
// `untrustedContentHint` is absent on purpose: every string these tools return
// was written into _data/ by the group. A tool that ever returns content the
// site did not author (comments, an imported feed) needs that hint.
//
// NAVIGATION IS ALLOWLISTED. navigate_to_page never takes a URL. It takes the
// id of a record and resolves it against index.json, so a tool call cannot be
// talked into sending the tab off-site.
(() => {
  'use strict';

  const modelContext = document.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== 'function') return;

  const script = document.currentScript;
  if (!script) return;
  const INDEX_URL = script.dataset.mcpIndex;
  const CV_URL = script.dataset.mcpCv;
  // Which record the page the user is looking at is about, so "this paper"
  // and "this person" can default rather than be guessed.
  const PAGE = {
    paperId: script.dataset.mcpPaperId || null,
    personId: script.dataset.mcpPersonId || null
  };

  // ---------------------------------------------------------------- loading

  const cache = new Map();

  // The AbortSignal is the one execute() receives: Chrome passes it when the
  // user or agent cancels a call, and it is threaded into the fetch so a
  // cancelled first call does not leave a download running. A failed or
  // aborted load is dropped from the cache so the next call retries it.
  function load(url, signal) {
    if (!cache.has(url)) {
      const pending = fetch(url, { credentials: 'omit', signal })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
          return response.json();
        })
        .catch((error) => {
          cache.delete(url);
          throw error;
        });
      cache.set(url, pending);
    }
    return cache.get(url);
  }

  const index = (signal) => load(INDEX_URL, signal);
  const cv = (signal) => load(CV_URL, signal);

  // ------------------------------------------------------------ formatting

  // A backstop against a data change producing an enormous answer, not a
  // budget: the tools are sized so ordinary results are 1-3K. The largest
  // legitimate answer is get_cv's numbered publication list (~7K, one line per
  // paper). If it ever approaches this, give that section a filter rather
  // than raising the number.
  const MAX_REPLY_CHARS = 8000;

  function reply(text) {
    const out = String(text ?? '');
    if (out.length <= MAX_REPLY_CHARS) return out;
    return `${out.slice(0, MAX_REPLY_CHARS - 90)}\n…[truncated] Ask again for a narrower slice — a smaller limit, or fewer sections.`;
  }

  // Absolute from.so URLs: an agent quoting a link wants one that works when
  // pasted somewhere else, not one relative to this tab.
  function url(data, path) {
    if (!path) return null;
    const origin = (data.site && data.site.url) || location.origin;
    return origin.replace(/\/$/, '') + path;
  }

  // The site's own prose links records by root-relative path, which is a dead
  // link once quoted elsewhere. Absolutize those and leave the Markdown alone.
  function absoluteLinks(data, text) {
    if (!text) return text;
    return text.replace(/\]\((\/[^)]*)\)/g, (_, path) => `](${url(data, path)})`);
  }

  function truncate(text, max) {
    if (!text || text.length <= max) return text || '';
    return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
  }

  const lines = (parts) => parts.filter(Boolean).join('\n');
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  // CV strings carry Markdown emphasis for the rendered page ("**Steve Oney
  // (PI)**"); the asterisks are noise in a tool result.
  function stripMarkdown(text) {
    if (!text) return null;
    return String(text).replace(/\*\*/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  }

  // One publication as a compact entry. Long author lists are cut to the
  // first three so a 12-author paper does not crowd out the next result --
  // except that `keepIds` (the authors a search was filtered by) are never
  // hidden, or a search for someone returns papers none of whose visible
  // names is theirs. No PDF or DOI link here: get_publication has them.
  function pubLine(data, pub, n, keepIds = []) {
    let authors = pub.authors || '';
    const ids = pub.author_ids || [];
    if (ids.length > 4) {
      const shown = ids.slice(0, 3);
      const held = keepIds.filter((id) => ids.includes(id) && !shown.includes(id));
      authors = `${shown.concat(held).map((id) => personName(data, id)).join(', ')}, et al.`;
    }
    return lines([
      `${n ? `${n}. ` : ''}${pub.title}`,
      `   ${authors} — ${pub.venue || 'unpublished'}${pub.award ? ` — ${pub.award}` : ''}`,
      `   ${url(data, pub.path)}`,
      pub.summary ? `   ${truncate(pub.summary, 150)}` : null
    ]);
  }

  function personLine(data, person) {
    const where = person.path ? url(data, person.path) : person.homepage;
    return lines([
      `- ${person.name}${person.title ? ` — ${person.title}` : ''}`,
      where ? `  ${where}` : null
    ]);
  }

  // A CV record is one of several shapes; render each as one readable line
  // rather than dumping its keys.
  function cvEntry(section, item) {
    const dates = [item.date_start, item.date_end].filter(Boolean).join('–') || item.date || item.year || '';
    const join = (parts) => parts.filter(Boolean).join(' — ');
    switch (section) {
      case 'education':
        return join([(item.degrees || []).map((pair) => pair.join(' in ')).join(', '),
          item.university, item.location, dates]);
      case 'professional_experience':
        return join([item.title, item.institution, item.location, dates]);
      case 'grants':
        return join([item.title, item.sponsor, item.program, item.amount ? `$${item.amount}` : null,
          stripMarkdown(item.team), dates]);
      case 'supervised_students':
        return join([item.student_name, item.category && item.category.replace(/_/g, ' '), item.thesis_title,
          item.current_position ? `now: ${item.current_position}` : null, dates]);
      case 'teaching':
        return join([item.number, item.title, item.institution, dates]);
      default:
        return join([item.title || item.name || item.role,
          item.venue || item.institution || item.publication || item.sponsor,
          stripMarkdown(item.description), dates]);
    }
  }

  // --------------------------------------------------------------- lookups

  const byId = (records, id) => records.find((record) => record.id === id) || null;

  function personName(data, id) {
    const person = byId(data.people, id);
    return person ? person.name : id;
  }

  // Chrome passes the agent's arguments through without validating them
  // against the schema, so anything that reaches a string or array operation
  // is coerced first. A number where a string was declared should search for
  // that number, not fail the call.
  const asText = (value) => (value == null ? '' : String(value));
  const asArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);

  function normalize(text) {
    return asText(text).toLowerCase()
      // Accents off so "Zurich" finds "Zürich"; punctuation off so a pasted
      // citation's title matches the one in the data.
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function terms(query) {
    const normalized = normalize(query);
    return normalized ? normalized.split(' ') : [];
  }

  // Resolve a person by id, full name, or any part of a name. Returns every
  // match so an ambiguous "Zhang" can be reported rather than silently
  // resolved to whichever record comes first.
  function findPeople(data, who) {
    const needle = normalize(who);
    if (!needle) return [];
    const exact = [];
    const partial = [];
    for (const person of data.people) {
      const name = normalize(person.name);
      if (person.id === who || name === needle) {
        exact.push(person);
      } else if (name.split(' ').includes(needle) || name.includes(needle) ||
        person.id.includes(needle.replace(/ /g, '_'))) {
        partial.push(person);
      }
    }
    return exact.length ? exact : partial;
  }

  // Agents paste titles at least as often as ids, so both resolve. The exact
  // title is tried before any substring match: several titles here are
  // prefixes of others ("CFlow: …" and "Demonstration of CFlow: …"), and a
  // substring pass alone would find two matches for a title that was given
  // exactly right and then resolve to neither.
  function findPublication(data, key) {
    const exact = byId(data.publications, key);
    if (exact) return exact;
    const needle = normalize(key);
    if (!needle) return null;
    const titled = data.publications.find((pub) => normalize(pub.title) === needle);
    if (titled) return titled;
    const matches = data.publications.filter((pub) => normalize(pub.title).includes(needle));
    return matches.length === 1 ? matches[0] : null;
  }

  // ---------------------------------------------------------------- search

  // Score by where a term hits, so a title match outranks a paper that merely
  // mentions the word in its abstract. Every term must hit something: a
  // two-word query is an AND, which is what a person typing one expects.
  function score(pub, queryTerms) {
    const haystacks = [
      [normalize(pub.title), 10],
      [normalize(pub.summary), 4],
      [normalize(pub.authors), 4],
      [normalize(`${pub.venue} ${pub.venue_full_name || ''}`), 3],
      [normalize((pub.research_area_ids || []).join(' ')), 2],
      [normalize(pub.abstract), 1]
    ];
    let total = 0;
    for (const term of queryTerms) {
      let best = 0;
      for (const [text, weight] of haystacks) {
        if (weight > best && text.includes(term)) best = weight;
      }
      if (!best) return 0;
      total += best;
    }
    return total;
  }

  function searchPublications(data, input) {
    let results = data.publications.slice();
    let matchedAuthors = null;
    let authorIds = [];

    if (input.author) {
      const people = findPeople(data, input.author);
      if (!people.length) return { error: `No person on this site matches "${input.author}".` };
      authorIds = people.map((person) => person.id);
      // A partial name can match several people ("Zhang" matches four).
      // Filtering on all of them is the useful behaviour, but the answer has
      // to say so, or the caller reads a union as one person's record.
      if (people.length > 1) matchedAuthors = people.map((person) => person.name);
      results = results.filter((pub) => (pub.author_ids || []).some((id) => authorIds.includes(id)));
    }
    if (input.research_area) {
      results = results.filter((pub) => (pub.research_area_ids || []).includes(input.research_area));
    }
    if (input.venue) {
      const venue = normalize(input.venue);
      results = results.filter((pub) =>
        normalize(`${pub.venue} ${pub.venue_full_name || ''} ${pub.venue_id}`).includes(venue));
    }
    if (input.type) results = results.filter((pub) => pub.type === input.type);
    if (input.year_from) results = results.filter((pub) => pub.year >= input.year_from);
    if (input.year_to) results = results.filter((pub) => pub.year <= input.year_to);
    if (input.award_winning) results = results.filter((pub) => !!pub.award);

    const queryTerms = terms(input.query);
    if (queryTerms.length) {
      results = results
        .map((pub) => ({ pub, score: score(pub, queryTerms) }))
        .filter((hit) => hit.score > 0)
        // A stable sort, so ties keep index.json's newest-first order and
        // equally relevant papers read as they do on /research.
        .sort((a, b) => b.score - a.score)
        .map((hit) => hit.pub);
    }

    return { results, matchedAuthors, authorIds };
  }

  // ----------------------------------------------------------------- tools

  const PUBLICATION_TYPES = ['conference', 'journal', 'poster', 'workshop', 'demo', 'doctoralconsortium',
    'panel', 'bookchapter', 'preprint', 'thesis'];

  // The sections get_cv can read, in the order cv_body.html renders them.
  // "publications" is not a key of cv.json: it is assembled from the index
  // plus that file's publication_codes map.
  const CV_SECTIONS = ['contact', 'education', 'professional_experience', 'publications', 'grants',
    'awards', 'invited_presentations', 'service', 'teaching', 'supervised_students', 'press', 'patents'];

  const TOOLS = [
    {
      name: 'search_publications',
      description:
        'Search the SPOT research group\'s publications by topic, author, venue, year, or research area. ' +
        'Returns a ranked list of titles with authors, venue, and links. Use this to find papers, then ' +
        'get_publication for one paper\'s abstract, BibTeX, or PDF. Every filter is optional and they ' +
        'combine (AND). Omit "query" to list everything matching the filters, newest first.',
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
            enum: PUBLICATION_TYPES,
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const found = searchPublications(data, input);
        if (found.error) return found.error;

        // 15 because a page of results runs ~330 characters each, and a
        // bigger one would be cut mid-entry by the reply cap.
        const limit = Math.min(Math.max(Number(input.limit) || 6, 1), 15);
        const page = found.results.slice(0, limit);
        if (!page.length) {
          return 'No publications match. Try fewer filters, or list_research_areas to see what this group works on.';
        }

        return lines([
          found.matchedAuthors
            ? `"${input.author}" matched ${found.matchedAuthors.join(', ')}; these are the papers by any of them.`
            : null,
          `Found ${plural(found.results.length, 'publication')}` +
            `${found.results.length > page.length ? `, showing the first ${page.length}` : ''}:`,
          '',
          page.map((pub, i) => pubLine(data, pub, i + 1, found.authorIds)).join('\n\n')
        ]);
      }
    },

    {
      name: 'get_publication',
      description:
        'Get everything about one publication: full abstract, complete author list, venue, awards, DOI, ' +
        'PDF link, and a ready-to-paste BibTeX entry. Identify the paper by its id (from search_publications) ' +
        'or its exact title. On a /papers/ page, omit the identifier to get the paper being viewed. For ' +
        'several papers\' citations at once, use get_bibtex instead.',
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const key = input.publication || PAGE.paperId;
        if (!key) return 'No paper specified, and the current page is not a paper page. Use search_publications to find one.';

        const pub = findPublication(data, key);
        if (!pub) return `No publication matches "${key}". Use search_publications to find its id.`;

        const studentIds = pub.student_author_ids || [];
        const authors = (pub.author_ids || [])
          .map((id) => personName(data, id) + (studentIds.includes(id) ? ' (student at the time)' : ''))
          .join(', ');
        const areas = (pub.research_area_ids || []).map((id) => {
          const area = byId(data.research_areas, id);
          return area ? area.title : id;
        });

        return lines([
          pub.title,
          '',
          `Authors: ${authors}`,
          `Venue: ${pub.venue_full_name || pub.venue || 'unpublished'}` +
            `${pub.year ? `, ${pub.year}` : ''}${pub.venue_location ? `, ${pub.venue_location}` : ''}`,
          `Type: ${pub.type || 'unknown'}`,
          pub.award ? `Award: ${pub.award}` : null,
          areas.length ? `Research area: ${areas.join('; ')}` : null,
          `Page: ${url(data, pub.path)}`,
          pub.pdf_path ? `PDF: ${url(data, pub.pdf_path)}` : null,
          pub.doi ? `DOI: https://doi.org/${pub.doi}` : null,
          '',
          pub.abstract ? `Abstract: ${pub.abstract}`
            : (pub.summary ? `Summary: ${pub.summary}` : 'No abstract on file.'),
          '',
          'BibTeX:',
          pub.bibtex
        ]);
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const wanted = asArray(input.publications);
        if (!wanted.length) return 'No publications given. Use search_publications to find ids first.';
        // 25 entries is about 8K of BibTeX, which is where the reply cap is.
        if (wanted.length > 25) {
          return `That is ${wanted.length} publications; ask for at most 25 at a time so the entries come back whole.`;
        }

        const entries = [];
        const missing = [];
        for (const key of wanted) {
          const pub = findPublication(data, key);
          if (pub) entries.push(pub.bibtex); else missing.push(key);
        }
        return lines([
          entries.join('\n\n'),
          missing.length ? `\nNot found: ${missing.join(', ')}` : null
        ]) || 'None of those matched a publication on this site.';
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const groups = {
          current_members: ['current_member'],
          alumni: ['alum'],
          student_collaborators: ['ugrad_ms_collaborator'],
          external_collaborators: ['external_collaborator'],
          everyone: ['current_member', 'alum', 'ugrad_ms_collaborator', 'external_collaborator', 'unlisted']
        };
        const labels = {
          current_member: 'Current members',
          alum: 'PhD and postdoc alumni',
          ugrad_ms_collaborator: 'Undergraduate and master\'s collaborators',
          external_collaborator: 'External co-authors (not group members)',
          unlisted: 'Other'
        };
        const wanted = Object.hasOwn(groups, input.group) ? groups[input.group] : groups.current_members;

        const out = [];
        for (const status of wanted) {
          const people = data.people.filter((person) => person.group_status === status);
          if (!people.length) continue;
          // External co-authors are in the data for their names on papers,
          // and there are a hundred of them; listing all of them buries the
          // answer to any question that was really about the group.
          const shown = status === 'external_collaborator' ? people.slice(0, 25) : people;
          out.push(`${labels[status]} (${people.length}):`);
          out.push(shown.map((person) => personLine(data, person)).join('\n'));
          if (shown.length < people.length) {
            out.push(`  … and ${people.length - shown.length} more; use search_publications with an author name to find a specific one.`);
          }
          out.push('');
        }
        return lines(out) || 'No one in that group.';
      }
    },

    {
      name: 'get_person',
      description:
        'Get one person\'s bio, role, homepage, other links, the courses they teach, and the papers they ' +
        'co-authored on this site. For the few people with a long-form profile page, the full profile too. ' +
        'Accepts a full or partial name ("Oney", "Ashley Zhang") or a person id. On a /people/ page, omit ' +
        'the name to get the person whose page is being viewed. Use list_people to see who is here.',
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const key = input.person || PAGE.personId;
        if (!key) return 'No person specified, and the current page is not a person page. Use list_people to see who is on this site.';

        const matches = findPeople(data, key);
        if (!matches.length) return `No one on this site matches "${key}".`;
        if (matches.length > 1) {
          return lines([
            `"${key}" matches ${matches.length} people. Ask again with one of:`,
            matches.slice(0, 10).map((person) => `- ${person.name} (id: ${person.id})`).join('\n'),
            matches.length > 10 ? `… and ${matches.length - 10} more; give a fuller name.` : null
          ]);
        }

        const person = matches[0];
        const statusText = {
          current_member: 'Current member of the SPOT group',
          alum: 'Alum of the SPOT group',
          ugrad_ms_collaborator: 'Undergraduate or master\'s collaborator',
          external_collaborator: 'External co-author, not a member of the group',
          unlisted: 'In the publication data but not listed on the team page'
        }[person.group_status];
        const pubs = (person.publication_ids || []).map((id) => byId(data.publications, id)).filter(Boolean);

        const body = [
          person.name + (person.pronouns ? ` (${person.pronouns})` : ''),
          person.title ? person.title.replace(/, /g, ' — ') : null,
          statusText,
          person.path ? `Page: ${url(data, person.path)}` : null,
          person.homepage ? `Homepage: ${person.homepage}` : null,
          person.name_recording ? `Name pronunciation recording: ${url(data, person.name_recording)}` : null
        ];
        for (const link of person.links || []) {
          body.push(`${link.description}: ${link.url.startsWith('/') ? url(data, link.url) : link.url}`);
        }
        if (person.bio) body.push('', absoluteLinks(data, person.bio));
        // The long-form profile from their page, when they have one, after
        // the bio -- which stays the one-paragraph summary.
        if (person.profile) body.push('', absoluteLinks(data, person.profile));

        if (input.include_publications !== false && pubs.length) {
          body.push('', `Publications on this site (${pubs.length}), newest first:`);
          body.push(pubs.slice(0, 12).map((pub) => `- ${pub.title} — ${pub.venue || 'unpublished'}`).join('\n'));
          if (pubs.length > 12) {
            body.push(`… and ${pubs.length - 12} more; use search_publications with author "${person.name}".`);
          }
        }

        // The courses their page lists, which is a recent subset of what a CV
        // would carry -- hence "on this site". get_cv has the full list for
        // the person whose CV is here.
        if ((person.teaching || []).length) {
          body.push('', `Teaching listed on this site (${person.teaching.length}):`);
          body.push(person.teaching.map((course) =>
            `- ${[course.title, course.institution,
              [course.date_start, course.date_end].filter(Boolean).join('–')].filter(Boolean).join(' — ')}`
          ).join('\n'));
        }

        return lines(body);
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
      async execute(_input, { signal } = {}) {
        const data = await index(signal);
        return data.research_areas.map((area) => lines([
          `${area.title}  (id: ${area.id})`,
          `  ${truncate(area.description, 190)}`,
          `  People: ${(area.member_ids || []).map((id) => personName(data, id)).join(', ')}`,
          `  ${plural((area.publication_ids || []).length, 'publication')} — ${url(data, area.path)}`
        ])).join('\n\n');
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        let items = data.news.slice();
        let matchedPeople = null;

        if (input.person) {
          const matches = findPeople(data, input.person);
          if (!matches.length) return `No one on this site matches "${input.person}".`;
          const ids = matches.map((person) => person.id);
          // As in search_publications: a partial name can be several people,
          // and a union has to be labelled as one.
          if (matches.length > 1) matchedPeople = matches.map((person) => person.name);
          items = items.filter((item) => (item.person_ids || []).some((id) => ids.includes(id)));
        }
        if (input.since) {
          const since = asText(input.since);
          items = items.filter((item) => item.date >= since);
        }

        const limit = Math.min(Math.max(Number(input.limit) || 8, 1), 30);
        const page = items.slice(0, limit);
        if (!page.length) return 'No news items match.';

        return lines([
          matchedPeople
            ? `"${input.person}" matched ${matchedPeople.join(', ')}; these are the items mentioning any of them.\n`
            : null,
          page.map((item) => `${item.date}: ${absoluteLinks(data, item.text)}`).join('\n\n'),
          items.length > page.length ? `\n(${plural(items.length - page.length, 'older item')} not shown.)` : null,
          `\nFull list: ${url(data, '/news/')}`
        ]);
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
      async execute(_input, { signal } = {}) {
        const data = await index(signal);
        const counts = {};
        for (const person of data.people) {
          counts[person.group_status] = (counts[person.group_status] || 0) + 1;
        }
        return lines([
          `${data.site.name} — ${data.site.url}`,
          data.site.description,
          '',
          absoluteLinks(data, data.group.overview),
          data.group.announcement ? `\nAnnouncement: ${absoluteLinks(data, data.group.announcement)}` : null,
          '',
          `Research areas: ${data.research_areas.map((area) => area.title).join('; ')}`,
          `Size: ${counts.current_member || 0} current members, ${counts.alum || 0} alumni, ` +
            `${data.publications.length} publications on the site.`,
          `Contact: ${data.site.contact_email}`,
          `Affiliated with: ${data.group.affiliations.map((item) => item.name).join(', ')}`,
          `Support: ${data.group.sponsors.map((item) => item.name).join(', ')}`,
          '',
          'Joining the group:',
          absoluteLinks(data, data.group.joining),
          data.writing.length ? `\nGuides the group has published (${url(data, '/writing/')}):` : null,
          data.writing.map((post) =>
            `- ${post.title}${post.date ? ` (${post.date})` : ''}${post.url ? ` — ${post.url}` : ''}`
          ).join('\n')
        ]);
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
            items: { type: 'string', enum: CV_SECTIONS },
            description: 'Which sections to return. Defaults to contact, education, and professional_experience. ' +
              '"publications" is the CV\'s numbered list (J.3, C.31, ...) and is long.'
          }
        }
      },
      async execute(input, { signal } = {}) {
        const [data, record] = await Promise.all([index(signal), cv(signal)]);
        const asked = asArray(input.sections).map(asText);
        const wanted = asked.length ? asked : ['contact', 'education', 'professional_experience'];

        const out = [`${record.name} — CV: ${url(data, record.path)}`];
        for (const section of wanted) {
          if (section === 'publications') {
            out.push('', 'PUBLICATIONS, as numbered on the CV. The code counts down from each type\'s total, ' +
              'so it shifts when an older paper of that type is added.');
            out.push(data.publications
              .filter((pub) => record.publication_codes[pub.id])
              .map((pub) => `${record.publication_codes[pub.id]}  ${pub.title} (${pub.venue || ''})`)
              .join('\n'));
            continue;
          }
          if (section === 'contact') {
            const affiliation = record.affiliation || {};
            const contact = record.contact || {};
            out.push('', 'CONTACT', lines([
              [affiliation.department, affiliation.university].filter(Boolean).join(', '),
              [affiliation.office, affiliation.street, affiliation.city].filter(Boolean).join(', '),
              contact.email,
              contact.homepage
            ]));
            continue;
          }
          // Checked against the list of real sections rather than the keys
          // cv.json happens to have: person_id, name and path are on that
          // record too, and are not sections.
          if (!CV_SECTIONS.includes(section)) {
            out.push('', `There is no "${section}" section on this CV. The sections are: ${CV_SECTIONS.join(', ')}.`);
            continue;
          }
          const items = record[section];
          if (!items || !items.length) {
            out.push('', section.toUpperCase(), '(nothing recorded)');
            continue;
          }
          out.push('', `${section.toUpperCase().replace(/_/g, ' ')} (${items.length})`);
          out.push(items.map((item) => `- ${cvEntry(section, item)}`).join('\n'));
        }
        return lines(out);
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
      async execute(input, { signal } = {}) {
        const data = await index(signal);
        const destination = asText(input.destination);
        const id = asText(input.id);
        let path = null;
        let label = null;

        const finders = { publication: 'search_publications', person: 'list_people', research_area: 'list_research_areas' };
        if (Object.hasOwn(finders, destination) && !id) {
          return `Opening a ${destination.replace('_', ' ')} needs its id in "id". Use ${finders[destination]} to find one.`;
        }

        if (destination === 'publication') {
          const pub = findPublication(data, id);
          if (!pub) return `No publication matches "${id}". Use search_publications to find its id.`;
          path = pub.path;
          label = pub.title;
        } else if (destination === 'person') {
          const matches = findPeople(data, id);
          if (matches.length !== 1) {
            return matches.length
              ? `"${id}" matches several people; give one id.`
              : `No one on this site matches "${id}".`;
          }
          // Most people in the data have no page here; sending the tab to a
          // /team anchor that does not exist would silently do nothing.
          if (!matches[0].path) {
            return `${matches[0].name} has no page on this site` +
              (matches[0].homepage ? `; their homepage is ${matches[0].homepage}` : '.');
          }
          path = matches[0].path;
          label = matches[0].name;
        } else if (destination === 'research_area') {
          const area = byId(data.research_areas, id);
          if (!area) return `No research area has the id "${id}". Use list_research_areas.`;
          path = area.path;
          label = area.title;
        } else {
          const named = { home: '/', research: '/research/', team: '/team/', news: '/news/', writing: '/writing/',
            cv: '/people/steve_oney/cv/' };
          // hasOwn, not `named[x]`: "constructor" is truthy on any object
          // literal and would sail past a `!path` check into location.assign.
          if (!Object.hasOwn(named, destination)) {
            return `Unknown destination "${destination}". Sections of this site: ${Object.keys(named).join(', ')}.`;
          }
          path = named[destination];
          label = destination;
        }

        // Same-origin by construction: `path` came out of index.json, so the
        // caller never supplies a URL and there is nothing to parse or escape.
        // "Already here" only when there is no fragment to scroll to: a
        // /team/#someone target while standing on /team/ is precisely the
        // case where the move is the point.
        if (!path.includes('#') && location.pathname.replace(/\/+$/, '/') === path) {
          return `Already on ${label} (${url(data, path)}).`;
        }

        // Resolve first, navigate on the next tick. Chrome reports null to the
        // agent for a call that is still outstanding when the document goes
        // away, so the answer is handed over before the tab moves.
        setTimeout(() => location.assign(path), 50);
        return `Opening ${label} — ${url(data, path)}.`;
      }
    }
  ];

  // ---------------------------------------------------------- registration

  // Every tool resolves to a string, including when it fails -- see the note
  // at the top of the file. Each handler already answers the failures it can
  // anticipate; this catches the two it cannot (an unreachable JSON file, and
  // a bug here) and a cancellation, which needs no answer at all.
  function guarded(tool) {
    const run = tool.execute;
    return {
      ...tool,
      async execute(input, options = {}) {
        try {
          return reply(await run(input || {}, options));
        } catch (error) {
          if (error && error.name === 'AbortError') throw error;
          console.warn(`WebMCP: ${tool.name} failed`, error);
          return reply('This site\'s data could not be read, so the tool has no answer. The same information ' +
            'is on the page itself — https://from.so has the publications at /research/, the people at ' +
            '/team/, and the news at /news/.');
        }
      }
    };
  }

  // Registration lives and dies with the document, so there is no
  // AbortController here: the signal option exists for tools that come and go
  // within a page, and none of these do. Each registration is awaited on its
  // own so that one bad descriptor is logged and skipped rather than taking
  // the rest down with it.
  (async () => {
    for (const tool of TOOLS) {
      try {
        await modelContext.registerTool(guarded(tool));
      } catch (error) {
        console.warn(`WebMCP: could not register ${tool.name}`, error);
      }
    }
  })();
})();
