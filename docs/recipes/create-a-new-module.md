# Recipe: create a new module

**Goal.** Go from "Use this template" to a first green preview build of your module.

**Prerequisites.** A GitHub account with rights to create a repo in your org; the
[dev container](first-build-in-devcontainer.md) or a local toolchain.

## Steps

1. **Create the repo.** On this repository's GitHub page, click **"Use this
   template" → Create a new repository**. **Tick "Include all branches"** so you get
   `dev` too. Name it for your module (e.g. `mii-kds-modul-person`).
2. **Run the first-run bootstrap — always.** In a clone, run
   `bash scripts/first-run-bootstrap.sh` (dry run — shows what it will do), then
   `bash scripts/first-run-bootstrap.sh --apply`. It creates `dev`, applies branch
   protection, and **removes** the template-maintenance files (Release Please config
   + workflow, the release announcement, the template `CHANGELOG`, and the bootstrap
   itself). If you ticked "Include all branches" it simply skips creating `dev`; the
   removals and the branch protection still have to happen. See
   [first-run-setup.md](first-run-setup.md). Confirm afterwards:
   `grep -ri release-please .github` returns nothing.
3. **Fill the placeholders.** Open `sushi-config.yaml` and replace every `{{…}}`
   (each is documented inline). The key ones:
   - `{{MODULE_SLUG}}` — lowercase short name (`person`), drives packageId/id/canonical.
   - `{{MODULE_NAME}}` — CamelCase (`Person`) → `name: MII_IG_Person`.
   - `{{MODULE_TITLE}}` — human title (`Person`).
   - `{{CALVER_VERSION}}` — `YYYY.n.n` (e.g. `2026.0.0`), and the related dates.
   `sushi-config.yaml` is where you start, not where you finish: its header lists
   all 19 placeholders and the files each occurs in. Update `ig.ini`'s `ig =`
   line to match your `id`, then `publication-request.json`,
   `.github/workflows/go-publish.yml`, `qc/custom.rules.yaml`, `tests/`, the
   pages and the FSH sources. Finish by sweeping the build inputs for leftovers:

   ```sh
   grep -rnE --exclude=README.md '\{\{[A-Z_]+\}\}' \
     sushi-config.yaml ig.ini publication-request.json qc input tests \
     .github/workflows/go-publish.yml
   ```

   It must come back empty. Do **not** grep the whole tree: `{{ }}` is also
   Liquid syntax in `ig-template/`, `${{ }}` is GitHub-Actions syntax in every
   workflow, and the docs, the `README.md` files and several comments name
   `{{PLACEHOLDER}}` as prose. None of those is a value to replace.
4. **Template reference.** Leave `ig.ini` at `template = #ig-template` (the vendored
   copy) until the MII template package is published; then follow
   [switch-template-to-published.md](switch-template-to-published.md).
5. **Add content.** Replace the example profile in `input/fsh/` with your own
   ([add-a-profile.md](add-a-profile.md)) and the English starter pages in
   `input/pagecontent/` with your module's pages. Keep the German translations in
   `input/translations/de/` in step with them.
6. **Build.** Locally: `sushi . && java -jar publisher.jar -ig ig.ini`, read
   `output/qa.html`. Or push a `feature/*` branch and open the **CI preview URL**
   posted on the PR.
7. **Iterate** until `qa.html` shows 0 errors (a terminology-fallback notice is fine
   when SU-TermServ is not configured).

## Expected result

Your module IG builds green and renders a bilingual (English-default, German translation) preview with
your profile, examples and pages. No Release Please anywhere.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Only `main` exists, no `dev` | Did not tick "Include all branches" | Run the first-run bootstrap (step 2) |
| Build fails on `{{…}}` | A placeholder was left unreplaced | Search the repo for `{{` and fill each |
| "template not found" | Published package not available yet | Keep the vendored `template = #ig-template` |
| Convention check fails | id/name/canonical/version pattern wrong | Match the MII naming convention (the check message names the field) |
