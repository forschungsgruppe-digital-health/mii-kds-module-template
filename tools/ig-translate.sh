#!/usr/bin/env bash
# ig-translate — helper for translating a German-led module IG. Deterministically
# determines the target files the IG PUBLISHER EXPECTS for translations and
# validates the naming/placement conventions. It does NOT translate itself (an
# agent/human does that) and creates nothing without being asked.
#
#   tools/ig-translate.sh --scan en        # show the target path per page/resource
#   tools/ig-translate.sh --validate en    # check existing translation files
#
# Verified: translation supplements render only for StructureDefinition,
# CodeSystem, Questionnaire (Publisher restriction). Narrative page files
# (<name>-<lang>.md) are not read yet, but are placed future-proof.
# Bash 3.2 compatible.
set -u
cd "$(dirname "$0")/.." || exit 1

MODE=""
LANG_CODE=""
case "${1:-}" in
  --scan) MODE=scan; LANG_CODE="${2:-en}";;
  --validate) MODE=validate; LANG_CODE="${2:-en}";;
  *) echo "Usage: $0 --scan <lang> | --validate <lang>" >&2; exit 2;;
esac

SUPPORTED="StructureDefinition CodeSystem Questionnaire"   # Publisher supplement types
TSRC="input/translations/$LANG_CODE"
GEN="fsh-generated/resources"

# List "<ResourceType> <id>" per generated resource (only supported types matter)
list_resources() {
  [ -d "$GEN" ] || return 0
  python3 - "$GEN" <<'PY'
import json,sys,glob,os
gen=sys.argv[1]
for f in sorted(glob.glob(os.path.join(gen,"*.json"))):
    try: d=json.load(open(f,encoding="utf-8"))
    except Exception: continue
    rt=d.get("resourceType"); rid=d.get("id")
    if rt and rid: print(rt, rid)
PY
}

echo "== ig-translate --$MODE $LANG_CODE =="

if [ "$MODE" = scan ]; then
  echo "-- Narrative pages (future-proof: not rendered yet) --"
  if [ -d input/pagecontent ]; then
    for p in input/pagecontent/*.md; do
      [ -e "$p" ] || continue
      case "$p" in *-"$LANG_CODE".md) continue;; esac          # skip the translation itself
      base="$(basename "$p" .md)"
      tgt="input/pagecontent/${base}-${LANG_CODE}.md"
      [ -e "$tgt" ] && st="[present]" || st="[missing]"
      echo "   $p -> $tgt $st"
    done
  fi
  echo "-- Resource supplements (render: only SD/CS/Questionnaire) --"
  list_resources | while read -r rt rid; do
    case " $SUPPORTED " in
      *" $rt "*)
        tgt="$TSRC/${rt}-${rid}.po"
        [ -e "$tgt" ] && st="[present]" || st="[missing]"
        echo "   $rt/$rid -> $tgt $st";;
      *)
        echo "   $rt/$rid -> (no supplement support; skipped)";;
    esac
  done
  echo
  echo "Note: a supplement's msgid = the exact German source text from $GEN/<Type>-<id>.json."
  exit 0
fi

# --- validate ---
fail=0
echo "-- checking existing supplements ($TSRC) --"
if [ -d "$TSRC" ]; then
  for f in "$TSRC"/*.po "$TSRC"/*.xliff "$TSRC"/*.json; do
    [ -e "$f" ] || continue
    bn="$(basename "$f")"; stem="${bn%.*}"
    rt="${stem%%-*}"; rid="${stem#*-}"
    case "$bn" in menu.*) echo "   [WARN] $bn — ignored by the Publisher (not {Type}-{id})"; fail=1; continue;; esac
    case " $SUPPORTED " in
      *" $rt "*) ;;
      *) echo "   [WARN] $bn — type '$rt' is NOT supported as a supplement (ignored)"; fail=1; continue;;
    esac
    if [ -f "$GEN/${rt}-${rid}.json" ]; then echo "   [OK]   $bn"; else echo "   [WARN] $bn — no matching resource $GEN/${rt}-${rid}.json"; fail=1; fi
  done
else
  echo "   (no directory $TSRC)"
fi
echo "-- checking existing page translations --"
if [ -d input/pagecontent ]; then
  for f in input/pagecontent/*-"$LANG_CODE".md; do
    [ -e "$f" ] || continue
    bn="$(basename "$f")"; src="input/pagecontent/${bn%-"$LANG_CODE".md}.md"
    if [ -f "$src" ]; then echo "   [OK]   $bn"; else echo "   [WARN] $bn — no German source page $src"; fail=1; fi
  done
fi
echo
[ "$fail" = 0 ] && echo "Validation: no findings." || echo "Validation: findings present (see [WARN])."
exit 0
