# `scripts/` — publication automation and the dependency-drift check

The publication scripts are imported from
[kerndatensatz-basis](https://github.com/medizininformatik-initiative/kerndatensatz-basis)
(`main`) and support the gated formal-publication workflow
(`.github/workflows/go-publish.yml`); `check-updates.mjs` is this template's own
weekly dependency-drift checker. All of them are plain Node.js (no npm
dependencies, Node 22 `fetch`/`node:` builtins only) plus one bash script.

Run all tests offline:

```bash
node --test scripts/*.test.mjs           # the publication scripts
node --test scripts/*.template-test.mjs  # the template scaffold contract
```

The second glob is separate on purpose: it asserts the un-replaced
`{{PLACEHOLDER}}` scaffold, so it passes only in THIS template repository. CI
runs the first glob everywhere (`convention-check.yml`, and `go-publish.yml`
before a formal publication) and the second only on the template repo.

| Script | Role in publication |
|---|---|
| `copy-localized-table-backgrounds.sh` | Copies the Publisher's `tbl_bck*.png` table-background images into the per-language output directories (`en/`, `de/`) where localized pages expect them; `--check` mode verifies completeness. |
| `fix-cloud-redirects.mjs` | Converts the Publisher's PHP content-negotiation redirects (which a static host cannot execute) into static `index.html` redirects; skips marker-backed branch previews. |
| `fix-ig-registry-entry.mjs` | Corrects the Publisher-generated [FHIR IG Registry](https://github.com/FHIR/ig-registry) entry (history URL, languages) without reformatting the registry file, then validates the entry against `publication-request.json` and the built package metadata. |
| `fix-publication-history-links.mjs` | Rewrites the publish-box "Directory of published versions" links from the FHIR canonical to the GitHub Pages publication base (needed because canonical and website deliberately differ). |
| `install-history-template.mjs` | Installs the static support files of the [HL7 history template](https://github.com/HL7/fhir-ig-history-template) into a webroot per its `manifest.ini` (used when importing pre-existing publication history — see the note below). |
| `merge-publication-webroot.mjs` | Replaces a legacy Pages root with a bootstrapped formal webroot while preserving every marker-backed branch preview (also part of the history-import path). |
| `verify-preview-preservation.mjs` | Snapshots (`snapshot`) and byte-for-byte verifies (`verify`) all marker-backed branch previews across a publication run, so formal publication can never destroy a preview. |
| `check-updates.mjs` | The dependency-drift checker run by `.github/workflows/dependency-check.yml`: compares the pinned IG Publisher, SUSHI, Jekyll, both IG templates and the FHIR dependencies against their latest releases and writes one Markdown/JSON drift report. Not part of publication. |
| `publication-url-consistency.template-test.mjs` | Template-contract test (template repo only): keeps `sushi-config.yaml`, `ig.ini`, `publication-request.json`, and `go-publish.yml` placeholder-consistent (canonical vs. publication base, pinned toolchain, terminology fallback, dry-run default). |

> **Note on the history-import scripts:** `install-history-template.mjs` and
> `merge-publication-webroot.mjs` are not invoked by this template's
> `go-publish.yml` (a fresh module bootstraps its history with
> `"first": true`). They are shipped and tested because a module that migrates
> ALREADY-published history (the kerndatensatz-basis situation) needs them —
> rebuild the import step from the basis `go-publish.yml` as reference.
