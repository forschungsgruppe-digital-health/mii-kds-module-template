# Recipe: remove (or keep) an optional page

**Goal.** Execute the keep/remove decision for one of the seven OPTIONAL (0..1)
menu entries completely, in one pass — so the rendered guide, both language
menus, the `pages:` tree, the `.po` catalogue and the convention check all agree
afterwards.

**Prerequisites.** The decision itself is made — [optional-pages.md](../optional-pages.md)
is the decision checklist (keep it when …, drop it when …). This recipe is the
**canonical procedure** for executing either outcome; every other document
links here rather than repeating the steps.

## How an undecided entry is marked (what you will be deleting)

Until the module lead decides, every optional entry ships in three visible
forms — all of them scaffold-only:

1. the **`(optional)` suffix in the rendered menu label**, in BOTH menu files
   (`input/includes/menu.xml`, `input/translations/de/includes/menu.xml`) — the
   word is identical in English and German;
2. the **banner + `OPTIONAL-PAGE` marker comment** in the page file AND its
   German mirror;
3. the **`OPTIONAL (0..1)` source comments** at the menu entries and in the
   `sushi-config.yaml` `pages:` tree.

The convention check (`scripts/convention-check.mjs`) watches 1 and 2: M9 fails
a `release/**` branch while a page still carries the `OPTIONAL-PAGE` marker
**or** a menu label still carries `(optional)`, and fails **every** branch when
the two languages disagree (a half-applied decision).

## The seven entries

| Menu entry (EN / DE label) | Page | Known inbound links to reroute |
| --- | --- | --- |
| Guidance for Researchers / Anleitung für Forschende | `researcher-guidance.md` | `index.md` (both languages) links it from the *Target audience* box — reroute (e.g. to `guidance.html`) |
| Extensions / Extensions | `extensions.md` | partner link from `profiles.md` (both languages) |
| Search Parameters / Suchparameter | `search-parameters.md` | none beyond step 5's grep |
| Operations / Operationen | `operations.md` | none beyond step 5's grep |
| Value Sets / ValueSets | `value-sets.md` | partner link from `code-systems.md` (both languages) |
| Code Systems / CodeSystems | `code-systems.md` | partner link from `value-sets.md` (both languages) |
| Metadata Overview / Metadaten-Übersicht | `metadata.md` | none — the *Metadata* dropdown parent already points at `version-history.html` (the mandatory child) precisely so this page can go without re-targeting the parent |

## Steps — Decision A: KEEP the page

1. **Both menu labels:** delete the `(optional)` suffix (and the space before
   it) from the entry's label
   in `input/includes/menu.xml` **and**
   `input/translations/de/includes/menu.xml` (labels only; the href stays).
2. **Both page files:** delete the optional-page **banner block and the
   `OPTIONAL-PAGE` marker comment** from `input/pagecontent/<page>.md` **and**
   `input/translations/de/pagecontent/<page>.md`, then fill in the page's
   `[TODO]` blocks as usual.
3. **Source comments (tidy-up):** delete the `OPTIONAL (0..1)` comments at the
   menu entries and in the `sushi-config.yaml` `pages:` tree. They are not
   checked, but leaving them contradicts the decision you just recorded.

Nothing else changes: the `pages:` row, the `.po` unit and all links stay.

## Steps — Decision B: REMOVE the page (one commit, six touches)

For any optional page `<page>.md`, in the same commit:

1. **Both page files** —
   `git rm input/pagecontent/<page>.md input/translations/de/pagecontent/<page>.md`
2. **Both menu entries** — the whole `<li>` (label suffix included) **and**
   the `OPTIONAL` comment line above it, in
   `input/includes/menu.xml` **and**
   `input/translations/de/includes/menu.xml`
3. **The `pages:` entry** — the two lines (`<page>.md:` + `title:`) in
   `sushi-config.yaml`
4. **The `.po` title unit** — the page title's `msgid`/`msgstr` block in
   `input/translations/de/ImplementationGuide-<your-ig-id>.po` (without this,
   the catalogue carries a dead unit; with a removed English title still
   translated, later title edits silently drift)
5. **Inbound links** — grep the remaining pages and reroute or drop:
   `git grep -n '<page>.html' input/`. The scaffold's known cross-links are in
   the table above; when you remove one page of a linked pair, drop the
   sentence that links it from its partner (both languages).
6. **Removing `metadata.md` only:** also delete the comment in both menu files
   that explains the *Metadata* dropdown parent's deliberate targeting of
   `version-history.html` — it refers to a page that no longer exists.

## Satisfying the convention check afterwards

Run `node scripts/convention-check.mjs` (and `--release` to simulate the
release gate):

- **After KEEP:** `M9 optional pages` and `M9 optional menu labels` no longer
  list the page/entry. If either still does, one language was skipped —
  the check fails every branch on such asymmetry and names the file.
- **After REMOVE:** the page disappears from both M9 scans entirely. A leftover
  touch shows up elsewhere: a deleted page still in a menu fails the IG build
  loudly ("menu entry without a page"), a leftover `pages:` row fails SUSHI
  ("missing source file"), and the publisher's link QA reports any link you
  missed in step 5.
- M10 (duplicated headings) is unaffected by either decision — the pages carry
  no in-page title heading.

Then build once (or push and let CI build) to confirm.

## Expected result

- The rendered menu (both `/en/` and `/de/`) shows either the entry **without**
  `(optional)` (keep) or no entry at all (remove) — never a dangling link.
- `node scripts/convention-check.mjs --release` reports no M9 finding for the
  decided entry.
- Both languages moved together: menus, pages, `pages:` tree and `.po`
  catalogue agree.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| M9 fails on **every** branch naming the page or href | Decision applied to one language only | Apply the same step to the other language (page mirror or the other `menu.xml`) |
| `convention-check` red on `release/**`: M9 | An entry is still undecided (marker or `(optional)` label present) | Decide it — Decision A or B above |
| IG build fails: menu entry without a page | Step 2 skipped after `git rm` | Delete the `<li>` in BOTH menu files |
| SUSHI fails: missing source file `<page>.md` | Step 3 skipped | Delete the page's two `pages:` lines in `sushi-config.yaml` |
| German breadcrumb/TOC still shows the removed title, or a later title edit is not translated | Step 4 skipped | Delete the page's `msgid`/`msgstr` unit in the IG-level `.po` |
| Publisher link QA reports a broken link to `<page>.html` | Step 5 skipped | Reroute or drop the inbound link in both languages |
