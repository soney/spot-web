// Wires up the CV's checkbox toggles (student-author highlighting, other
// mentees, paper awards). Each checkbox mirrors its state to a class on
// <body> (which the CSS in cv.css keys off) and to a URL parameter, so
// toggle states survive reload and can be shared as links.
//
// Toggles are declared in the markup by _includes/cv_toggle.html, which
// emits data-param and data-body-class; nothing here needs updating to add
// one.
//
// The same checkboxes are the parameters of the CV's WebMCP tool,
// set_cv_display_options -- the `cv-display-options` form in cv_body.html,
// which the browser registers from its toolname/tooldescription attributes
// (https://developer.chrome.com/docs/ai/webmcp/declarative-api). When an agent
// calls it, the browser sets the checkboxes to the agent's values and, because
// the form has `toolautosubmit`, submits it. No `change` event fires for a
// checkbox set that way, so the submit handler below re-applies every toggle
// from its checkbox, then answers the agent through e.respondWith(). A human
// never submits this form: it has no button, and the toggles work on change.
(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var toggles = [];

  // The one place a checkbox's state becomes the page's state.
  function apply(toggle) {
    var checkbox = toggle.checkbox;
    document.body.classList.toggle(toggle.bodyClass, checkbox.checked);
    var currentUrl = new URL(window.location);
    if (checkbox.checked) {
      currentUrl.searchParams.set(toggle.param, 'true');
    } else {
      currentUrl.searchParams.delete(toggle.param);
    }
    window.history.replaceState({}, '', currentUrl);
  }

  document.querySelectorAll('.cv-toggle[data-param]').forEach(function (element) {
    var checkbox = element.querySelector('input[type="checkbox"]');
    if (!checkbox) return;
    var toggle = { checkbox: checkbox, param: element.dataset.param, bodyClass: element.dataset.bodyClass };
    toggles.push(toggle);

    // Check URL on load
    if (urlParams.get(toggle.param) === 'true') {
      checkbox.checked = true;
    }
    // Initialize body class
    document.body.classList.toggle(toggle.bodyClass, checkbox.checked);

    checkbox.addEventListener('change', function () { apply(toggle); });
  });

  var form = document.getElementById('cv-display-options');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    // Never let the form navigate: a GET submission of itself would reload
    // the page with ?students=on, which is not the URL shape shared links use.
    event.preventDefault();
    toggles.forEach(apply);
    if (!event.agentInvoked || typeof event.respondWith !== 'function') return;
    // A sentence of state, not of content: the tool changes what the page
    // shows, and get_cv is how an agent reads the CV.
    var states = toggles.map(function (toggle) {
      return toggle.param + (toggle.checkbox.checked ? ' on' : ' off');
    });
    event.respondWith(Promise.resolve(
      'CV display options are now: ' + states.join(', ') + '. The page shows them at ' + window.location.href
    ));
  });
})();

// Scroll-spy for the outline rail: marks the link of the section on screen
// with .active (cv.css draws the accent and unfolds that section's
// subsection list), and within it the subsection on screen the same way.
// The rail is CSS-hidden below 1400px, but the bookkeeping is cheap enough
// that gating it on visibility is not worth the resize listener it would
// take. Rects are read live on each pass, so sections that grow or shrink
// under the CV's toggles stay correctly tracked.
(function () {
  var nav = document.querySelector('.cv-outline');
  if (!nav) return;

  var pairs = [];
  nav.querySelectorAll('.col.main > ul > li').forEach(function (li) {
    var link = li.querySelector(':scope > a[href^="#"]');
    var target = link && document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    var subs = [];
    li.querySelectorAll(':scope > ul a[href^="#"]').forEach(function (subLink) {
      var subTarget = document.getElementById(subLink.getAttribute('href').slice(1));
      if (subTarget) subs.push({ link: subLink, target: subTarget });
    });
    pairs.push({ link: link, target: target, subs: subs });
  });
  if (pairs.length === 0) return;

  var ticking = false;

  function update() {
    ticking = false;
    var current = pairs[0];
    // The last sections may be too short to ever reach the top band, so the
    // end of the document counts as "you are at the last one".
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = pairs[pairs.length - 1];
    } else {
      pairs.forEach(function (pair) {
        if (pair.target.getBoundingClientRect().top <= 120) current = pair;
      });
    }
    // The same band picks the subsection within the current section; null
    // while the reader is still above its first subsection heading.
    var currentSub = null;
    current.subs.forEach(function (sub) {
      if (sub.target.getBoundingClientRect().top <= 120) currentSub = sub;
    });
    pairs.forEach(function (pair) {
      pair.link.classList.toggle('active', pair === current);
      pair.subs.forEach(function (sub) {
        sub.link.classList.toggle('active', sub === currentSub);
      });
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  // Direct calls, not the rAF path: these fire once around a navigation
  // (opening /cv/#service, clicking a rail link, scroll restored on reload),
  // where the highlight being a frame late is visible as a flash of the
  // wrong entry.
  window.addEventListener('load', update);
  window.addEventListener('hashchange', update);
  update();
})();
