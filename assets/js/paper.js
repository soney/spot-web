// Makes the BibTeX entry on a paper page (_layouts/paper.html) easy to take
// away: the Copy button puts the whole entry on the clipboard, and a plain
// click anywhere in the block selects all of it, so Ctrl/Cmd+C works without
// a careful drag. A drag-selection of part of the entry is left alone.
//
// The button ships in the markup but site.css hides it until this script adds
// `is-ready` -- the same arrangement as the theme toggle, so that with
// JavaScript off (or no Clipboard API) there is no button that does nothing.
(function () {
  var cite = document.querySelector('.paper-cite');
  if (!cite) return;

  var code = cite.querySelector('pre.bibtex code');
  if (!code) return;

  function selectEntry() {
    var selection = window.getSelection();
    if (!selection) return;
    var range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Select-all on click, but only when the click did not itself make a
  // selection: after a drag the selection is non-collapsed by the time the
  // click event fires, and replacing it would fight anyone picking out a
  // single field.
  code.parentElement.addEventListener('click', function () {
    var selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    selectEntry();
  });

  var button = cite.querySelector('.bibtex-copy');
  // navigator.clipboard only exists in secure contexts; anywhere it is
  // missing the button stays hidden and select-on-click still works.
  if (!button || !navigator.clipboard) return;

  var idleHtml = button.innerHTML;
  var resetTimer = null;

  button.addEventListener('click', function () {
    navigator.clipboard.writeText(code.textContent).then(function () {
      button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> Copied';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        button.innerHTML = idleHtml;
      }, 2000);
    }, function () {
      // The clipboard write was refused (permissions policy, etc.): select
      // the entry instead so a manual copy is one keystroke away.
      selectEntry();
    });
  });

  button.classList.add('is-ready');
})();
