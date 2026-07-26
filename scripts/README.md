# `scripts/`

Every executable helper in this repository. One directory, one concern: things
you run. The split between a `tools/` and a `scripts/` directory was not one a
reader could predict, so there is only this one.

The name matters: `go-publish.yml` checks this repository out into `automation/`
and calls `automation/scripts/...`, so the path is a contract with the
publication workflow. The same helper lives at the same path in
`ig-template-mii-kds`.

## Publication automation

Imported from
[kerndatensatz-basis](https://github.com/medizininformatik-initiative/kerndatensatz-basis)
(`main`). These support the gated formal-publication workflow
(`.github/workflows/go-publish.yml`), which runs their unit tests by an EXPLICIT
list — not a glob, because this directory now holds unrelated helpers too.

| Script | What it does |
| --- | --- |
| `copy-localized-table-backgrounds.sh` | Copies the per-language table background assets into the staged site |
| `fix-cloud-redirects.mjs` | Rewrites cloud redirects in the staged publication webroot |
| `fix-ig-registry-entry.mjs` | Produces the reviewable FHIR IG Registry patch |
| `fix-publication-history-links.mjs` | Repairs history links across published versions |
| `install-history-template.mjs` | Installs the HL7 history template into the webroot |
| `merge-publication-webroot.mjs` | Merges the new version into the existing publication webroot |
| `verify-preview-preservation.mjs` | Asserts no branch preview was destroyed by a publication |

## This template's own helpers

| Script | What it does | Run by |
| --- | --- | --- |
| `first-run-bootstrap.sh` | One-time setup of a created module: branches, protection, removal of template-only files | a module author, once |
| `convention-check.mjs` | Asserts the MII metadata contract (id/canonical/name/packageId, pinned versions) | `convention-check.yml` |
| `language-model-check.sh` | Fails the build when a file re-asserts the language model this repository moved away from | `convention-check.yml` |
| `check-updates.mjs` | Reports drift between the pinned toolchain and what upstream released | `dependency-check.yml` |
| `sync-ig-template.sh` | Re-vendors `ig-template/`, or fails on drift (`--check`) | `sync-ig-template.yml` |
| `resolve-ig-template-source.sh` | Resolves which template repository the sync reads from | `sync-ig-template.sh` |
| `ig-translate.sh` | Scans and validates the German translation set against the English source | a maintainer |
| `ig-stats.py` | Collects IG metrics for the `ig-analyze` skill | the skill, or manually |
| `set-su-termserv-secrets.sh` | Validates an SU-TermServ client certificate and uploads it as repository secrets | a maintainer, once |

## Tests

```bash
node --test scripts/*.test.mjs            # every unit test (what CI runs on a PR)
node --test scripts/*.template-test.mjs   # scaffold contract — template repo only
```
