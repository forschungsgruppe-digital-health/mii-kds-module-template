# Releasing a module (MII CalVer — the reference)

This page is the **reference** for how a module built from this template is
released. It maps the automation in
[`.github/workflows/module-release.yml`](../.github/workflows/module-release.yml)
one-to-one onto the MII
**[Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow)**
(the authoritative wiki page), and says plainly which steps are **automated** and
which are **human-gated**.

> **Who is this for:** a maintainer who has already created a module from this
> template and wants to cut a version. New to the module itself? Start with the
> README and `docs/recipes/create-a-new-module.md` first.

> **Reference vs. recipe (keep the split clean):** this file explains *what the
> release is and why each step exists*. The click-by-click walkthrough lives in
> the companion recipe `docs/recipes/cut-a-release.md`. Read this page once to
> understand the model; follow the recipe each time you release.

---

## The one hard rule: CalVer here, SemVer there — never mix

- **Modules** (this repo, and every repo created from this template) are
  released **only** with **CalVer `YYYY.n.n`** via the **MII Module Release
  Workflow** — the tag-driven, human-gated automation described below. **Never
  Release Please.**
- **The two template repos** (`ig-template-mii-kds` and `mii-kds-module-template`
  itself) release **themselves** with **SemVer** via **Release Please**. That is
  *tooling* versioning, and it lives only on those template repos.

> **Why the hard boundary:** two release systems on one repo corrupt the version
> history — a module carrying Release Please would auto-cut SemVer tags that
> fight the MII CalVer process. One repo, one release mechanism. That is why the
> **first-run bootstrap removes** Release Please (`release-please.yml`,
> `release-please-config.json`, `.release-please-manifest.json`) and the
> template-only `notify-zulip.yml` from a new module, but **keeps**
> `module-release.yml`, `go-publish.yml`, and the preview workflow. See
> `docs/recipes/first-run-setup.md`.

### CalVer format

`YYYY.n.n` — for example `2026.0.0`, then `2026.0.1` for a patch in the same
sequence, then `2027.0.0` for the next annual sequence. A pre-release adds a
suffix: `2026.0.0-rc.1`, `2026.0.0-alpha.1`.

- **Tag** = the version prefixed with `v`: `v2026.0.1` (the basis precedent —
  `kerndatensatz-basis` tags `v2026.0.0` / `v2026.0.1` on `main`).
- The release automation triggers on the tag glob `v[0-9]+.[0-9]+.[0-9]+*`
  (exactly the pattern `kerndatensatz-basis` uses).

---

## What is automated vs. human-gated (at a glance)

| Release step | Who | Where |
| --- | --- | --- |
| Prepare the release branch, bump the version, open the PR, merge | **Human** | your machine + GitHub |
| Reusable FHIR validation on the release PR (error gate) | Automated | the validation workflow (§4.2) |
| Push the CalVer tag | **Human** | `git push origin v2026.0.1` |
| Build the IG from the tagged commit (buildability gate) | Automated | `module-release.yml` → `build` |
| Create the **draft** GitHub Release with generated notes | Automated | `module-release.yml` → `release` |
| Edit notes, attach the package, **publish** the draft | **Human** | GitHub Releases |
| Announce the published release on the MII Zulip (topic `Releases`) | Automated | `module-release.yml` → `notify_zulip` |
| Formal FHIR publication (`-go-publish`) — dry run, then real | **Human (Gate E)** | `go-publish.yml` (manual) |

> **Why a *draft* release, not a published one:** the automation cuts a draft so
> a human always reviews the notes and attaches the package before anything goes
> public. Publishing is the deliberate human act that fires the announcement.

> **Why the build gate:** `kerndatensatz-basis` leaves the tag-time job to
> release creation only and relies on the reusable validation workflow (run on
> the release PR) for the FHIR error gate. This template adds a build on the tag
> so a tag that does not even build never becomes a release, and so the
> `package.tgz` is captured as a workflow artifact. QA *counts* are reported but
> not required to be zero — the authoritative error gate is still the reusable
> validation workflow (§4.2).

---

## Step by step, mapped to the MII Module Release Workflow

The headings below match the wiki's numbered steps. This template is
**IG-Publisher-native** (it builds with SUSHI + the HL7 IG Publisher, not the
Simplifier bake pipeline), so the Simplifier-specific wiki sub-steps are replaced
by the IG-Publisher / `go-publish.yml` path — noted inline where they differ.

### 1. Create the release branch — *human*

```bash
git checkout dev
git pull origin dev
git checkout -b release/v2026.0.1
```

> **Why off `dev`, not `main`:** this template uses the `dev` → `main` branching
> model (see `CONTRIBUTING.md`). Release preparation happens on a short-lived
> branch off `dev`; the release itself is the `dev` → `main` promotion. (The wiki
> branches off `main` because the reference modules use a single-branch model —
> the branch names differ, the intent is identical.)

### 2. Update the version — *human*

Bump the CalVer version everywhere it appears **in this template**. Unlike the
wiki's file list (which names Simplifier's `package.json` and `guide.yaml`, not
present here), the version lives in exactly two files:

- **`sushi-config.yaml`**
  - `version:` — the module version (e.g. `version: "2026.0.1"`).
  - the `artifact-version` extension `valueString` — keep it equal to `version`.
  - the sequence `start:` year — the `YYYY` part (e.g. `2026`).
- **`publication-request.json`**
  - `version` — the CalVer version.
  - `path` — ends in the version (`.../<version>`); update it too.
  - `sequence` — the `YYYY` sequence year.
  - `desc` — a one-line human description of *this* release.
  - `first` — set to `true` only for a module's very first release; set it to
    `false` for every release after that.

> **Why keep the three `sushi-config.yaml` spots in sync:** the metadata contract
> (checked by the single convention check, `wiki-consistency-check`, §4.2)
> asserts `version` is CalVer and that the embedded copies agree. Drift fails the
> check — fix it before tagging.

> **Terminology & release notes:** author the module's changelog in the IG's
> release-notes page (`input/pagecontent/…`). Terminology is selected
> automatically by the build (SU-TermServ when the client certificate secret is
> present, else the public HL7 fallback `https://tx.fhir.org`) — see
> [`docs/MAINTENANCE.md`](./MAINTENANCE.md) and the workflow header.

### 3–4. Open the release PR and pass validation — *human + automated*

```bash
git add -A
git commit -m "chore: prepare release v2026.0.1"
git push origin release/v2026.0.1
```

Open a PR from `release/v2026.0.1` into `dev` (then promote `dev` → `main` per
`CONTRIBUTING.md`). The **reusable FHIR validation workflow (§4.2)** runs on the
PR and is the authoritative error gate (the wiki's `DOTNET_FHIR_VALIDATION` /
`JAVA_FHIR_VALIDATION`). Wait for it to pass before merging.

> **Why validate before tagging:** the tag is the point of no return — it drives
> release creation. Catch FHIR errors on the PR, not after the tag is public.

### 5. Merge, then tag — *human triggers, automation reacts*

After the release reaches `main`:

```bash
git checkout main
git pull origin main
git tag v2026.0.1
git push origin v2026.0.1
```

Pushing the tag triggers **`module-release.yml`** (automated):

- the **`build`** job builds the IG (pinned SUSHI + IG Publisher, terminology
  auto-selected) and uploads `package.tgz` + the QA report as the
  `module-release-build` artifact;
- the **`release`** job then creates a **draft** GitHub Release named for the tag,
  with GitHub's auto-generated notes plus a body template to fill in.

> **On the un-instantiated template repo this workflow does nothing:** a `guard`
> job detects unreplaced `{{…}}` placeholders and every downstream job skips with
> a `::notice`. Only a real, bootstrapped module runs it for real. This also
> keeps a template-repo SemVer tag from ever driving the module path.

### 6. Package publishing — *human (adapted for IG-Publisher-native)*

The wiki's Simplifier "bake pipeline" step does not apply here. Instead, the
authoritative FHIR package is produced by the IG Publisher and published via the
gated **`go-publish.yml`** in step 8 below. The `package.tgz` from the `build`
job is available now as a convenience (attach it in step 7).

### 7. Finalize and publish the GitHub Release — *human*

1. Open the **draft** release the automation created.
2. Edit the notes; remove the `<!-- DELETE START/END -->` blocks.
3. Attach the module's `package.tgz` (from the `module-release-build` artifact).
4. Change the release from **draft** to **published**.

Publishing fires the **`notify_zulip`** job (automated): it posts to the MII
Zulip organisation, stream `MII-Kerndatensatz`, **topic `Releases`**.

> **Why topic `Releases` (not `Template Releases`):** `Releases` is the **module**
> topic; the *template repos* announce their SemVer tooling releases under
> `Template Releases`. Keeping the two topics apart keeps the CalVer/SemVer split
> legible in chat too (§2.12).

> **Gate G — the announcement key:** `notify_zulip` maps `secrets.ZULIP_API_KEY`
> to an env var; when the key is absent the job **skips with a `::notice`, it
> never fails the release**. A human adds the key once (MII bot
> `kds-github-bot@mii.zulipchat.com`).

### 8. Formal FHIR publication — *human, Gate E*

The release is now visible on GitHub, but the IG is **not yet formally
published**. Do that through the gated
[`.github/workflows/go-publish.yml`](../.github/workflows/go-publish.yml):

1. Actions → **"Publish release with IG Publisher"** → **Run workflow**.
2. First run: `release_ref = v2026.0.1`, **`publish = false`** — this is a
   **complete dry run** (build + stage + validate, nothing written anywhere).
3. Review the dry-run output and the exported `ig-registry.patch`.
4. Only after review, run it again with **`publish = true`** to commit `gh-pages`
   and deploy — the FHIR IG Registry change is exported as a patch for a
   **human-submitted** upstream PR; it is never pushed automatically.

> **Why go-publish stays fully manual (Gate E):** formal publication is
> irreversible in practice and touches the public FHIR ecosystem. `module-release.yml`
> only *points at* go-publish (in the release notes and the job summary) — it
> never dispatches it. The maintainer owns the decision to publish, every time.
> `module-release.yml` and `go-publish.yml` are edited separately; this page does
> not modify go-publish.

### Post-release checklist (from the wiki)

- [ ] Verify the release is visible on GitHub.
- [ ] Run `go-publish` (dry run → publish) and submit the IG-registry PR.
- [ ] Announce to any other relevant stakeholders.
- [ ] Update the MII
      [CDS Modules version overview](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/%C3%9Cbersicht-%C3%BCber-Versionen-der-Kerndatensatz%E2%80%90Module).

---

## Toggles (§2.13)

The release automation honours two repo-variable switches (unset = the default
shown; set the variable to flip it):

| Variable | Default | Effect |
| --- | --- | --- |
| `ENABLE_MODULE_RELEASE` | ON | gates the `build` + `release` jobs; set to `false` to disable the automated release path |
| `ENABLE_ZULIP_ANNOUNCE` | ON | gates the `notify_zulip` job; set to `false` to disable the MII announcement |

> **Toggles never override the gates:** even with everything enabled, `go-publish`
> stays manual and its `publish` input defaults to `false` (Gate E). The full
> workflow inventory and every toggle is listed in `docs/WORKFLOWS.md`.

---

## See also

- The workflow itself:
  [`.github/workflows/module-release.yml`](../.github/workflows/module-release.yml)
  (header comment documents purpose, triggers, toggles, and the gates).
- The gated publication workflow:
  [`.github/workflows/go-publish.yml`](../.github/workflows/go-publish.yml).
- The click-by-click recipe: `docs/recipes/cut-a-release.md` (companion to this
  reference).
- Dependency & vulnerability cadence: [`docs/MAINTENANCE.md`](./MAINTENANCE.md).
- The authoritative source: the MII
  [Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow)
  wiki page — MII conventions win; if this page and the wiki ever conflict,
  follow the wiki and flag it.
