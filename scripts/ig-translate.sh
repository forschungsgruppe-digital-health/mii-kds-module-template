#!/usr/bin/env bash
# ig-translate — helper for translating an English-default module IG.
# Deterministically determines the target files the IG PUBLISHER EXPECTS for
# translations and validates the naming/placement conventions. It does NOT
# translate the text itself — you write the translations — and it creates
# nothing without being asked.
#
#   scripts/ig-translate.sh --scan de        # show the target path per page/resource
#   scripts/ig-translate.sh --validate de    # check existing translation files
#
# Verified: translation supplements render only for StructureDefinition,
# CodeSystem, Questionnaire (Publisher restriction). A narrative page is
# translated by mirroring input/pagecontent/<name>.md into
# input/translations/<lang>/pagecontent/<name>.md — the SAME file name; a
# <name>-<lang>.md sibling is rendered as a separate page, not as a translation.
# Bash 3.2 compatible.
set -u
cd "$(dirname "$0")/.." || exit 1

MODE=""
LANG_CODE=""
case "${1:-}" in
  --scan) MODE=scan; LANG_CODE="${2:-de}";;
  --validate) MODE=validate; LANG_CODE="${2:-de}";;
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
  echo "-- Narrative pages --"
  if [ -d input/pagecontent ]; then
    for p in input/pagecontent/*.md; do
      [ -e "$p" ] || continue
      base="$(basename "$p" .md)"
      tgt="$TSRC/pagecontent/${base}.md"
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
  echo "Note: a supplement's msgid = the exact English source text from $GEN/<Type>-<id>.json."
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
echo "-- checking existing page translations ($TSRC/pagecontent) --"
if [ -d "$TSRC/pagecontent" ]; then
  for f in "$TSRC"/pagecontent/*.md; do
    [ -e "$f" ] || continue
    bn="$(basename "$f")"; src="input/pagecontent/$bn"
    if [ -f "$src" ]; then echo "   [OK]   $bn"; else echo "   [WARN] $bn — no English source page $src"; fail=1; fi
  done
else
  echo "   (no directory $TSRC/pagecontent)"
fi
echo
[ "$fail" = 0 ] && echo "Validation: no findings." || echo "Validation: findings present (see [WARN])."
exit 0
