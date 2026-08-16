#!/usr/bin/env bash
#
# Renders a CV page to a PDF by printing it with headless Chrome. The
# @media print block in assets/css/cv.css is the single source of truth for
# how the PDF looks (it reproduces the old LaTeX CV), so this produces
# exactly what File > Print in Chrome produces — no second layout to keep in
# sync. The page footer ("<name> — curriculum vitae, page N of M") is a
# CSS margin box and needs Chrome 131 or newer; older Chrome loses the
# footer and nothing else.
#
#   script/export_cv_pdf.sh                      # oney_cv.pdf in the repo root
#   script/export_cv_pdf.sh ~/Desktop/cv.pdf     # somewhere else
#   script/export_cv_pdf.sh --students --awards  # the CV's checkboxes, as flags
#   script/export_cv_pdf.sh --person=<id> out.pdf  # another _data/cvs/ CV
#
# --person picks which /people/<id>/cv/ page to print; it defaults to
# steve_oney. Any other person requires an explicit output path, because only
# the default oney_cv.pdf name is protected from being republished (below).
#
# Every checkbox on the CV is a flag: the list is read at run time from the
# page's cv_toggle includes, so a checkbox added to _includes/cv_body.html is
# a flag here with no edit to this script (--help prints the current list). Each
# flag maps to its checkbox's URL parameter (--students to ?students=true),
# so a flagged export shows exactly what the browser shows with that toggle
# on.
# The default output name is gitignored and excluded in _config.yml, so the
# exported file can be neither committed nor copied into _site by a build.
#
# Needs Google Chrome or Chromium (set $CHROME to override detection), and
# network for the Typekit webfont — offline, the text falls back to a
# generic serif. The static server is WEBrick via `ruby -run`, which the
# bundle already carries as a Jekyll dependency.

set -euo pipefail

# Resolved before any cd: usage() reads this file through $0, and a relative
# $0 stops working the moment the script leaves the caller's directory.
self=$(cd "$(dirname "$0")" && pwd)/$(basename "$0")
usage() {
  sed -n '3,32p' "$self" | sed 's/^# \{0,1\}//'
  echo
  echo "flags (the CV's checkboxes): $(printf -- '--%s ' $toggles)"
}

orig_dir=$PWD
cd "$(dirname "$self")/.."

# The flag list IS the page's checkbox list: every cv_toggle include in
# _includes/cv_body.html names its URL parameter (param="students"). Coming
# out empty means the page or the include's syntax moved, so every flag would
# be rejected as unknown; say why up front.
toggles=$(grep -oE '[[:space:]]param="[^"]+"' _includes/cv_body.html | cut -d'"' -f2 | sort -u)
[ -n "$toggles" ] || echo "warning: no cv_toggle params found in _includes/cv_body.html; toggle flags will not work" >&2

out=""
person=""
params=()
for arg in "$@"; do
  case "$arg" in
    -h|--help)  usage; exit 0 ;;
    --person=*) person=${arg#--person=} ;;
    --*)
      name=${arg#--}
      if printf '%s\n' "$toggles" | grep -qxF -- "$name"; then
        params+=("$name=true")
      else
        echo "unknown flag: $arg" >&2; usage >&2; exit 1
      fi
      ;;
    -*)         echo "unknown flag: $arg" >&2; usage >&2; exit 1 ;;
    *)
      # A second bare argument is almost always a mistyped flag; taking it
      # as the output path would silently print with the toggle off.
      if [ -n "$out" ]; then
        echo "two output paths given: $out and $arg" >&2
        exit 1
      fi
      out=$arg
      ;;
  esac
done

person=${person:-steve_oney}

# Resolve a relative output path against where the caller ran from, not
# against the repo root this script cd'd to. The default name exists only
# for the default person: oney_cv.pdf is the one root-level name that is
# gitignored and excluded from _site, so any other person's export must say
# where it goes (outside the repo, or into _site/).
if [ -z "$out" ]; then
  if [ "$person" = "steve_oney" ]; then
    out=oney_cv.pdf
  else
    echo "--person=$person needs an explicit output path: only oney_cv.pdf" >&2
    echo "is protected from being copied into _site and published by the next build" >&2
    exit 1
  fi
fi
case "$out" in
  /*) ;;
  *) [ "$orig_dir" != "$PWD" ] && out="$orig_dir/$out" ;;
esac

chrome=${CHROME:-}
if [ -z "$chrome" ]; then
  for candidate in google-chrome google-chrome-stable chromium chromium-browser \
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$candidate" >/dev/null 2>&1; then
      chrome=$candidate
      break
    fi
  done
fi
if [ -z "$chrome" ]; then
  echo "no Chrome or Chromium found; set \$CHROME to the browser binary" >&2
  exit 1
fi

# Not --quiet: AGENTS.md's rule is to always read the build output, because
# the DataPageGenerator and cv_grouped_records warnings only appear there,
# and a CV printed from data with those problems is subtly wrong.
echo "building the site..."
bundle exec jekyll build

# An OS-assigned free port, so this never collides with `npm run develop`
# on 4000. The probe socket closes when ruby exits; WEBrick rebinds it. An
# interloper stealing the port in between fails loudly below: WEBrick dies
# on bind and the readiness loop notices the dead server.
port=$(ruby -rsocket -e 's = TCPServer.new("127.0.0.1", 0); puts s.addr[1]')

bundle exec ruby -run -e httpd -- _site --port="$port" --bind-address=127.0.0.1 \
  >/dev/null 2>&1 &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT

url="http://127.0.0.1:$port/people/$person/cv/"
if [ ${#params[@]} -gt 0 ]; then
  url="$url?$(IFS='&'; echo "${params[*]}")"
fi

# curl -f folds a 404 into "not ready", so exhausting the loop against a
# live server means the page does not exist (a changed permalink, an
# excluded page) — Chrome would happily print WEBrick's 404 page to a
# plausible-looking PDF if this fell through.
ready=""
for _ in $(seq 1 50); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$port/people/$person/cv/" 2>/dev/null; then
    ready=1
    break
  fi
  kill -0 "$server_pid" 2>/dev/null || { echo "server died before serving" >&2; exit 1; }
  sleep 0.2
done
[ -n "$ready" ] || { echo "server is up but /people/$person/cv/ never answered; is there a _data/cvs/$person.yaml?" >&2; exit 1; }

# A previous export may already sit at $out (the default name lives in the
# repo root between runs); remove it so the success check below can only
# ever see a file this run wrote.
rm -f "$out"

# --virtual-time-budget holds the print until pending work (the webfont, the
# toggle script) settles, up to 15s. The --no-sandbox retry is for containers
# and CI, where Chrome's sandbox cannot set itself up; it never runs first.
# Chrome's stderr goes to a scratch file so the failure path can say what
# actually went wrong.
chrome_log=$(mktemp)
trap 'kill "$server_pid" 2>/dev/null || true; rm -f "$chrome_log"' EXIT
print_flags=(--headless --disable-gpu --virtual-time-budget=15000
  --no-pdf-header-footer "--print-to-pdf=$out")
if ! "$chrome" "${print_flags[@]}" "$url" >"$chrome_log" 2>&1 || [ ! -s "$out" ]; then
  echo "retrying with --no-sandbox..."
  "$chrome" "${print_flags[@]}" --no-sandbox "$url" >"$chrome_log" 2>&1 || true
fi

if [ ! -s "$out" ]; then
  echo "Chrome produced no PDF; its output was:" >&2
  cat "$chrome_log" >&2
  exit 1
fi
echo "wrote $out"
