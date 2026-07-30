# How this repository operates — two layers

This repo has **two lives**, and keeping them apart is essential:

- **Layer 1 — this template repository itself** (how the template is maintained and
  released).
- **Layer 2 — a module created from it** (how *your* module builds and releases
  after "Use this template").

Read both. A reader must never confuse "how this template repo releases itself" with
"how a module I create releases itself." Details live in the linked docs.

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
`.release-please-manifest.json` and the template `CHANGELOG.md`. The bootstrap
script and its recipe are **not** removed — a module's docs link to both. The
authoritative list is the `REMOVE=` line in `scripts/first-run-bootstrap.sh`,
which the dry run prints; see
[first-run-setup.md](recipes/first-run-setup.md).

> **Why these go:** they version and announce *the template*. A module must not carry
> SemVer automation that fights its own CalVer release process.

## Layer 2 — what a created MODULE inherits and runs

Everything below **propagates** to a module (the bootstrap keeps it). This is how
*your* module builds, validates and releases.

| Workflow | Trigger | What it does | Output | Toggle (default) | Human-gated? |
| --- | --- | --- | --- | --- | --- |
| `ig-publisher.yml` | push to any branch except `main`/`gh-pages`/`fsh-generated`; `workflow_dispatch` | Builds the IG (SUSHI + IG Publisher) and deploys a preview. **On this template repo only**, the self-check build also demonstrates a version comparison at `comparison-demo/` in the preview, rendered with the FHIR validator's `-compare` (the publisher's own `version-comparison` needs a formal publication history at the canonical, which the scaffold never has): the last dev preview's package is relabelled `2027.0.0-draft.0` and compared to the build — on `dev` a self-comparison (what a no-changes report looks like), on a feature branch the real delta against `dev`. A created module enables `version-comparison` from its second formal publication | `gh-pages/branches/<branch>/` + PR comment | `ENABLE_PREVIEW` (ON) · `ENABLE_VERSION_COMPARISON` (ON; `false` disables the whole feature — the publisher's `version-comparison` in every build workflow *and* the template repo's demo) | no |
| `cleanup-gh-pages.yml` | schedule (Sun 00:00 UTC); `workflow_dispatch` | Prunes previews of deleted branches; keeps root + version paths | pruned `gh-pages` | `ENABLE_PREVIEW` (ON) | no |
| `validation.yml` | push to `dev`/`main`; any pull request; `workflow_dispatch` | Runs the **MII reusable validation** workflows | validation report | `ENABLE_VALIDATION` (ON) | no (skips on the template repo itself) |
| `convention-check.yml` | push/PR to `dev`/`main`/`release/**`; `workflow_dispatch` | The **single** convention checker: metadata-contract patterns (hard on release branches) + the language-model guard (`scripts/language-model-check.sh`) + the offline test suites (`scripts/*.test.mjs`, and on the template repo `scripts/*.template-test.mjs`); the advisory wiki-drift review (Section 2 of the check matrix) is a human/agent job via the `wiki-consistency-check` skill, not part of this workflow | check result | `ENABLE_CONVENTION_CHECK` (ON) | no |
| `module-release.yml` | push of a CalVer tag `vYYYY.n.n`; `release: published` (the announcement); `workflow_dispatch` (dry run) | Builds, creates the GitHub Release, announces to the MII Zulip (topic *Releases*), hands off to `go-publish` | release | `ENABLE_MODULE_RELEASE` (ON) · `ENABLE_ZULIP_ANNOUNCE` (ON) | production publish is gated |
| `go-publish.yml` | `workflow_dispatch` **only** | Production `-go-publish`; `publish:false` = full dry run by default | published IG | — | **always human-triggered** |
| `dependency-check.yml` | schedule (Mon 06:00 UTC); `workflow_dispatch` | Version drift (IG Publisher, SUSHI, Jekyll, both templates, FHIR deps) → one tracking issue | `dependencies` issue | `ENABLE_DEPENDENCY_CHECK` (ON) | proposals only |
| `security-scan.yml` | schedule (Mon 07:00 UTC); PR to `dev`; `workflow_dispatch` | OSV + Trivy (fs + dev-container image) | SARIF in Security tab | `ENABLE_SECURITY_SCAN` (ON) | no |
| `sync-ig-template.yml` | schedule (Mon 05:00 UTC); `workflow_dispatch`; PR to `dev` (check only) | Keeps the vendored `ig-template/` in step with `ig-template-mii-kds@dev`; opens a PR on drift, fails a PR whose mirror is stale | sync PR | `ENABLE_TEMPLATE_SYNC` (ON) | never auto-merges |

Notes:
- **The reusable validation needs two files in the repo root**, at fixed paths the
  MII workflows read: `qc/custom.rules.yaml` (the Simplifier quality-control rule
  set — MII naming conventions) and `advisor.json` (the errors the HL7 Java
  validator may ignore). Both ship with the template; `qc/custom.rules.yaml`
  carries `{{MODULE_SLUG}}`/`{{MODULE_NAME}}`/`{{CALVER_VERSION}}` placeholders
  like the rest of the scaffold. The .NET job is configured upstream to always
  pass, so a naming violation appears in its log, not as a red check.
- **Terminology** is auto-selected, not a toggle: builds use **SU-TermServ** when the
  client-cert secrets are present, else fall back to HL7 `tx.fhir.org` with a notice.
- **Pages mode** (`vars.PAGES_ACTIONS_ENABLED`) chooses the gh-pages push vs the
  Actions deploy path; either serves the previews.
- **Dependabot** is switched by its config presence, not an `if:`.
- **The vendored-template sync** needs the `IG_TEMPLATE_REPO_URL` variable while
  the template repos have not moved (see
  [recipes/first-run-setup.md](recipes/first-run-setup.md) step 5). If the
  source is unreachable the job skips with a notice instead of failing.
- On **this template repo**, some jobs intentionally skip or substitute demo
  placeholder values (the repo ships `{{…}}` values); in a real module they run for
  real. The workflow header comments say which.

### The toggle summary

The full inventory — every repository variable the workflows read, in both
layers. All of them default correctly when unset; [secrets.md](secrets.md)
covers the *secrets* that enable the gated features.

| Pipeline | Variable | Default |
| --- | --- | --- |
| IG build + preview | `ENABLE_PREVIEW` | ON |
| Preview deploy path | `PAGES_ACTIONS_ENABLED` | unset (gh-pages push mode) |
| Reusable validation | `ENABLE_VALIDATION` | ON |
| Convention check | `ENABLE_CONVENTION_CHECK` | ON |
| Dependency check | `ENABLE_DEPENDENCY_CHECK` | ON |
| Security scan | `ENABLE_SECURITY_SCAN` | ON |
| Vendored template sync | `ENABLE_TEMPLATE_SYNC` | ON |
| Module release (CalVer) | `ENABLE_MODULE_RELEASE` | ON |
| Release Please (template only) | `ENABLE_RELEASE_PLEASE` | ON |
| MII Zulip announcement | `ENABLE_ZULIP_ANNOUNCE` | ON |
| MII Zulip sender (template only) | `MII_ZULIP_BOT_EMAIL` | `kds-github-bot@mii.zulipchat.com` |
| Public FHIR Zulip announcement (template only) | `ANNOUNCE_PUBLIC_ZULIP` | OFF |
| Public FHIR Zulip sender (template only) | `FHIR_ZULIP_BOT_EMAIL` | unset |
| Production `-go-publish` | manual `workflow_dispatch` + `publish:false` | OFF (gated) |

The rows marked **template only** have no effect in a module: the bootstrap
deletes `release-please.yml` and `notify-zulip.yml`, so a module's announcement
is governed by `ZULIP_API_KEY` and `ENABLE_ZULIP_ANNOUNCE` alone.
`IG_TEMPLATE_REPO_URL`, `SUSHI_VERSION` and `JAVA_VALIDATOR_VERSION` are plain
variables, not toggles — the last two override the versions `validation.yml`
passes to the MII reusable workflows, and unset means the pinned defaults there
(see [maintenance.md](maintenance.md#where-each-pin-lives-single-source-of-truth)).

---

## Release — the two schemes, never mixed

- **This template repo:** **SemVer** via Release Please on `main` (Layer 1).
- **A module:** **CalVer** `YYYY.n.n` via the MII Module Release Workflow —
  see [release.md](release.md) and [recipes/cut-a-release.md](recipes/cut-a-release.md).
  A module has **no Release Please** after the bootstrap.

## Secrets & enabling the gated features

A module builds and previews without secrets. To enable the optional gated
features — SU-TermServ terminology (for both the build and the reusable
validation) and the Zulip release announcement — see
[docs/secrets.md](secrets.md) for the exact `gh secret set` commands (including
why one secret name suffices: `validation.yml` maps `SU_TERMSERV_CLIENT_*` onto
the reusable workflow's `CDS_DEV_CLIENT_*` inputs at the call site). The
workflows are already wired.
