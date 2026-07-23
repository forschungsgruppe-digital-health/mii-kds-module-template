# How this repository operates — two layers

This repo has **two lives**, and keeping them apart is essential:

- **Layer 1 — this template repository itself** (how the template is maintained and
  released).
- **Layer 2 — a module created from it** (how *your* module builds and releases
  after "Use this template").

Read both. A reader must never confuse "how this template repo releases itself" with
"how a module I create releases itself." Details live in the linked docs; every
non-obvious point carries a **Why**.

## Branching (both layers)

Same model as described in [CONTRIBUTING.md](../CONTRIBUTING.md): `main` (stable,
default) · `dev` (integration) · short-lived `feature|change|fix/*` off `dev`;
`dev → main` is a **merge commit**. A **new module starts with `main` only** unless
you tick *Include all branches* or run the [first-run bootstrap](recipes/first-run-setup.md),
which creates `dev` for you.

---

## Layer 1 — how THIS template repository operates

The template repo is *tooling*: it releases itself with **SemVer** via Release
Please, previews its own demo build, and monitors its own dependencies.

| Workflow | Trigger | What it does | Toggle (default) | Fate in a created module |
| --- | --- | --- | --- | --- |
| `release-please.yml` | push to `main` | Opens the SemVer release PR (tag + changelog) | `ENABLE_RELEASE_PLEASE` (ON) | **REMOVED by bootstrap** |
| `notify-zulip.yml` | `release: published` | Announces the template release to the MII Zulip (topic *Template Releases*) | `ENABLE_ZULIP_ANNOUNCE` (ON) · `ANNOUNCE_PUBLIC_ZULIP` (OFF) | **REMOVED by bootstrap** |

Also removed by the bootstrap: `release-please-config.json`,
`.release-please-manifest.json`, the template `CHANGELOG.md`,
`docs/recipes/first-run-setup.md`, and `tools/first-run-bootstrap.sh` itself.

> **Why these go:** they version and announce *the template*. A module must not carry
> SemVer automation that fights its own CalVer release process.

## Layer 2 — what a created MODULE inherits and runs

Everything below **propagates** to a module (the bootstrap keeps it). This is how
*your* module builds, validates and releases.

| Workflow | Trigger | What it does | Output | Toggle (default) | Human-gated? |
| --- | --- | --- | --- | --- | --- |
| `ig-publisher.yml` | push to any branch except `main`/`gh-pages`; `workflow_dispatch` | Builds the IG (SUSHI + IG Publisher) and deploys a preview | `gh-pages/branches/<branch>/` + PR comment | `ENABLE_PREVIEW` (ON) | no |
| `cleanup-gh-pages.yml` | schedule (Sun 00:00 UTC); `workflow_dispatch` | Prunes previews of deleted branches; keeps root + version paths | pruned `gh-pages` | `ENABLE_PREVIEW` (ON) | no |
| `validation.yml` | push/PR to `dev`/`main`; `workflow_dispatch` | Runs the **MII reusable validation** workflows | validation report | `ENABLE_VALIDATION` (ON) | no (skips on the template repo itself) |
| `convention-check.yml` | push/PR to `dev`/`main`/`release/**`; `workflow_dispatch` | The **single** convention checker: metadata-contract patterns (hard on release branches) + wiki-drift (advisory) | check result | `ENABLE_CONVENTION_CHECK` (ON) | no |
| `module-release.yml` | push of a CalVer tag `vYYYY.n.n`; `workflow_dispatch` (dry run) | Builds, creates the GitHub Release, announces to the MII Zulip (topic *Releases*), hands off to `go-publish` | release | `ENABLE_MODULE_RELEASE` (ON) · `ENABLE_ZULIP_ANNOUNCE` (ON) | production publish is gated |
| `go-publish.yml` | `workflow_dispatch` **only** | Production `-go-publish`; `publish:false` = full dry run by default | published IG | — | **always human-triggered (Gate E)** |
| `dependency-check.yml` | schedule (Mon 06:00 UTC); `workflow_dispatch` | Version drift (IG Publisher, SUSHI, Jekyll, both templates, FHIR deps) → tracking issue/PR | `dependencies` issue/PR | `ENABLE_DEPENDENCY_CHECK` (ON) | proposals only |
| `security-scan.yml` | schedule (Mon 07:00 UTC); PR to `dev`; `workflow_dispatch` | OSV + Trivy (fs + dev-container image) | SARIF in Security tab | `ENABLE_SECURITY_SCAN` (ON) | no |

Notes:
- **Terminology** is auto-selected, not a toggle: builds use **SU-TermServ** when the
  client-cert secrets are present, else fall back to HL7 `tx.fhir.org` with a notice.
- **Pages mode** (`vars.PAGES_ACTIONS_ENABLED`) chooses the gh-pages push vs the
  Actions deploy path; either serves the previews.
- **Dependabot** is switched by its config presence, not an `if:`.
- On **this template repo**, some jobs intentionally skip or substitute demo
  placeholder values (the repo ships `{{…}}` values); in a real module they run for
  real. The workflow header comments say which.

### The §2.13 toggle summary

| Pipeline | Variable | Default |
| --- | --- | --- |
| IG build + preview | `ENABLE_PREVIEW` | ON |
| Reusable validation | `ENABLE_VALIDATION` | ON |
| Convention check | `ENABLE_CONVENTION_CHECK` | ON |
| Dependency check | `ENABLE_DEPENDENCY_CHECK` | ON |
| Security scan | `ENABLE_SECURITY_SCAN` | ON |
| Module release (CalVer) | `ENABLE_MODULE_RELEASE` | ON |
| Release Please (template only) | `ENABLE_RELEASE_PLEASE` | ON |
| MII Zulip announcement | `ENABLE_ZULIP_ANNOUNCE` | ON |
| Public FHIR Zulip announcement | `ANNOUNCE_PUBLIC_ZULIP` | OFF |
| Production `-go-publish` | manual `workflow_dispatch` + `publish:false` | OFF (gated) |

---

## Release — the two schemes, never mixed

- **This template repo:** **SemVer** via Release Please on `main` (Layer 1).
- **A module:** **CalVer** `YYYY.n.n` via the MII Module Release Workflow —
  see [RELEASE.md](RELEASE.md) and [recipes/cut-a-release.md](recipes/cut-a-release.md).
  A module has **no Release Please** after the bootstrap.

> **Why one page with two layers:** post-2026 a new maintainer must be able to tell,
> in one read, whether a given workflow maintains the template or ships in a module —
> or the automation becomes an unowned black box.

## Secrets & enabling the gated features

A module builds and previews without secrets. To enable the optional gated
features — SU-TermServ terminology (Gate F, for both the build and the reusable
validation) and the Zulip release announcement (Gate G) — see
[docs/SECRETS.md](SECRETS.md) for the exact `gh secret set` commands (including
why the SU-TermServ cert is set under both `SU_TERMSERV_CLIENT_*` and
`CDS_DEV_CLIENT_*` names). The workflows are already wired.
