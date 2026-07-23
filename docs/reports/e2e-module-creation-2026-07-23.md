# End-to-end acceptance: create a module from the template — 2026-07-23

Simulates creating a module from `mii-kds-module-template` and verifies the
machinery, **locally** (no GitHub repo was created — the real "Use this template"
click is the one remaining human acceptance step, noted at the end). Report only;
no scaffold files were changed by this run.

**Method.** A fresh clone of `dev` was treated as a just-created module. The
first-run bootstrap was run in dry-run; its documented file-removal list was then
applied locally (the branch-protection API calls were **not** run, to avoid
touching the real repository); the placeholders were replaced with a realistic
module (`slug=person`, `MII_IG_Person`, CalVer `2026.0.0`); and SUSHI was run.
Toolchain: SUSHI 3.20.0 on Node 22.

## Results

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Bootstrap dry-run runs and lists the intended actions | **PASS** | Prints "create `dev` from `main` + protect", then the removal list; "dry-run: nothing removed" |
| 2 | Bootstrap removes exactly the template-maintenance files | **PASS** | Removed: `release-please.yml`, `notify-zulip.yml`, `release-please-config.json`, `.release-please-manifest.json`, `docs/recipes/first-run-setup.md`, `tools/first-run-bootstrap.sh`. `CHANGELOG.md` absent before a first release (correctly tolerated) |
| 3 | Release Please is ABSENT from active files afterwards | **PASS** | No `release-please*.{yml,json}` remain; the only `release-please` strings left are in **docs** and one **explanatory comment** in `module-release.yml` ("…NEVER Release Please") — no active config |
| 4 | Module workflows are KEPT (propagate) | **PASS** | Present: `module-release.yml`, `ig-publisher.yml`, `cleanup-gh-pages.yml`, `validation.yml`, `convention-check.yml`, `go-publish.yml`, `dependency-check.yml`, `security-scan.yml` |
| 5 | Agent skills are KEPT | **PASS** | `skills/ig-analyze`, `skills/ig-translate`, `skills/wiki-consistency-check` |
| 6 | A real module builds after placeholder replacement | **PASS** | `person` module, CalVer `2026.0.0`: **SUSHI 0 errors, 0 warnings** (1 profile + 1 instance); no `{{…}}` left outside a comment banner |
| 7 | The CalVer release path is present and correct | **PASS** | `module-release.yml` triggers on tag `v[0-9]+.[0-9]+.[0-9]+*` (CalVer), `workflow_dispatch` = dry run (Gate E), builds → GitHub Release → MII Zulip (topic *Releases*) → hands off to the **gated** `go-publish.yml` |
| 8 | No SemVer/Release Please release path in the module | **PASS** | Confirmed by checks 2–3 |

## The one remaining human acceptance step

A true "Use this template" run on GitHub (button → *Create a new repository* → tick
**Include all branches** or run the bootstrap) plus the **full IG Publisher build**
(not just SUSHI) is the final acceptance a human performs. The full IG Publisher
build is already proven green in CI on the template repository itself (the module
scaffold's `ig-publisher.yml` builds the demo-substituted IG end to end and
publishes a live preview), so the only unproven-here piece is the GitHub-side repo
creation + branch bootstrap against a real new repo — which the bootstrap script
and this simulation exercise faithfully.

## Notes

- The bootstrap's Step 1 (create `dev` + branch protection) was intentionally **not**
  executed here because its `gh api` calls target the *current* repository's remote;
  running `--apply` in this scratch clone would have hit the real
  `mii-kds-module-template`. The file-removal list (Step 2) was applied and verified
  instead. In a genuinely new module repo, `--apply` is safe and correct.
- No defects found in the bootstrap removal set or the CalVer release wiring.
