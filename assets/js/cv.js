// Wires up the CV's checkbox toggles (student-author highlighting, the
// journal/conference split, other mentees, paper awards). Each checkbox
// mirrors its state to a class on <body> (which the CSS in cv.css keys off)
// and to a URL parameter, so toggle states survive reload and can be shared
// as links.
//
// Toggles are declared in the markup by _includes/cv_toggle.html, which
// emits data-param and data-body-class; nothing here needs updating to add
// one.
(function () {
  const urlParams = new URLSearchParams(window.location.search);

  function setupToggle(toggle) {
    var checkbox = toggle.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    var paramName = toggle.dataset.param;
    var cssClass = toggle.dataset.bodyClass;

    // Check URL on load
    if (urlParams.get(paramName) === 'true') {
      checkbox.checked = true;
    }

    // Initialize body class
    document.body.classList.toggle(cssClass, checkbox.checked);

    // Handle changes
    checkbox.addEventListener('change', function () {
      document.body.classList.toggle(cssClass, checkbox.checked);

      // Update URL silently
      const currentUrl = new URL(window.location);
      if (checkbox.checked) {
        currentUrl.searchParams.set(paramName, 'true');
      } else {
        currentUrl.searchParams.delete(paramName);
      }
      window.history.replaceState({}, '', currentUrl);
    });
  }

  document.querySelectorAll('.cv-toggle[data-param]').forEach(setupToggle);
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
      // Skip the ones a toggle has hidden -- the journal/conference split
      // builds both groupings into the page and shows one. A display:none
      // heading measures as a zero rect at the top of the viewport, which
      // reads as "scrolled well past" and would win the band outright.
      if (sub.target.offsetParent === null) return;
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
