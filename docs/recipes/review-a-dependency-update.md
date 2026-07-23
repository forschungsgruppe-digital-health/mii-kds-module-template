# Recipe: review a dependency update

You received a Dependabot PR, a checker PR, or a row in the
"Dependency status" tracking issue (label `dependencies`). This recipe takes
you from "a bump is proposed" to "the bump is merged — or consciously not".
It applies unchanged in a module created from this template.

> **Why a recipe:** updates are proposals, never automatic
> ([`docs/MAINTENANCE.md`](../MAINTENANCE.md)). The human in the loop is you.

## 1. Read the proposal

- **Dependabot PR:** the artifact and versions are in the PR title; release
  notes are quoted in the PR body.
- **Tracking issue:** each `update available` row names the artifact, the
  pinned and the latest version, and links the changelog / release notes.

## 2. Check the changelog

Open the linked release notes and answer two questions:

1. Is it a **breaking change** (major bump, changed defaults, removed flags)?
2. Does anything in the notes affect **how this IG builds** (template
   parameters, profile/terminology behavior, Jekyll/liquid behavior,
   publisher CLI flags)?

If unsure, prefer bumping in a working branch and letting the preview build
answer.

## 3. Apply the bump in the pin's real location

Create a working branch off `dev` (e.g. `chore/bump-<artifact>`). Then edit
exactly one pin (one bump per PR — keep diffs reviewable):

| Artifact | Edit here |
|---|---|
| `de.medizininformatikinitiative.template` | the `template =` line in `ig.ini` (see also [`switch-template-to-published.md`](switch-template-to-published.md) when moving off a vendored copy) |
| `fhir2.base.template` | not pinned here — arrives via a template bump (row above); only a vendored `ig-template/package/package.json` has a local pin |
| FHIR package dependency | its line in the `dependencies:` block of `sushi-config.yaml` |
| IG Publisher | `PUBLISHER_VERSION` env in the CI build workflow **+ the jar SHA-256 (step 4)** |
| SUSHI / Jekyll | `SUSHI_VERSION` / `JEKYLL_VERSION` env in the CI build workflow |
| GitHub Action | the commit SHA in the `uses:` line **and** its `# vX.Y.Z` comment (Dependabot PRs do this for you) |

## 4. IG Publisher only: recompute the jar SHA-256

The version pin and the checksum move **together** — never bump one without
the other. Download the release jar and hash it:

```sh
curl -L https://github.com/HL7/fhir-ig-publisher/releases/download/<version>/publisher.jar \
  -o publisher.jar && shasum -a 256 publisher.jar
```

(macOS: `shasum -a 256`; on Linux `sha256sum publisher.jar` is equivalent.
The release tag is the plain version, e.g. `2.2.11` — no `v` prefix.)

Paste the printed hash next to the new version wherever the checksum is
pinned. A mismatch later means the downloaded artifact changed — exactly what
the checksum is there to catch.

## 5. Build and verify

Run the IG build (the PR CI does the same). The bump is only good if the
build is clean:

- lint/tests for the touched tooling (`node --test scripts/check-updates.test.mjs`
  if you touched the checker),
- the IG build must succeed with QA errors = 0.

## 6. Merge — or document why not

- Open a PR to `dev`, reference the tracking issue row / Dependabot PR, get a
  review, merge. **Never auto-merge.**
- If you decide **against** the bump (e.g. a breaking change with no benefit),
  say so briefly in the tracking issue so the next reader does not re-do your
  analysis. The row will reappear weekly — that is by design.
