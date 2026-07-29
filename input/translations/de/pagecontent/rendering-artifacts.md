<!-- DEMONSTRATION PAGE — delete it, and its `pages:` entry and menu link, once
     you have taken what you need. It renders THIS scaffold's example profile
     and example instance, so it keeps working until you remove the starter
     artefacts, and then it breaks loudly rather than silently.

     Every mechanism below is documented HL7 guidance, verified against
     IG Publisher 2.2.11. Nothing here is Simplifier-specific: FQL does not run
     in an IG-Publisher build. See docs/recipes/render-existing-artifacts.md. -->

The IG Publisher generates a page for every profile, extension, value set and
example in this guide. You do not have to link readers away to them — you can
render the parts that matter **inside** a narrative page, next to the prose that
explains them.

This page demonstrates three mechanisms. Each block shows the source line, then
what it produces.

<div class="mii-highlight mii-highlight-blue">
<h5>What this page is</h5>
A live demonstration shipped with the module scaffold. Read the source of this
page next to the rendering, copy what you need, then delete the page.
<strong>Your own repository has the step-by-step version</strong> at
<code>docs/recipes/render-existing-artifacts.md</code> — or read
<a href="https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/blob/main/docs/recipes/render-existing-artifacts.md">the
scaffold's copy</a>. It lists every file to remove when you delete this page.
</div>

### 1. Embed a generated artifact view

The Publisher writes several views per artifact as includable fragments. This
one is the **element dictionary** of the scaffold's example profile:

<pre><code>{% raw %}{% include StructureDefinition-example-patient-dict.xhtml %}{% endraw %}</code></pre>

{% include StructureDefinition-example-patient-dict.xhtml %}

Other views for the same profile follow the pattern
`StructureDefinition-<id>-<view>.xhtml`. The ones this scaffold's build
produces include `snapshot`, `diff`, `dict`, `xml` and `json-html` — the same
fragments the base template uses to build the artifact pages themselves.

### 2. Embed part of an example instance

The <code>{%! fragment %}</code> tag renders an instance held in this guide, and can
narrow it with FHIRPath so the reader sees only the element under discussion —
useful when an example is long and one field is the point:

<pre><code>{%! fragment Patient/ExamplePatientInstance JSON BASE:name %}</code></pre>

{% fragment Patient/ExamplePatientInstance JSON BASE:name %}

`BASE:` selects the subtree, `ELIDE:` replaces named elements with `...`, and
`EXCEPT:` keeps only what you list. XML works the same way; TTL is not
supported.

### 3. Query this guide's own artifacts

During the build the Publisher writes `package.db`, a SQLite database of the
guide's own artifacts. Any page can query it and render the result as a table —
this is the IG-Publisher answer to a cross-artifact query:

<pre><code>{%! sql select Name, Description from Resources order by Name %}</code></pre>

{% sql select Name, Description from Resources order by Name %}

A JSON form of the same tag controls column titles, CSS class and per-column
rendering (`link`, `markdown`, `canonical`, `resource`, …), and a
<code>{%! sqlToData %}</code> tag puts the rows into a Liquid variable
instead of rendering a table, so you can lay them out yourself.

<div class="mii-highlight mii-highlight-green">
<h5>Showing a directive without running it</h5>
Two different escapes appear above, because two engines run in sequence. The
Publisher's own Liquid pass runs <em>before</em> Jekyll and claims eight
keywords: <code>sql</code>, <code>fragment</code>, <code>json</code>,
<code>class-diagram</code>, <code>uml</code>, <code>multi-map</code>,
<code>lang-fragment</code> and <code>dataset</code>. To show one of those
without running it, add an exclamation mark — <code>{%! sql … %}</code>. The
Publisher turns that into a literal itself. Wrapping it in
<code>{% raw %}{% raw %}{% endraw %}</code> does <em>not</em> work, because the
Publisher's pass runs first and does not know what <code>raw</code> means; the
directive executes and its error is written into the page while the build still
reports success.
<br><br>
For a plain Jekyll tag such as <code>{% raw %}{% include %}{% endraw %}</code>
it is the other way round: the Publisher never looks at it, so
<code>{% raw %}{% raw %}{% endraw %}</code> is the correct escape — and the
exclamation mark is a build error, because the Publisher leaves it alone and
Jekyll cannot parse it.
</div>


<div class="mii-highlight mii-highlight-green">
<h5>Before you rely on any of this</h5>
These three are documented and stable. Several neighbouring mechanisms are
<em>not</em> — some work but appear in no documentation, and at least one is
documented under a different name than the implementation uses. The recipe lists
which is which, and which primary source to check.
</div>
