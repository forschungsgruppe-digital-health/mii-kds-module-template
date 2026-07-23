# `ig-template/` — vendored IG template (bring-up only)

This folder is a **vendored bring-up copy of
`de.medizininformatikinitiative.template@ab82b65d0781bb1be60727a3047ec05e68f7f896`**
— the MII IG-Publisher template package, copied from the `dev` branch of
[`forschungsgruppe-digital-health/ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
at commit `ab82b65d0781bb1be60727a3047ec05e68f7f896` (package version `0.1.0`,
in development). It carries the Medizininformatik-Initiative (MII) branding
(header, footer, CSS, logo) that the built IG renders.

**Do not edit these files locally.** They are a mirror; the single source of
truth is the `ig-template-mii-kds` repository. Local edits would silently drift
from upstream and be lost at the switch below.

> **Why vendored at all:** the IG Publisher needs a template to build. The
> published package `de.medizininformatikinitiative.template` has **no FHIR
> package-registry entry and no GitHub release yet**, so it cannot be referenced
> by `id#version` during bring-up. Copying the template content into the module
> repo is the documented fallback (spec §4.1) so a module builds today. Once
> `ig-template-mii-kds` cuts a release, the pin becomes a version reference and
> this folder is deleted.

## How `ig.ini` uses this folder

`ig.ini` references it as a **local template folder**:

```ini
template = #ig-template
```

> **Why the leading `#`:** in an `ig.ini` the IG Publisher reads `template =` as
> a *package* reference (`id#version`) unless the value starts with `#`. The `#`
> makes it a **local folder** relative to the IG root, so the publisher loads
> `ig-template/package/package.json` (type `fhir.template`) plus `ig-template/includes/`
> and `ig-template/content/` from this working tree instead of downloading a
> package. This mirrors the self-test in `ig-template-mii-kds`, whose `ig.ini`
> uses `template = #.` (the repo root as the local template).

The template still declares its base, `fhir2.base.template@0.1.0`, in
`package/package.json`; the IG Publisher resolves that base from the package
registry at build time (a network step). Only the MII branding overrides live
here — everything else is inherited from the pinned base.

## What is (and is not) copied here

Copied — the template **content** the publisher consumes:

- `package/package.json` — the template manifest (`type: fhir.template`,
  `base: fhir2.base.template`, dependency pinned to `0.1.0`).
- `includes/` — the header, CSS, and footer fragment overrides that inject the
  MII brand bar, stylesheet link, and imprint links.
- `content/assets/` — `css/mii.css` (MII palette via the base's CSS variables),
  the MII logos (`images/mii-logo.png`, `images/mii-logo-en.png`), and the
  favicon (`ico/favicon.png`).

Not copied — upstream repo machinery that is **not** template content:
`ig-template-mii-kds`'s own `.github/` workflows, `skills/`, `docs/`, its
`package-list.json` (SemVer release metadata), and its self-test harness
(`ig.ini`, `sushi-config.yaml`, `input/`).

## Replacing this with the published package

As soon as `ig-template-mii-kds` publishes a release, switch `ig.ini` from this
vendored folder to the pinned published package and delete `ig-template/`. The
exact steps (where the version number comes from, and how to verify the switch
with a rebuild + QA compare) are in
[`docs/recipes/switch-template-to-published.md`](../docs/recipes/switch-template-to-published.md).
