# Open tasks

Everything known to be unfinished in this repository, and why. If you are
wondering "was this forgotten, or decided?", this is the file that answers it.

`docs/project-status.md` says what the repository *is* (a prototype, pending TF
KDS discussion). This file says what is *left to do*.

Nothing here blocks creating a module, building it, or releasing it.

## Waiting on a decision, not on work

These are finished as far as this repository is concerned. Each needs a
maintainer to say "go" — none of them should happen as a side effect of routine
work.

| Task | Blocked on | What unblocks it |
| --- | --- | --- |
| Register the IG template in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry) and name its owner | An explicit maintainer decision | A registry entry is a public, hard-to-retract commitment. While the approach is a proposal to the TF KDS, staying unregistered lets the design change without stranding consumers. |
| Publish `de.medizininformatikinitiative.template` so modules can stop vendoring it | The same decision | Then a module follows [switch-template-to-published](recipes/switch-template-to-published.md) and deletes `ig-template/`. |
| Move both repositories to the `medizininformatik-initiative` organisation — then work through [migration cleanup](migration-cleanup.md) | The same decision | All content already names the target org. **After the move, delete the `IG_TEMPLATE_REPO_URL` repository variable** — it exists only to bridge the gap, and `scripts/resolve-ig-template-source.sh` falls back correctly once the repos are where the content says they are. |
| Run the first production `-go-publish` | A maintainer, deliberately | The workflow is manual-dispatch only and dry-run by default. **It must never be triggered without that decision.** See [cut-a-release](recipes/cut-a-release.md). |
| Store the SU-TermServ client certificate as repository secrets | A maintainer with the certificate | The procedure is written and the handshake was verified locally against the live server. See [secrets](secrets.md); run `scripts/set-su-termserv-secrets.sh`. Without it, builds fall back to `tx.fhir.org`. |
| Store the Zulip announcement key | A maintainer | See [secrets](secrets.md). Release announcements stay silent until then. |
| Decide how the Java-validation job gets its `package.json` | A maintainer (design decision) | The pinned upstream `ci_java_validation.yml` reads IG dependencies from a repo-root `package.json` this scaffold deliberately does not ship, so the job fails on a created module even with the certificate. Options: ship a parameterized `package.json` mirroring `sushi-config.yaml` `dependencies:` (adds a drift surface — it would join the release checklist), ask upstream to read `sushi-config.yaml`, or leave the job to the .NET QC only. Until decided, the job is gated on the SU-TermServ certificate and its failure mode is documented in `docs/release.md`. |
| Decide who owns the template after 2026 | TF KDS | Currently "the MII, for now". |
| Name a code owner, a security contact and a conduct-report contact | The owning organisation | All three are deliberately unnamed while this is a prototype: no individual speaks for the MII, and the MII Geschäftsstelle must not be given as the contact for a repository it does not own. `.github/CODEOWNERS` therefore lists no owner (reviews are requested by hand), [SECURITY.md](../SECURITY.md) names no fallback address, and [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) routes reports through GitHub. Set all three to a **team**, not a person, when the repositories move to the `medizininformatik-initiative` organisation. |
| Decide which language carries a module's *normative* text | TF KDS | The MII wiki is German; this template, like `kerndatensatz-basis` and the wider FHIR ecosystem, renders English by default and German as the translation. Which of the two is *normative* is a project-level call, not something a template settles silently. Nothing is blocked meanwhile — both languages render. |

## To raise upstream

- **`kerndatensatz-basis` — invalid DataAbsentReason canonical.** Its
  `input/pagecontent/missing-data.md` (and the German mirror) uses
  `http://hl7.org/fhir/CodeSystem/data-absent-reason` in the copy-paste worked
  example. The defining URL is
  `http://terminology.hl7.org/CodeSystem/data-absent-reason`
  ([R4 spec](http://hl7.org/fhir/R4/codesystem-data-absent-reason.html)).
  This scaffold carried a corrected copy until the agreed menu structure
  retired the local `missing-data.md` in favour of the Meta-module link
  ([page-structure.md](page-structure.md)); the upstream defect remains worth
  reporting rather than silently diverging from.
- **`HL7/ig-template-base2` — the `TRANS_HLP` string is inserted without
  `| markdownify`,** so every language catalog's markdown link renders
  literally. Worked around in the IG template repository; see its
  `docs/open-tasks.md`.

## Verified by observation, not by specification

Both are load-bearing claims this repository makes. They match what the pinned
IG Publisher does today, but neither is documented by HL7, so a toolchain bump
should re-check them.

- **The conformance summary table's *Expectation* column is derived from the
  English keywords SHALL/SHOULD/MAY.** This is the reason the statement list is
  English-only.
  [HL7 ig-guidance](https://build.fhir.org/ig/FHIR/ig-guidance/conformance-statements.html)
  documents the `§…§` marker and the `§§§` table but names no Expectation
  column. To settle it, run one build with a German-marked statement and record
  what the table shows in this file.
- **The `de-DE` Translation extension on `^title` does not reach the artifacts
  index.** The German `^description` renders on the artifact's own page; the
  German `^title` renders nowhere, and `artifacts.html` keeps the
  default-language text. Recorded where the mechanism is documented.

## Rendered pages never hard-code this repository's URL

The two template repositories exist under `medizininformatik-initiative` only
as empty placeholders — the content moves there once the drafts are approved. Until then any link to their
target-organisation URL resolves nowhere, and a built IG is read by people who
cannot know that.

So **`input/pagecontent/**` and `input/translations/**` name a repository path in
prose (`docs/recipes/add-a-profile.md` in this repository) instead of linking to
it.** Links to `kerndatensatz-meta` and `kerndatensatz-basis` stay — those repos
exist today. After the migration, self-referential links may be reintroduced;
until then, adding one ships a 404 to every reader of that build.

The IG Publisher reports these as broken links in `qa.html`. CI does not fail on
the count — it includes external URLs whose reachability depends on the network
at build time — so read it when you change page content.

## Known limits of the guards

The guards are worth more than the drift they catch, so their reach is stated
rather than assumed.

- **The `SU_TERMSERV_CLIENT_CERT_PASSWORD` anti-drift assertion runs on the
  template repository only.** It lives in
  `scripts/publication-url-consistency.template-test.mjs`, which asserts
  un-replaced placeholders and therefore cannot run in a created module. A
  re-introduction of the wrong secret name *inside a module* would not be
  caught.
- **`qc/custom.rules.yaml` is not verified end to end.** The MII reusable
  validation that reads it only runs on created modules, never here, so its
  `parse` glob has not been observed against a real run. The .NET job is
  configured upstream to pass regardless, so the worst case is log noise.
- **`scripts/language-model-check.sh` is curated, not exhaustive.** It matches
  line by line, so a claim split across a line break passes. It was tested
  against 20 phrasings and catches every wording that has actually occurred
  here. If you add a phrasing, add the pattern; do not weaken the existing ones.
- **Three SHA-pinned support repositories are not watched by the dependency
  checker** (`HL7/fhir-ig-history-template`, `HL7/fhir-web-templates`,
  `medizininformatik-initiative/kerndatensatz-meta`). They are re-resolved by
  hand; the workflow comments say so rather than claiming automation that does
  not exist.
- **The IG statistics report's German prose is no longer this repository's task.**
  The tool that writes it (`scripts/ig-stats.py`) and the skill that owned it
  (`skills/ig-analyze`) moved to the organization's skill catalog as
  `fhir-ig-analysis` — see [`../skills/RETIRED.md`](../skills/RETIRED.md). A pinned
  copy is vendored back into
  [`../skills/fhir-ig-analysis/`](../skills/fhir-ig-analysis/SKILL.md) so the skill
  stays invocable here, but its content is maintained in the catalog. The two
  items recorded here (report prose still German while every document here is
  English-source, and `recommendations` rows still framed as a migration) belong
  to that skill now and were carried over with it; track them there, not here.
- **Two pins in `validation.yml` are not watched by any layer.** The
  reusable-workflow inputs `SUSHI_VERSION` and `JAVA_VALIDATOR_VERSION` are
  written as `${{ vars.X || '<version>' }}`, which the checker's env parser
  cannot read. `scripts/toolchain-pins.test.mjs` at least holds the SUSHI
  fallback equal to the three build workflows; nothing compares
  `JAVA_VALIDATOR_VERSION` against upstream — re-check it whenever the
  `kerndatensatz-meta` SHA is re-resolved.

## Cross-repo consistency — decided, not pending

This repository and the IG template share a number of documentation filenames —
compare them with `comm -12` over `git ls-files docs` in both checkouts. That was
once real duplication; it is not any more. **No shared file is identical**, and the
closest pairs differ for good reasons — `project-status.md` because each names
the other repository, `glossary.md` because this scaffold defines nine terms the
template repository has no use for, `further-reading.md` because Release Please
is a template-repo entry a module must not follow.

No sync mechanism is planned. A module created from this template must be
self-contained: replacing its copy of `glossary.md` or `maintenance.md` with a
link back to the template would break the moment the module is developed
independently, which is the whole point of a template.
