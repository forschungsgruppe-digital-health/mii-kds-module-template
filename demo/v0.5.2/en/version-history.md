# Versioning - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Versioning**

## Versioning

### Versioning

#### Version scheme

The **Module Template** module follows the MII calendar-versioning (CalVer) scheme in a SemVer-compatible numeric form:

* format **`YYYY.MINOR.PATCH[-label]`** — the current version is `2026.0.0`;
* **`YYYY`** — the year in which the guide applies and is intended to be used; it takes the place of the major version;
* **`MINOR`** — incremented for non-breaking additions and refinements;
* **`PATCH`** — incremented for corrections and bug fixes;
* **`label`** — optional pre-release or build label, e.g. `draft`, `ballot` or `cibuild`.

#### Comparing versions

Stable releases can be compared by reading the numeric components as SemVer-style `<major>.<minor>.<patch>`, with the calendar year as the major component: `2026.1.0` is newer than `2026.0.3`. Labels denote pre-release or build status; no ordering is inferred among labels.

#### Artifact versions

All released FHIR artifacts in the package carry the same version as the guide and its package. An artifact may therefore receive a new version on release even when the artifact itself did not change. The computable metadata that declares the version algorithm, the versioning policy, the package source and the manifest parameters is described on the [Metadata Overview](metadata.md) page.

#### Release process

Releases follow the [MII Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow): the version is raised in the release branch, the changelog entry is written, the validation workflows run on the release pull request, and the release is tagged after the merge.

#### Version history and changes

* **[Changelog](changes.md)** — the changes of each released version.

> [TODO: If your module has a versioning policy of its own beyond the MII scheme — for example a support window for older versions, or a deprecation policy for profiles — describe it here. Delete this prompt afterwards.]

