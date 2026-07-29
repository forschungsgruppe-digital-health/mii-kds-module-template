# Rendering Artifacts (demo) - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Rendering Artifacts (demo)**

## Rendering Artifacts (demo)

 Diese Seite enthält Übersetzungen aus der Originalsprache, in der der Leitfaden verfasst wurde. Informationen zu diesen Übersetzungen und Anweisungen zum Abgeben von Feedback zu den Übersetzungen finden Sie [hier](translationinfo.md). 

### Rendering existing FHIR artifacts in a narrative page

The IG Publisher generates a page for every profile, extension, value set and example in this guide. You do not have to link readers away to them — you can render the parts that matter **inside** a narrative page, next to the prose that explains them.

This page demonstrates three mechanisms. Each block shows the source line, then what it produces.

##### What this page is
A live demonstration shipped with the module scaffold. Read the source of this page next to the rendering, copy what you need, then delete the page. The step-by-step version is in the repository at
`docs/recipes/render-existing-artifacts.md`.

#### 1. Embed a generated artifact view

The Publisher writes several views per artifact as includable fragments. This one is the **element dictionary** of the scaffold's example profile:

```
{% include StructureDefinition-example-patient-dict.xhtml %}

```

Guidance on how to interpret the contents of this table can be found[here](https://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#data-dictionaries)

Other views for the same profile follow the pattern `StructureDefinition-<id>-<view>.xhtml`. The ones this scaffold's build produces include `snapshot`, `diff`, `dict`, `xml` and `json-html` — the same fragments the base template uses to build the artifact pages themselves.

#### 2. Embed part of an example instance

`<p>Error processing command: Fragment syntax error: syntax must be '[ResourceType]/[id] [syntax] [filters]'. Found: in file /home/runner/work/mii-kds-module-template/mii-kds-module-template/input/pagecontent/rendering-artifacts` renders an instance held in this guide, and can narrow it with FHIRPath so the reader sees only the element under discussion — useful when an example is long and one field is the point:

```
<pre class="json" data-fhir="generated" style="white-space: pre; text-wrap: nowrap; width: auto;"><code class="language-json" style="white-space: pre; text-wrap: nowrap;">{
  "<a href="http://hl7.org/fhir/R4/datatypes.html#HumanName#HumanName.family">family</a>" : "Mustermann-Testpatient",
  "<a href="http://hl7.org/fhir/R4/datatypes.html#HumanName#HumanName.given">given</a>" : [
    "Max"
  ]
}</code></pre>


```

`BASE:` selects the subtree, `ELIDE:` replaces named elements with `...`, and `EXCEPT:` keeps only what you list. XML works the same way; TTL is not supported.

#### 3. Query this guide's own artifacts

During the build the Publisher writes `package.db`, a SQLite database of the guide's own artifacts. Any page can query it and render the result as a table — this is the IG-Publisher answer to a cross-artifact query:

```
{% include sql-3-fragment.xhtml %}

```

| | |
| :--- | :--- |
| Name | Description |
| Example: Max Mustermann-Testpatient | Synthetic example for the Example Patient profile. Entirely artificial data. |
| ExamplePatient | Minimal example profile shipped with the template so that a newly created module renders a complete IG immediately. Not an MII artifact — replace it with your module's profiles. |
| MII_IG_Template | Self-check build of the mii-kds-module-template scaffold. This repository is a template for creating a new MII KDS module Implementation Guide, or a migration target for an existing Simplifier MII IG. Every value here is a placeholder — replace them all when you create a real module. |
| mii-param-template-manifest |  |

A JSON form of the same tag controls column titles, CSS class and per-column rendering (`link`, `markdown`, `canonical`, `resource`, …), and `{% include sql-5-fragment.xhtml %}` puts the rows into a Liquid variable instead of rendering a table, so you can lay them out yourself.

##### Before you rely on any of this
These three are documented and stable. Several neighbouring mechanisms are
**not**— some work but appear in no documentation, and at least one is documented under a different name than the implementation uses. The recipe lists which is which, and which primary source to check.

