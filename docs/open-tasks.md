# Open tasks

Everything known to be unfinished in this repository, and why. If you are
wondering "was this forgotten, or decided?", this is the file that answers it.

`docs/project-status.md` says what the repository *is* (a prototype, pending TF
KDS discussion). This file says what is *left to do*.

Nothing here blocks creating a module, building it, or releasing it.

## Waiting on a decision, not on work

These are finished as far as this repository is concerned. Each needs someone to
say "go" — none should be done by an agent.

| Task | Blocked on | What unblocks it |
| --- | --- | --- |
| Register the IG template in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry) and name its owner | An explicit maintainer decision | A registry entry is a public, hard-to-retract commitment. While the approach is a proposal to the TF KDS, staying unregistered lets the design change without stranding consumers. |
| Publish `de.medizininformatikinitiative.template` so modules can stop vendoring it | The same decision | Then a module follows [switch-template-to-published](recipes/switch-template-to-published.md) and deletes `ig-template/`. |
| Move both repositories to the `medizininformatik-initiative` organisation | The same decision | All content already names the target org. **After the move, delete the `IG_TEMPLATE_REPO_URL` repository variable** — it exists only to bridge the gap, and `scripts/resolve-ig-template-source.sh` falls back correctly once the repos are where the content says they are. |
| Run the first production `-go-publish` | A maintainer, deliberately | The workflow is manual-dispatch only and dry-run by default. **An agent must never trigger it.** See [cut-a-release](recipes/cut-a-release.md). |
| Store the SU-TermServ client certificate as repository secrets | A maintainer with the certificate | The procedure is written and the handshake was verified locally against the live server. See [secrets](secrets.md); run `scripts/set-su-termserv-secrets.sh`. Without it, builds fall back to `tx.fhir.org`. |
| Store the Zulip announcement key | A maintainer | See [secrets](secrets.md). Release announcements stay silent until then. |
| Decide who owns the template after 2026 | TF KDS | Currently "the MII, for now". |

## To raise upstream

- **`kerndatensatz-basis` — invalid DataAbsentReason canonical.** Its
  `input/pagecontent/missing-data.md` (and the German mirror) uses
  `http://hl7.org/fhir/CodeSystem/data-absent-reason` in the copy-paste worked
  example. The defining URL is
  `http://terminology.hl7.org/CodeSystem/data-absent-reason`
  ([R4 spec](http://hl7.org/fhir/R4/codesystem-data-absent-reason.html)).
  Fixed here; the defect was inherited, so it should be reported rather than
  silently diverged from.
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
  the resulting table in `docs/reports/`.
- **The `de-DE` Translation extension on `^title` does not reach the artifacts
  index.** The German `^description` renders on the artifact's own page; the
  German `^title` renders nowhere, and `artifacts.html` keeps the
  default-language text. Recorded where the mechanism is documented.

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
- **`scripts/ig-stats.py` writes its report in German.** The tool is carried
  over from the MII KDS sample IG and its report prose was never translated,
  while every other document here is English-source. The measurements are
  language-neutral; only the surrounding sentences and section headings are
  German. Translating them means touching
  `skills/ig-analyze/references/report-content.json` and the literals in the
  script — worth doing, not urgent.
- **Two pins in `validation.yml` are not watched by any layer.** The
  reusable-workflow inputs `SUSHI_VERSION` and `JAVA_VALIDATOR_VERSION` are
  written as `${{ vars.X || '<version>' }}`, which the checker's env parser
  cannot read. `scripts/toolchain-pins.test.mjs` at least holds the SUSHI
  fallback equal to the three build workflows; nothing compares
  `JAVA_VALIDATOR_VERSION` against upstream — re-check it whenever the
  `kerndatensatz-meta` SHA is re-resolved.

## Cross-repo consistency — decided, not pending

This repository and the IG template share thirteen documentation filenames. That
was once real duplication; it is not any more. After the 2026-07-26 audit **no
shared file is identical**, and the closest pairs differ for good reasons —
`project-status.md` because each names the other repository, `glossary.md`
because this scaffold defines nine terms the template repository has no use for.

No sync mechanism is planned. A module created from this template must be
self-contained: replacing its copy of `glossary.md` or `maintenance.md` with a
link back to the template would break the moment the module is developed
independently, which is the whole point of a template.
