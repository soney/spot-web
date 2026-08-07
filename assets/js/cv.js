// Wires up the CV's checkbox toggles (student-author highlighting, other
// mentees, paper awards). Each checkbox mirrors its state to a class on
// <body> (which the CSS in cv.css keys off) and to a URL parameter, so
// toggle states survive reload and can be shared as links.
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
