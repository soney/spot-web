// Wires up the CV's checkbox toggles (student-author highlighting, other
// mentees, paper awards). Each checkbox mirrors its state to a class on
// <body> (which the CSS in cv.css keys off) and to a URL parameter, so
// toggle states survive reload and can be shared as links.
(function () {
  const urlParams = new URLSearchParams(window.location.search);

  function setupToggle(checkboxId, paramName, cssClass) {
    var checkbox = document.getElementById(checkboxId);
    if (!checkbox) return;

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

  setupToggle('highlight-student-authors-toggle', 'students', 'highlight-student-authors');
  setupToggle('show-other-mentees-toggle', 'mentees', 'show-other-mentees');
  setupToggle('show-paper-awards-toggle', 'awards', 'show-paper-awards');
})();
