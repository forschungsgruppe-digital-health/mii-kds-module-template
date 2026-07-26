# Maintenance — dependency & vulnerability monitoring

This repo pins every dependency to a fixed version. Pinning is safe but goes
stale **silently**. Three monitoring layers actively surface available updates
and known vulnerabilities. None of them ever changes a version by itself: every
bump is a proposal that a human reviews and merges.

> **Why three layers:** each tool sees a different slice. Dependabot reads
> standard package manifests; the custom checker reads the FHIR/IG-specific
> pins Dependabot cannot see; the scanners find *known vulnerabilities* rather
> than newer versions. Only together do they cover this repo.

**A module created from this template inherits all of this monitoring** — the
`.github/dependabot.yml`, both workflows, the checker script, and these docs
propagate on "Use this template" and keep running in the module unchanged
(unlike the template-maintenance Release Please files, which the first-run
bootstrap removes). The checker reads pins from the module's own files, so it
reports the module's drift without any adaptation.

## The cadence at a glance

| Layer | What it watches | When | Where results land | Switch |
|---|---|---|---|---|
| **A — Dependabot** (`.github/dependabot.yml`) | GitHub Actions pins; a root npm manifest (when present); dev container **feature** versions (`devcontainers` ecosystem — the dev container is image-only, so there is no Dockerfile for the `docker` ecosystem to read) | weekly, Monday | update PRs targeting `dev`; Dependabot alerts under **Security → Dependabot** | config-file presence + repo Dependabot settings (no `vars.*` toggle — Dependabot is not a gated job) |
| **B — Version checker** (`.github/workflows/dependency-check.yml` + `scripts/check-updates.mjs`) | `de.medizininformatikinitiative.template` (from `ig.ini`), `fhir2.base.template` (transitive; local only when vendored), IG Publisher, SUSHI, Jekyll (from the build workflow env), the FHIR package dependencies (from `sushi-config.yaml`) | Monday 06:00 UTC + manual dispatch | one continuously-updated tracking issue **"Dependency status \<YYYYWww\>"** (label `dependencies`) + a `drift-report` workflow artifact | `vars.ENABLE_DEPENDENCY_CHECK` (ON by default) |
| **C — Security scan** (`.github/workflows/security-scan.yml`) | known vulnerabilities (OSV database), misconfigurations, committed secrets — via OSV-Scanner + Trivy `fs`; plus Trivy `image` over the dev container's digest-pinned base image (OS/base-image vulnerabilities the other scans miss) | Monday 07:00 UTC + every PR to `dev` + manual dispatch | **Security → Code scanning** (SARIF categories `osv-scanner`, `trivy-fs`, `trivy-image`) | `vars.ENABLE_SECURITY_SCAN` (ON by default) |

A disabled workflow still triggers but its jobs show as **skipped** — that is
expected, not an error.

## Where each pin lives (single source of truth)

The checker reads pins from the real files — it is never a second list to keep
in sync:

| Pin | Location |
|---|---|
| `de.medizininformatikinitiative.template` | `ig.ini` → `template = de.medizininformatikinitiative.template#<version>` |
| `fhir2.base.template` | inside the template package (transitive) — locally only in a vendored bring-up copy (`ig-template/package/package.json`) |
| FHIR package dependencies (`de.basisprofil.r4`, `de.medizininformatikinitiative.kerndatensatz.meta`, `hl7.fhir.uv.crmi`, `hl7.fhir.uv.xver-r5.r4`, …) | `sushi-config.yaml` → `dependencies:` block |
| IG Publisher / SUSHI / Jekyll | `env:` values (`PUBLISHER_VERSION`, `SUSHI_VERSION`, `JEKYLL_VERSION`) in the CI build workflow |
| GitHub Actions | commit-SHA pins in `.github/workflows/*.yml` (with `# vX.Y.Z` comments) |
| Dev container (base-image digest, feature versions, SUSHI/Jekyll installs) | `.devcontainer/devcontainer.json` — features come as Dependabot PRs; the image digest and the `postCreateCommand` tool pins are bumped manually |

Until a pin's file lands, the tracking issue shows a `pin not found` row — a
reminder, not an error. Two more expected row states:

- **`not yet published`** on `de.medizininformatikinitiative.template`: the
  checker looks on `packages.fhir.org` first and falls back to the template
  repo's GitHub releases; until Repo A's first release reaches either, this
  row cannot compare versions. It resolves itself once the package is
  published.
- **`transitive — bump via the template pin`** on `fhir2.base.template`: this
  repo does not pin the base template directly — bumping the
  `de.medizininformatikinitiative.template` pin in `ig.ini` is how a newer
  base template arrives. The row exists so base2 releases stay visible.

## Honest coverage limits — read this before trusting a green scan

The layer-C scanners cover the **tooling** ecosystems only (npm, gem,
Docker/OS packages, GitHub Actions). They do **not** meaningfully cover:

- **FHIR content packages** (`de.medizininformatikinitiative.template`,
  `fhir2.base.template`, `de.basisprofil.r4`, MII Kerndatensatz packages, …)
  — not indexed in any vulnerability database.
- **The IG Publisher jar** — a downloaded binary, likewise not indexed.

For those artifacts the **layer-B version checker is the available safeguard**:
staying on the latest reviewed release is the only systematic mitigation.
A green Security tab therefore does *not* mean "the FHIR toolchain is known
to be safe" — it means "no known vulnerability in the scannable ecosystems".
This limit applies equally to every module created from this template.

Two further dev-container limits, stated plainly:

- The `trivy-image` job scans the **pinned base image**, not a fully built dev
  container: feature layers and the `postCreateCommand` installs (SUSHI,
  Jekyll) are not in the scanned image. Their manifests are covered by the
  fs/OSV scans and layer B.
- **Nothing auto-bumps the base-image digest.** Dependabot's `devcontainers`
  ecosystem updates feature versions only. A `trivy-image` finding against the
  base image is the signal to bump the digest manually (resolve the new digest
  for the tag, update `devcontainer.json`, PR to `dev`).

## Ground rules

- **Never auto-merge, never auto-float.** Every bump is a PR/issue a human
  reviews (changelog first) and merges into `dev`.
- **Version and checksum move together.** An IG Publisher bump always includes
  the recomputed jar SHA-256 — never one without the other.
- Update PRs (Dependabot and PR mode) target `dev`, never `main`.

## How-tos

- Review a proposed bump: [`docs/recipes/review-a-dependency-update.md`](recipes/review-a-dependency-update.md)
- Triage a Security-tab finding: [`docs/recipes/triage-a-vulnerability-alert.md`](recipes/triage-a-vulnerability-alert.md)
- Run the checker locally: `node scripts/check-updates.mjs` (Node 22, no npm
  install needed; exits 0 always — drift is in the output)
- Run its unit tests (offline): `node --test scripts/check-updates.test.mjs`

## Accepted risks

Findings assessed as not applicable (and dismissed in the Security tab) are
recorded here so the reasoning survives the alert.

| Date | Finding (CVE/GHSA + artifact) | Why accepted | Review by |
|---|---|---|---|
| _none yet_ | | | |
