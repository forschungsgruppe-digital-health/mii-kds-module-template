<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) intro for the ImplementationGuide RESOURCE page —
     the artifact page the IG Publisher generates for the IG resource itself
     (ImplementationGuide-<id>.html). Without this file the page renders bare:
     no dependency table, no cross-version analysis, no copyright statements.
     Ported from kerndatensatz-basis input/pagecontent/ImplementationGuide-mii-ig-base.md
     and adapted to the scaffold.
     German mirror: input/translations/de/pagecontent/ (same file name) — both
     files must say the same thing.
     FILE NAME CARRIES THE IG ID: like the IG-level .po catalogue, this file and
     its German mirror must be RENAMED to your concrete IG id when you create a
     module (docs/recipes/create-a-new-module.md step 4) — the pages: entry in
     sushi-config.yaml references it by that name. The template repo's CI
     self-check renames all three automatically for the preview. -->
This ImplementationGuide resource defines the technical details of this
publication, including dependencies and publishing parameters.

- [XML](../ImplementationGuide-mii-ig-{{MODULE_SLUG}}.xml)
- [JSON](../ImplementationGuide-mii-ig-{{MODULE_SLUG}}.json)

### Cross Version Analysis

{% lang-fragment cross-version-analysis.xhtml %}

### IG Dependencies

This IG contains the following dependencies on other IGs.

{% lang-fragment dependency-table.xhtml %}

> **Where the versions come from.** The table lists the packages pinned in
> [`sushi-config.yaml`](https://github.com/{{GITHUB_ORG}}/{{REPO_NAME}}/blob/main/sushi-config.yaml)
> (`dependencies:`) together with everything the IG Publisher loads alongside
> them. `hl7.terminology.r4` (THO) and `hl7.fhir.uv.extensions.r4` are
> deliberately **not** pinned there: the Publisher
> [always loads both](https://build.fhir.org/ig/FHIR/ig-guidance/versions.html#automatic-packages)
> and injects their most recent full release only when the dependency tree does
> not already carry them — a version pinned by a dependency (for the KDS
> family: the MII meta package) therefore takes precedence automatically. The
> exact versions a concrete build used are recorded in its `qa-versions.json`
> output.
{: .ig-highlight .ig-highlight-grey}

### Global Profiles

This IG declares the following global profiles — profiles that apply to every
instance of their resource type exchanged under this guide. An empty table
means this module declares none.

{% lang-fragment globals-table.xhtml %}

### Copyrights

{% lang-fragment ip-statements.xhtml %}

### IG Parameter Settings and Expansion Parameters

Expansion parameters are query parameters that can be passed to a `ValueSet`
`$expand` operation to control how the ValueSet is expanded — that is, how the
full list of codes is generated from the ValueSet definition. The
[IG Parameters](https://hl7.org/fhir/tools/en/CodeSystem-ig-parameters.html)
used for this IG are declared in
[`sushi-config.yaml`](https://github.com/{{GITHUB_ORG}}/{{REPO_NAME}}/blob/main/sushi-config.yaml)
(`parameters:`). A module that pins its expansion parameters through a CRMI
manifest additionally links the generated `Parameters` resource from here (see
the commented manifest blocks in `sushi-config.yaml` and the Metadata Overview
page, if the module keeps it).
