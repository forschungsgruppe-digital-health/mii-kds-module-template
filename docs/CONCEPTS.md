# Concepts — how this module template works and why

Read this after the [Glossary](GLOSSARY.md). It explains the ideas behind this
repository. Every non-obvious choice carries a **Why**.

## 1. What this repository is

This is a **GitHub template repository**: click **"Use this template"** and you get
a fresh copy that is a ready-to-run MII KDS **module IG** project. You then replace
the `{{…}}` placeholders with your module's details, and you have a buildable,
MII-branded FHIR Implementation Guide.

> **Why a template repository, not a library:** an IG project is *your* code — you
> edit its profiles and pages. A template gives you a correct, complete starting
> point (CI, release automation, docs, an example profile) that you then own,
> instead of assembling it from scratch.

## 2. How it references the MII template — vendored vs published

The **look** of the IG comes from a separate template package,
[`de.medizininformatikinitiative.template`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
(Repo A). This scaffold references it in `ig.ini`:

- **Vendored (bring-up):** a copy lives in `ig-template/`, referenced as
  `template = #ig-template`. Used until Repo A has a published release.
- **Published (normal):** `template = de.medizininformatikinitiative.template#<version>`.
  Switch with [recipes/switch-template-to-published.md](recipes/switch-template-to-published.md).

> **Why vendored first:** the template package has no registry entry yet. Vendoring
> keeps the module buildable today; the switch is one line later.

## 3. The metadata contract (CRMI)

`sushi-config.yaml` is not just config — it is a **contract**. It claims the CRMI
ImplementationGuide profiles and carries the MII-required `artifact-*` extensions,
so the module is a properly described, versioned, shareable publication unit. The
`convention-check` job enforces the naming patterns (packageId, id, name, title,
canonical, CalVer version). Fill every `{{PLACEHOLDER}}`; the comments in the file
tell you what each one means.

## 4. Two layers you must not confuse

This is the single most important idea for a maintainer:

- **This template repository** releases *itself* with **SemVer** via Release Please
  (it is tooling).
- **A module you create** releases *itself* with **CalVer** via the MII Module
  Release Workflow — and it carries **no Release Please at all**, because the
  first-run bootstrap removes it.

[WORKFLOWS.md](WORKFLOWS.md) explains both layers side by side. The
[first-run bootstrap](recipes/first-run-setup.md) is what enforces the separation.

> **Why remove Release Please from a module:** two release systems on one repo (SemVer
> tags fighting CalVer tags) corrupt the version history. One repo, one release
> mechanism.

## 5. What propagates to a module, and what does not

When you create a module, the bootstrap **keeps** everything a module needs to live
(the preview build, the CalVer release workflow, validation, the convention check,
dependency + security monitoring, the agent skills, the starter content) and
**removes** only the files that maintain *this template repo itself* (Release Please
config/workflow, the template's release announcement, the template `CHANGELOG`, the
first-run tooling once used).

> **Why previews propagate but Release Please does not:** a branch preview is a
> per-repo development aid every module wants; Release Please is a versioning
> authority that would conflict with the module's CalVer process. Different purpose,
> different fate.

## 6. Registries, publication and governance

A finished module is published as a FHIR package and a website (GitHub Pages under
the creating org; the canonical stays the MII URL). Production publication runs
through the **gated** `-go-publish` — never automatically. The naming, terminology
policy and release process are defined in the
[MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki);
when it and this repo disagree, the wiki wins. See [FURTHER-READING.md](FURTHER-READING.md).
