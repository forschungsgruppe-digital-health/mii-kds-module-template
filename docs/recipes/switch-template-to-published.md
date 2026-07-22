# Recipe: switch from the vendored template to the published package

## Goal

Move your module's `ig.ini` from the **vendored** bring-up template
(`ig-template/`, referenced as `template = #ig-template`) to the **pinned
published** MII template package
(`template = de.medizininformatikinitiative.template#x.y.z`), and delete the
`ig-template/` folder — proving with a rebuild that the switch changed nothing
visible.

> **Why the module starts vendored:** the IG Publisher needs a template to
> build, but the published package `de.medizininformatikinitiative.template`
> initially had **no FHIR package-registry entry and no release**. So the
> template scaffold ships the template *content* copied into `ig-template/` and
> references it as a local folder (spec §4.1). That lets a module build on day
> one. This recipe is the one-time cleanup you run once the template is
> published — after it, your module tracks a versioned dependency like every
> other package, and the scheduled dependency checker proposes upgrades for you.

## When you do this

Do this **once**, as soon as the template repository
[`forschungsgruppe-digital-health/ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
has cut its first release **and** that release is resolvable by the IG Publisher
(see the prerequisite below). Before that point, keep the vendored copy — a
published reference that cannot be resolved makes the build fail.

## Where the published version number comes from

The template repo releases with **SemVer** (`vMAJOR.MINOR.PATCH`) via Release
Please — *not* CalVer (only modules use CalVer). Find the exact number to pin,
in order of preference:

1. **The template repo's Releases page** —
   <https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/releases>.
   Use the latest non-prerelease tag, e.g. `0.1.0` (drop the leading `v` in
   `ig.ini`; the reference is `de.medizininformatikinitiative.template#0.1.0`).
2. **The template's `package-list.json`** (in that repo) — the newest entry with
   `"status"` other than `"ci-build"` is the published version.
3. **The FHIR package registry** —
   `https://packages.fhir.org/de.medizininformatikinitiative.template` lists the
   published versions once the template is registered there.

> **Why pin an exact `x.y.z` and never `#current`:** fixed versions keep a 2029
> rebuild byte-stable (spec §0.2). The convention check rejects a template
> pinned to `current`/`latest`/`dev`, and the dependency checker
> (`scripts/check-updates.mjs`, which already watches
> `de.medizininformatikinitiative.template`) surfaces newer template releases as
> reviewable PRs — you never need a floating pin to stay current.

## Prerequisites

- The published template is **resolvable by the IG Publisher** — the template
  repo has published the package to the FHIR package registry and/or registered
  it in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)'s
  `templates.json` (that registration is the template repo's Gate D). Quick
  check: the registry URL above returns the version you intend to pin (HTTP 200,
  not 404).
- Your module already builds green today against the vendored template (so you
  have a clean baseline to compare against).
- `sushi` (`3.20.0`), the IG Publisher jar (`2.2.11`), and `jq` are available —
  the dev container has all three. Or simply push the branch and let the
  `IG build and preview` workflow build it for you.

## Steps

1. **Capture the baseline QA** from the current (vendored) build, so you can
   prove the switch changes nothing. Build once, then save the QA summary:

   ```bash
   sushi .
   java -Xmx6g -jar publisher.jar -ig ig.ini
   cp output/qa.json /tmp/qa-before.json
   jq '{errs, warnings, hints}' output/qa.json   # note these counts
   ```

2. **Edit `ig.ini`** — replace the local-folder reference with the pinned
   published package. Change:

   ```ini
   template = #ig-template
   ```

   to (use the real version from the section above):

   ```ini
   template = de.medizininformatikinitiative.template#0.1.0
   ```

   Remove the now-stale bring-up comment block above the `template =` line while
   you are there.

   > **Why drop the `#`:** the leading `#` is what told the IG Publisher
   > "this is a local folder." Without it, the value is a package reference
   > (`id#version`) the Publisher resolves from the registry.

3. **Delete the vendored template folder** — it is no longer referenced:

   ```bash
   git rm -r ig-template
   ```

   This also removes `ig-template/README.md`. Nothing else references the folder
   (the only pointer was `ig.ini`, which you just changed).

4. **Rebuild** against the published template:

   ```bash
   sushi .
   java -Xmx6g -jar publisher.jar -ig ig.ini
   ```

   The Publisher now downloads `de.medizininformatikinitiative.template#0.1.0`
   (and its pinned base `fhir2.base.template`) from the registry instead of
   reading `ig-template/`.

5. **QA compare** — confirm the switch is behaviour-neutral. The error/warning
   counts must not increase, and the branding (header logo, footer imprint
   links, colours) must look identical:

   ```bash
   jq '{errs, warnings, hints}' output/qa.json          # compare to step 1
   diff <(jq -S 'del(.date)' /tmp/qa-before.json) \
        <(jq -S 'del(.date)' output/qa.json) || true    # only the date should differ
   ```

   Open `output/index.html` (or the branch preview the CI publishes) and eyeball
   the header/footer against the vendored build.

6. **Open a PR to `dev`** with the `ig.ini` change and the `ig-template/`
   deletion. The `IG build and preview` workflow rebuilds and posts the preview
   URL; the convention check confirms `template = de.medizininformatikinitiative.template#0.1.0`
   is a valid pinned reference. Merge once green.

## Expected result

- `ig.ini` references `de.medizininformatikinitiative.template#x.y.z`; the
  `ig-template/` folder is gone.
- The rebuilt IG looks identical to the vendored build (same branding, same
  pages), and the QA error/warning counts did not increase.
- The convention check passes (`M7 no floating pins` shows the pinned template
  reference), and future template releases arrive as dependency-checker PRs.

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| Publisher aborts: `Unable to resolve template de.medizininformatikinitiative.template#x.y.z` | The template is not yet published/registered, or the version does not exist | Confirm the registry URL returns that version (prerequisite); if it 404s, the template repo has not published it yet — revert to the vendored `#ig-template` and wait |
| Build works but the MII branding disappeared | You deleted `ig-template/` but `ig.ini` still says `template = #ig-template` (now a dangling local folder) | Make sure step 2 (edit) happened before/with step 3 (delete); the Publisher silently builds an unbranded IG if the local folder is missing |
| Convention check fails on the template line | You pinned `#current` / `#latest` / left a `TODO` | Pin an exact SemVer `x.y.z` from the template repo's release |
| QA error count jumped after the switch | The published release differs from the vendored commit (a newer template version, or the vendored copy had local edits) | Expected if you jumped versions — read the template repo's CHANGELOG for the delta; if you had edited `ig-template/` locally (you should not have), reconcile those edits upstream first |
| `git rm -r ig-template` says "did not match any files" | Already deleted, or you are not at the repo root | Run from the module root; confirm with `ls ig-template` |
