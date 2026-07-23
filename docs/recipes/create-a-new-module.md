# Recipe: create a new module

**Goal.** Go from "Use this template" to a first green preview build of your module.

**Prerequisites.** A GitHub account with rights to create a repo in your org; the
[dev container](first-build-in-devcontainer.md) or a local toolchain.

## Steps

1. **Create the repo.** On this repository's GitHub page, click **"Use this
   template" → Create a new repository**. **Tick "Include all branches"** so you get
   `dev` too. Name it for your module (e.g. `mii-kds-modul-person`).
2. **First-run bootstrap** (skip only if you ticked "Include all branches" *and* you
   also want the template-maintenance files gone — you do): in a clone, run
   `bash tools/first-run-bootstrap.sh` (dry run — shows what it will do), then
   `bash tools/first-run-bootstrap.sh --apply`. It creates `dev`, applies branch
   protection, and **removes** the template-maintenance files (Release Please config
   + workflow, the release announcement, the template `CHANGELOG`, and the bootstrap
   itself). See [first-run-setup.md](first-run-setup.md). Confirm afterwards:
   `grep -ri release-please .github` returns nothing.
3. **Fill the placeholders.** Open `sushi-config.yaml` and replace every `{{…}}`
   (each is documented inline). The key ones:
   - `{{MODULE_SLUG}}` — lowercase short name (`person`), drives packageId/id/canonical.
   - `{{MODULE_NAME}}` — CamelCase (`Person`) → `name: MII_IG_Person`.
   - `{{MODULE_TITLE}}` — human title (`Person`).
   - `{{CALVER_VERSION}}` — `YYYY.n.n` (e.g. `2026.0.0`), and the related dates.
   Also update `ig.ini`'s `ig =` line to match your `id` if you changed the slug.
4. **Template reference.** Leave `ig.ini` at `template = #ig-template` (the vendored
   copy) until the MII template package is published; then follow
   [switch-template-to-published.md](switch-template-to-published.md).
5. **Add content.** Replace the example profile in `input/fsh/` with your own
   ([add-a-profile.md](add-a-profile.md)) and the German starter pages in
   `input/pagecontent/` with your module's pages. Keep the English supplements in
   `input/translations/en/` in step with them.
6. **Build.** Locally: `sushi . && java -jar publisher.jar -ig ig.ini`, read
   `output/qa.html`. Or push a `feature/*` branch and open the **CI preview URL**
   posted on the PR.
7. **Iterate** until `qa.html` shows 0 errors (a terminology-fallback notice is fine
   when SU-TermServ is not configured).

## Expected result

Your module IG builds green and renders a bilingual (German-default) preview with
your profile, examples and pages. No Release Please anywhere.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Only `main` exists, no `dev` | Did not tick "Include all branches" | Run the first-run bootstrap (step 2) |
| Build fails on `{{…}}` | A placeholder was left unreplaced | Search the repo for `{{` and fill each |
| "template not found" | Published package not available yet | Keep the vendored `template = #ig-template` |
| Convention check fails | id/name/canonical/version pattern wrong | Match the MII naming convention (the check message names the field) |
