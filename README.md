# mii-kds-module-template

This is a **GitHub template repository** that starts a **ready-to-run MII KDS
module Implementation Guide (IG)** project. It is for researchers and
maintainers in the Medizininformatik-Initiative (MII) who want to author a
Kerndatensatz (KDS) module IG — profiles, terminology, and documentation —
without first assembling the FHIR tooling (SUSHI, IG Publisher, CI, previews,
release automation) themselves. Click **"Use this template"**, follow the
Quickstart, and you get a buildable module skeleton with CI, GitHub Pages
previews, and the MII release process wired in. The scaffold **references** the
MII IG template package
[`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
(package id `de.medizininformatikinitiative.template`) **by a pinned version**
— one line in `ig.ini` — and does **not contain** the template itself.

> **Why reference by version instead of bundling:** the template package
> evolves on its own release cycle. A version pin in `ig.ini` makes a module
> build reproducible and lets a module adopt a new template release with a
> one-line, reviewable change — a bundled copy would silently drift.

## Quickstart

> TODO: completed by the docs task (B11).

> **⚠️ Before you click "Use this template" — read this.**
> GitHub's *Use this template* button copies **only the default branch
> (`main`)**. Your new module repository would start **without the `dev`
> branch** and without the branching model this scaffold is built around.
> Do **one** of the following:
>
> 1. Tick **"Include all branches"** in the "Create a new repository" dialog,
>    **or**
> 2. run the **first-run bootstrap** right after creating the repository — see
>    [`docs/recipes/first-run-setup.md`](docs/recipes/first-run-setup.md)
>    (planned doc). It creates `dev` from `main`, applies branch protection,
>    and removes the template-maintenance files (e.g. this repo's Release
>    Please configuration) that must **not** live in a module.
>
> **Why this matters:** without `dev`, a novice pushes straight to `main` and
> loses the whole stable/integration model on day one. And a module that
> inherits this repo's Release Please files would auto-cut SemVer tags that
> conflict with the MII CalVer module release process — one repo, one release
> mechanism.

## How this repo is structured

The layout below is the target structure. Directories marked *(planned)*
arrive via the ongoing build-out pull requests onto `dev`.

| Path | Purpose |
| --- | --- |
| `input/` | *(planned)* The IG source: FSH profiles (`input/fsh/`), narrative pages (`input/pagecontent/`, German by default), translations (`input/translations/en/`). |
| `scripts/` | *(planned)* Publication and maintenance scripts (Node.js, no npm dependencies). |
| `skills/` | *(planned)* Vendor-neutral agent skills (agentskills.io format) for IG authoring and maintenance tasks. |
| `docs/` | *(planned)* Novice documentation: `GLOSSARY.md`, `CONCEPTS.md`, `WORKFLOWS.md`, `FURTHER-READING.md`, `SUPPORT.md`, and click-by-click `recipes/`. |
| `.github/` | Issue templates and `CODEOWNERS` (this PR); CI workflows, Dependabot, and release automation *(planned)*. |
| `.devcontainer/` | *(planned)* Dev container with Java, Node, SUSHI, Jekyll, Graphviz, and the IG Publisher preinstalled. |
| `CONTRIBUTING.md` | Branching model, commit conventions, and how contributing **to this template** differs from working **in a module created from it**. |
| `LICENSE` | CC-BY-4.0 (matches the MII IG content licensing). |

## Where to get help

- **Public — HL7 FHIR community Zulip:** <https://chat.fhir.org>, stream
  **`german/mi-initiative`**. This is the channel the MII KDS IGs themselves
  direct questions to; anyone can create a free account and join. Use it for
  FHIR, IG, and profiling questions.
- **MII Zulip organization:** <https://mii.zulipchat.com/>, e.g. the
  **`MII-Kerndatensatz`** stream — the MII's own chat for KDS coordination,
  open to interested parties. Register at the org URL; if access must be
  granted, request it from the MII Geschäftsstelle
  (<office@medizininformatik-initiative.de>).
- **This repository:** open an [issue](../../issues) for bugs and feature
  requests concerning the template itself (the issue forms route you).

> **Why two Zulips:** the public FHIR Zulip reaches the broad FHIR/implementer
> community and keeps a durable, searchable history — post technical questions
> there where possible, and search existing threads first. The MII Zulip is
> the initiative-internal coordination space (and where release notifications
> are posted).
