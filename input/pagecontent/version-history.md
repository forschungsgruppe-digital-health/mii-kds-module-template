<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Ported from kerndatensatz-basis
     input/pagecontent/version-history.md (branch main); the release process is
     the MII meta wiki page "Module Release Workflow"
     (https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow).
     German mirror: input/translations/de/pagecontent/version-history.md — both
     files must say the same thing. -->

### Versioning

#### Version scheme

The **{{MODULE_TITLE}}** module follows the MII calendar-versioning (CalVer)
scheme in a SemVer-compatible numeric form:

* format **`YYYY.MINOR.PATCH[-label]`** — the current version is
  `{{CALVER_VERSION}}`;
* **`YYYY`** — the year in which the guide applies and is intended to be used;
  it takes the place of the major version;
* **`MINOR`** — incremented for non-breaking additions and refinements;
* **`PATCH`** — incremented for corrections and bug fixes;
* **`label`** — optional pre-release or build label, e.g. `draft`, `ballot` or
  `cibuild`.

#### Comparing versions

Stable releases can be compared by reading the numeric components as
SemVer-style `<major>.<minor>.<patch>`, with the calendar year as the major
component: `2026.1.0` is newer than `2026.0.3`. Labels denote pre-release or
build status; no ordering is inferred among labels.

#### Artifact versions

All released FHIR artifacts in the package carry the same version as the guide
and its package. An artifact may therefore receive a new version on release even
when the artifact itself did not change. The computable metadata that declares
the version algorithm, the versioning policy, the package source and the
manifest parameters is described on the [Metadata Overview](metadata.html) page.

#### Release process

Releases follow the
[MII Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow):
the version is raised in the release branch, the changelog entry is written, the
validation workflows run on the release pull request, and the release is tagged
after the merge.

#### Version history and changes

* **[Changelog](changes.html)** — the changes of each released version.

From the second **formal publication** on, this guide also publishes a
**machine-generated version comparison**: the IG Publisher compares every
profile, value set and code system against the previous release and renders
the delta at `comparison-v<previous>/index.html`, linked from the QA report.
It is enabled by the `version-comparison` parameter in `sushi-config.yaml`
(the commented block there explains the setup and its prerequisites) and
complements the changelog: the changelog explains *why* and *what to do*, the
comparison shows *exactly what changed*.

> [TODO: If your module has a versioning policy of its own beyond the MII scheme
> — for example a support window for older versions, or a deprecation policy for
> profiles — describe it here. Delete this prompt afterwards.]
{: .mii-highlight .mii-highlight-grey}
