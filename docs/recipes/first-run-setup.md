# Recipe: first-run setup of a new module

**Goal.** Turn a fresh copy of this template (made with **"Use this template"**)
into a working module repository: get the `dev` branch and branch protection in
place, and remove the template-maintenance files that must not live in a module.

**Who this is for.** Anyone who just created a new module repo from
`mii-kds-module-template` and has never done this before. No prior FHIR tooling
knowledge required.

**Prerequisites.**

- You created a new repository via **"Use this template"** (not a fork).
- You can run [`git`](https://git-scm.com/) and the
  [GitHub CLI `gh`](https://cli.github.com/) locally, and `gh auth login` is
  done. `gh` needs **admin** on the new repo to set branch protection (you have
  it if you created the repo).
- Alternatively, you can run the bootstrap in the repo's **dev container** (it
  ships `git`, Node, and the tooling) — see
  [`first-build-in-devcontainer.md`](first-build-in-devcontainer.md).

---

## The one decision up front: how you get the `dev` branch

GitHub's **"Use this template"** copies **only the default branch (`main`)**
unless you tell it otherwise. This template is built around a two-branch model —
`main` (stable) and `dev` (integration) — so your module needs `dev`.

You have two ways to get it. **Pick one.**

### Option A — tick "Include all branches" when you create the repo (simplest)

On the **"Create a new repository"** page (the one you land on after clicking
"Use this template"), tick the checkbox **"Include all branches"** before
clicking **"Create repository from template"**.

> **Why this is the easy path:** it copies `dev` (and any other branches) along
> with `main`, so you skip creating `dev` by hand. You still run the bootstrap
> below to apply branch protection and remove the template-maintenance files —
> just skip the part that creates `dev` (the script detects it already exists).

If you already created the repo **without** ticking it, use Option B.

### Option B — run the first-run bootstrap

The bootstrap creates `dev` from `main` for you, protects both branches, and
removes the template-maintenance files. Do this once, right after creating the
repo.

> **Why you must not skip this:** without `dev`, a newcomer pushes straight to
> `main` and loses the stable/integration model on day one. And a module that
> keeps this template's Release Please files would auto-cut **SemVer** tags that
> fight the MII **CalVer** module release process — one repo, one release
> mechanism.

---

## Steps (Option B, or Option A minus branch creation)

### 1. Clone your new module locally

```bash
gh repo clone <your-org>/<your-module-repo>
cd <your-module-repo>
```

### 2. Dry-run the bootstrap (this changes nothing)

```bash
tools/first-run-bootstrap.sh
```

Read the output. It prints, in order:

- **Step 1** — the exact `gh` commands it would run to create `dev` and protect
  both branches.
- **Step 2** — the list of files it would remove, **each with a one-line
  "why"**. On a fresh template this is:
  - `.github/workflows/release-please.yml`, `release-please-config.json`,
    `.release-please-manifest.json` — the SemVer release automation for the
    *template* repo.
  - `.github/workflows/notify-zulip.yml` — announces the *template's* SemVer
    releases (your module announces its own CalVer releases instead).
  - `CHANGELOG.md` — only if present (the template's SemVer changelog).
  - `docs/recipes/first-run-setup.md` and `tools/first-run-bootstrap.sh` — this
    recipe and the bootstrap itself; only meaningful before the module exists.
- **Post-bootstrap checklist** — the manual steps below.

> **Why a dry-run first:** you see exactly what will change before anything
> happens. The removal list is the single source of truth — if it ever tried to
> touch module content or the workflows a module keeps (previews, validation,
> monitoring, the convention check, the module release workflow, the skills),
> the script hard-aborts.

### 3. Apply it

```bash
tools/first-run-bootstrap.sh --apply
```

This creates `dev`, applies branch protection, and **stages** the file removals
with `git rm` (nothing is committed yet). Review and commit on a branch:

```bash
git status                 # see the staged removals
git checkout -b chore/first-run-bootstrap
git commit -m "chore: first-run bootstrap (remove template-maintenance files)"
git push -u origin chore/first-run-bootstrap
```

Open a pull request into `dev` and merge it.

> **Reviews on a solo project:** by default the bootstrap requires **1**
> approval on `main` and **0** on `dev`, so you can merge your own work into
> `dev`. If you are the only maintainer and want to merge into `main` without a
> second person, run `tools/first-run-bootstrap.sh --apply --main-reviews 0`.

> **Undo a removal** before committing: `git restore --staged --worktree <path>`.

### 4. Work through the post-bootstrap checklist

The bootstrap printed it; the essentials:

1. **Replace every `{{PLACEHOLDER}}`.** Start in `sushi-config.yaml` (its header
   lists every placeholder and what it means), then `ig.ini` (the module slug
   **and** the pinned `template = de.medizininformatikinitiative.template#<version>`),
   then `publication-request.json` and `.github/workflows/go-publish.yml`. Run
   `node tools/convention-check.mjs` — it must stay green.
2. **Enable GitHub Pages:** Settings → Pages → Build and deployment →
   **"GitHub Actions"**. Then set the repository variable
   `PAGES_ACTIONS_ENABLED=true`.
3. **Terminology (optional):** add `SU_TERMSERV_CLIENT_CERT` /
   `SU_TERMSERV_CLIENT_KEY` / `SU_TERMSERV_CLIENT_CERT_PASSWORD` to build against
   the MII SU-TermServ; without them the build falls back to the public HL7
   server and does not fail.
4. **Release announcements (optional):** add `ZULIP_API_KEY` to announce your
   module's CalVer releases to the MII Zulip.

---

## Expected result

- `main` and `dev` both exist and are protected (Settings → Branches shows the
  rules).
- The Release Please files, `notify-zulip.yml`, and the bootstrap machinery are
  gone; the preview, validation, monitoring, convention-check, module-release
  workflows and the `skills/` are still there.
- `node tools/convention-check.mjs` runs green (placeholders count as
  "parameterized" until you resolve them).

## Common errors and fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ERROR: 'gh' not found` | GitHub CLI not installed | Install `gh` and run `gh auth login`, or run inside the dev container. |
| `cannot read main; … are you authenticated?` | `gh` not logged in, or run in the wrong repo | `gh auth login`; make sure you are inside the **new module** clone. |
| Branch protection call fails with 403 | Your account lacks admin on the repo | Ask an owner to grant admin, or apply protection manually in Settings → Branches. |
| Convention check fails on a `release/**` branch | A `{{PLACEHOLDER}}` is still unresolved | Resolve the reported field; a module must not release with placeholders. |
| `dev already exists — leaving it as is.` | You used Option A ("Include all branches") | Expected — the script just skips creating `dev`. |
