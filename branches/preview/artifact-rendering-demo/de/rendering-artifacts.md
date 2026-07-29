# Rendering Artifacts (demo) - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Rendering Artifacts (demo)**

## Rendering Artifacts (demo)

The IG Publisher generates a page for every profile, extension, value set and example in this guide. You do not have to link readers away to them — you can render the parts that matter **inside** a narrative page, next to the prose that explains them.

This page demonstrates three mechanisms. Each block shows the source line, then what it produces.

##### What this page is
A live demonstration shipped with the module scaffold. Read the source of this page next to the rendering, copy what you need, then delete the page.
**Your own repository has the step-by-step version**at
`docs/recipes/render-existing-artifacts.md`— or read
[the scaffold's copy](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/blob/main/docs/recipes/render-existing-artifacts.md). It lists every file to remove when you delete this page.

### 1. Embed a generated artifact view

The Publisher writes several views per artifact as includable fragments. This one is the **element dictionary** of the scaffold's example profile:

```
{% include StructureDefinition-example-patient-dict.xhtml %}
```

Guidance on how to interpret the contents of this table can be found[here](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#data-dictionaries)

Other views for the same profile follow the pattern `StructureDefinition-<id>-<view>.xhtml`. The ones this scaffold's build produces include `snapshot`, `diff`, `dict`, `xml` and `json-html` — the same fragments the base template uses to build the artifact pages themselves.

### 2. Embed part of an example instance

The `{% fragment %}` tag renders an instance held in this guide, and can narrow it with FHIRPath so the reader sees only the element under discussion — useful when an example is long and one field is the point:

```
{% fragment Patient/ExamplePatientInstance JSON BASE:name %}
```

`BASE:` selects the subtree, `ELIDE:` replaces named elements with `...`, and `EXCEPT:` keeps only what you list. XML works the same way; TTL is not supported.

### 3. Query this guide's own artifacts

During the build the Publisher writes `package.db`, a SQLite database of the guide's own artifacts. Any page can query it and render the result as a table — this is the IG-Publisher answer to a cross-artifact query:

```
{% sql select Name, Description from Resources order by Name %}
```

| | |
| :--- | :--- |
| Name | Description |
| Example: Max Mustermann-Testpatient | Synthetic example for the Example Patient profile. Entirely artificial data. |
| ExamplePatient | Minimal example profile shipped with the template so that a newly created module renders a complete IG immediately. Not an MII artifact — replace it with your module's profiles. |
| MII_IG_Template | Self-check build of the mii-kds-module-template scaffold. This repository is a template for creating a new MII KDS module Implementation Guide, or a migration target for an existing Simplifier MII IG. Every value here is a placeholder — replace them all when you create a real module. |
| mii-param-template-manifest |  |

A JSON form of the same tag controls column titles, CSS class and per-column rendering (`link`, `markdown`, `canonical`, `resource`, …), and a `{% sqlToData %}` tag puts the rows into a Liquid variable instead of rendering a table, so you can lay them out yourself.

##### Showing a directive without running it
Two different escapes appear above, because two engines run in sequence. The Publisher's own Liquid pass runs
**before**Jekyll and claims eight keywords:
`sql`,
`fragment`,
`json`,
`class-diagram`,
`uml`,
`multi-map`,
`lang-fragment`and
`dataset`. To show one of those without running it, add an exclamation mark —
`{% sql … %}`. The Publisher turns that into a literal itself. Wrapping it in
`{% raw %}`does
**not**work, because the Publisher's pass runs first and does not know what
`raw`means; the directive executes and its error is written into the page while the build still reports success.

For a plain Jekyll tag such as
`{% include %}`it is the other way round: the Publisher never looks at it, so
`{% raw %}`is the correct escape — and the exclamation mark is a build error, because the Publisher leaves it alone and Jekyll cannot parse it.

##### Before you rely on any of this
These three are documented and stable. Several neighbouring mechanisms are
**not**— some work but appear in no documentation, and at least one is documented under a different name than the implementation uses. The recipe lists which is which, and which primary source to check.

