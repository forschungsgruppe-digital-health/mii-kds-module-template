#!/usr/bin/env bash
# language-model-check.sh — guard the English-default / German-translation model.
#
# This IG renders in ENGLISH by default (sushi-config.yaml
# `i18n-default-lang: en`) with a GERMAN translation under
# `input/translations/de/` — the same model as kerndatensatz-basis. Prose that
# calls German the default/leading/authoritative/source language contradicts the
# shipped configuration, and it has crept back in more than once, so it fails
# here instead of shipping to module authors.
#
#   scripts/language-model-check.sh        # scan the tracked text files
#
# Exit 0 = clean, 1 = residue found. Run by .github/workflows/convention-check.yml.
#
# Legitimate hits go in ALLOW below, one "<path>|<substring>" per entry — do NOT
# weaken PATTERNS.
#
# Not scanned: input/translations/de/** (the German translation itself),
# ig-template/** (the vendored mirror — fix it in ig-template-mii-kds and
# re-sync), docs/reports/** (dated, immutable snapshots that may quote earlier
# wording as evidence), and this file.
#
# Bash 3.2 compatible.
set -u
cd "$(dirname "$0")/.." || exit 1

# Phrases that assert the wrong language model. Curated, not fuzzy: every entry
# below was an actual defect in this repo.
PATTERNS='german[^.]{0,30}\b(default|leading|authoritative|binding)\b
german[^A-Za-z]{0,6}(is|stays|remains|as)?[^A-Za-z]{0,6}(the[^A-Za-z]{0,6})?(source|original)\b
german[^.]{0,25}\bthe (source|original)\b
falls back to german
leave it german
german-led\b
german starter page
\bde-default\b
back to en-default
deutsch \(standardsprache\)
i18n-lang:[^]]{0,20}\ben\b
input/translations/en\b'

# Reviewed exceptions: "<path>|<substring of the offending line>".
ALLOW=''

SCANNED_EXT='md|markdown|yaml|yml|xml|sh|mjs|js|json|fsh|po'

status=0
while IFS= read -r f; do
  case "$f" in
    input/translations/de/*|ig-template/*|docs/reports/*|scripts/language-model-check.sh) continue;;
  esac
  ext="${f##*.}"
  case "$ext" in
    md|markdown|yaml|yml|xml|sh|mjs|js|json|fsh|po) ;;
    *) continue;;
  esac
  while IFS= read -r pattern; do
    [ -n "$pattern" ] || continue
    hits="$(grep -nEi -- "$pattern" "$f" 2>/dev/null)" || continue
    while IFS= read -r hit; do
      [ -n "$hit" ] || continue
      allowed=0
      while IFS= read -r entry; do
        [ -n "$entry" ] || continue
        case "$entry" in
          "$f|"*)
            needle="${entry#*|}"
            case "$hit" in *"$needle"*) allowed=1;; esac;;
        esac
      done <<EOF
$ALLOW
EOF
      [ "$allowed" = 1 ] && continue
      echo "$f:$hit"
      status=1
    done <<EOF
$hits
EOF
  done <<EOF
$PATTERNS
EOF
done <<EOF
$(git ls-files)
EOF

if [ "$status" != 0 ]; then
  cat >&2 <<'MSG'

German-default language residue found (see the lines above).

This IG is English-default with a German translation:
  - input/pagecontent/**            English — the source
  - input/translations/de/**        German  — the translation, renders on /de/
  - input/includes/menu.xml         English — the source menu
There is no input/translations/en/, and kerndatensatz-basis is en-default too,
so "deviates from basis" is never the right rewrite — delete such claims.

If a hit is legitimate, add it to ALLOW in scripts/language-model-check.sh with a
reason in the commit message. Do not widen the exclusions or relax PATTERNS.
MSG
else
  echo "language-model-check: no German-default residue found."
fi
exit "$status"
