# Check matrix: repository artifact ↔ wiki page ↔ metadata contract

Two sections. Section 1 is the **hard** module-metadata contract (violations
fail the run). Section 2 lists the **advisory** wiki-drift checks (reported,
never failed). The **Applies to** column states whether a row concerns a
**template repository** (the template package repo `ig-template-mii-kds`, and
this scaffold repo `mii-kds-module-template` itself) or a **module IG** (a KDS
module repository created from the scaffold, and the scaffold's starter
content) — or both.

Section 1 is implemented mechanically and placeholder-aware by
[`../../tools/convention-check.mjs`](../../tools/convention-check.mjs) and run in
CI by `.github/workflows/convention-check.yml`.

---

## Section 1 — Module-metadata contract (HARD assertions; CI must fail on violation)

> **This section is the metadata contract.** It is deliberately a small,
> fixed list. Do not grow it casually, and do not duplicate it in a second
> linter — this matrix is the single source of truth.

### 1a. Assertions for MODULE IGs (do **not** apply to template package repos)

Checked in the module's `sushi-config.yaml` (and `ig.ini` for the template
pin). Reference values verified against
[`kerndatensatz-basis`](https://github.com/medizininformatik-initiative/kerndatensatz-basis)
`main` on 2026-07-21.

| # | Assertion | Where | Rule | Verified reference value |
|---|-----------|-------|------|--------------------------|
| M1 | `packageId` matches the MII KDS namespace | `sushi-config.yaml` → `packageId` | `^de\.medizininformatikinitiative\.kerndatensatz\.[a-z0-9-]+$` | `de.medizininformatikinitiative.kerndatensatz.base` |
| M2 | `id` is kebab-case with the `mii-ig-` prefix | `sushi-config.yaml` → `id` | `^mii-ig-[a-z0-9-]+$`, ≤ 64 chars | `mii-ig-base` |
| M3 | `name` is Upper_Snake_Case with the `MII_IG_` prefix | `sushi-config.yaml` → `name` | `^MII_IG_[A-Za-z0-9_]+$` | `MII_IG_Base` |
| M4 | `title` follows the wiki title structure | `sushi-config.yaml` → `title` | Starts with `MII ` and names the module (wiki: `MII <Präfix> <Abkürzung Modulname> <Beschreibung>`) | `MII Implementation Guide Core Dataset Base` |
| M5 | `canonical` is under the agreed MII path | `sushi-config.yaml` → `canonical` | `^https://www\.medizininformatik-initiative\.de/fhir/<technischer Modulname>$` — technical module name per the wiki table in "Namenskonventionen für FHIR‐Ressourcen in der MII" | `https://www.medizininformatik-initiative.de/fhir/modul-base` |
| M6 | `version` is CalVer | `sushi-config.yaml` → `version` | `^\d{4}\.\d+\.\d+$` (`YYYY.n.n`; modules never use SemVer) | `2026.0.1` |
| M7 | No dependency — including the IG template — pinned to a floating label | `sushi-config.yaml` → `dependencies`; `ig.ini` → `template` | No `current`, `#current`, `latest`, or `dev` anywhere; every dependency and the template use a fixed version | `kerndatensatz-basis` itself floats `template = fhir2.base.template#current` — a known upstream practice this project deliberately does **not** follow. Do not copy it, and do not "correct" a fixed pin back to `#current`. |

### Placeholder-aware evaluation (this scaffold)

This scaffold's `sushi-config.yaml` and `ig.ini` are parameterized with
`{{PLACEHOLDER}}` values that a created module fills in. The mechanical checker
evaluates Section 1a **placeholder-aware**:

- A value containing a `{{PLACEHOLDER}}` (e.g. `id: mii-ig-{{MODULE_SLUG}}`) is
  treated as **parameterized** — only the surrounding pattern is checked (here:
  `mii-ig-<slug>`) — and passes on non-release branches.
- A concrete value is validated against the full rule in the table.
- On a **release branch** (`release/**`), or with `--release`, an unresolved
  `{{PLACEHOLDER}}` in M1–M6 (and a `TODO`/floating `ig.ini` template) is a
  **failure**: a module must not release with placeholders.
- M7 (no floating label) is always hard: a `{{PLACEHOLDER}}` is not a floating
  label, but `current`/`#current`/`latest`/`dev` anywhere is a failure on every
  branch.

### 1b. Assertions for TEMPLATE PACKAGE repositories (do **not** apply to this scaffold)

Checked in `package/package.json` (the IG-Publisher template package
manifest). This scaffold has **no** such manifest — the mechanical checker skips
Section 1b when the file is absent; these rows apply to `ig-template-mii-kds`.
Base-template facts verified against
[`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) on
2026-07-21.

| # | Assertion | Where | Rule | Expected value there |
|---|-----------|-------|------|----------------------|
| T1 | Template package name | `package/package.json` → `name` | Exactly the agreed template package id | `de.medizininformatikinitiative.template` |
| T2 | Package type | `package/package.json` → `type` | Exactly `fhir.template` | `fhir.template` |
| T3 | Version scheme is **SemVer** | `package/package.json` → `version` | `^\d+\.\d+\.\d+$` — template repos release with SemVer/Release Please, never CalVer | e.g. `0.1.0` |
| T4 | Base template pinned to a fixed version | `package/package.json` → `dependencies` | `"fhir2.base.template": "0.1.0"` — a fixed version, **never** `#current` | `0.1.0` |
| T5 | No floating version labels anywhere | whole repo (manifests, `ig.ini`, CI) | No `current`, `latest`, or `dev` as a version label | — |

> **Why templates and modules diverge (M6/M7 vs. T3/T4):** the template repos
> are *tooling* whose consumers pin a version — SemVer communicates breaking
> changes. The KDS modules follow the MII release process — CalVer
> (`YYYY.n.n`). And fixed pins (T4/M7) make a rebuild years later
> byte-stable; updates arrive as reviewable dependency-bump PRs instead of
> silently via a floating `#current`.

---

## Section 2 — Advisory wiki-drift checks (report `OK`/`DEVIATION`/`UNCLEAR`; never fail)

| Area | Repo artifact | Wiki page | Check point | Applies to |
|------|---------------|-----------|-------------|------------|
| Naming conventions (prefixes) | `qc/custom.rules.yaml` (id/name regex rules) | Namenskonventionen für FHIR‐Ressourcen in der MII | Does the rule set cover the wiki's current prefix list (PR, EX, LM, VS, CS, CM, SM, NS, SP, CPS, OD, IG, QST, OBSDEF, MSR, EXA, PARAM)? | Module |
| Naming conventions (name) | `input/fsh/*.fsh` | Namenskonventionen → Element name | `name` in Upper_Snake_Case with resource-type prefix? | Module |
| Naming conventions (id) | `input/fsh/*.fsh` | Namenskonventionen → Element id | `id` kebab-case, ≤ 64 chars, corresponds to `name`? | Module |
| Naming conventions (title) | `input/fsh/*.fsh` | Namenskonventionen → Element title | Pattern `MII <Präfix> <ModulAbk> <Beschreibung>`? | Module |
| Naming conventions (url) | `sushi-config.yaml` canonical + artifacts | Namenskonventionen → Element url | `<canonical>/<ResourceType>/<id>` structure? Established published URLs are never changed retroactively (Bestandsschutz). | Module |
| Language (content) | `sushi-config.yaml` (`i18n-default-lang`), `input/fsh` | Namenskonventionen → Sprache | German leading (`i18n-default-lang: de`); translation extension on `description`/`name`/`title` where content is German? | Module |
| Language (template mechanism) | `includes/*.html`, `content/assets/css/` | Namenskonventionen → Sprache | Header/footer/CSS overrides language-neutral (`site.data.stringsBase[include.lang]`, no hard-coded UI strings)? See the `ig-translate` skill. | Template repo |
| Terminology (versions) | terminology documentation, `sushi-config.yaml` | Terminology Version Policy | Dated SNOMED INTERNATIONAL version per CalVer release? | Module |
| Terminology (instance data) | profiles/documentation | Terminology Version Policy | `Coding.version` required for ICD-10-GM/OPS/ATC? | Module |
| CI (validation) | `.github/workflows/` | GitHub Reusable Validation Workflows | Are `ci_dotnet_validation.yml` + `ci_java_validation.yml` consumed via `workflow_call` (pinned to a fixed ref) instead of reimplemented? | Module |
| CI (required files) | `qc/custom.rules.yaml`, `advisor.json` | GitHub Reusable Validation Workflows | Both files present, paths per the wiki folder structure? | Module |
| Release | release workflow / process docs | Module Release Workflow | Modules: `release/vYYYY.n.n` branch → PR to `main` → tag per wiki. Template repos deliberately use SemVer/Release Please instead — for them, only report that the divergence is documented. | Both (different expectations) |
| Notification | release workflow (`NOTIFY_ZULIP` step) | GitHub Reusable Validation Workflows | Release notification to Zulip, stream `MII-Kerndatensatz`? | Both |
| Dev container | `.devcontainer/devcontainer.json` | Dev Container ‐ IG Publisher | Image `ghcr.io/cybernop/vscode-ig-publisher:…`, `.fhir` bind mount? | Both |
| Folder structure | repo root | Übersicht Ordnerstruktur ‐ Forge-basiertes KDS-Modul / GitHub Reusable Validation Workflows | Module: `input/fsh/`, `fsh-generated/resources/`, `qc/`, `advisor.json`, `sushi-config.yaml`. Template repo: `package/`, `includes/`, `content/` mirroring the base template layout. | Both (different expectations) |

## Wiki pages (verified to exist, 2026-07-21)

Base: `https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki`

- Namenskonventionen für FHIR‐Ressourcen in der MII
- Terminology Version Policy
- GitHub Reusable Validation Workflows
- Module Release Workflow
- Dev Container ‐ IG Publisher
- Conformance
- Übersicht Ordnerstruktur ‐ Forge-basiertes KDS-Modul

Raw text of a page:
`https://raw.githubusercontent.com/wiki/medizininformatik-initiative/kerndatensatz-meta/<PageName>.md`
(note: some page names contain the Unicode hyphen `‐` (U+2010), not the ASCII
`-` — copy the name from the wiki, do not retype it).
