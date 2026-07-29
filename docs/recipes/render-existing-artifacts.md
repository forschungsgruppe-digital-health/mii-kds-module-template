# Recipe: render existing FHIR artifacts in a narrative page

**Goal.** Show a profile, an example or a table of your own artifacts *inside* a
narrative page, instead of linking the reader away to the generated artifact
page.

**Prerequisites.** A module that builds ([create a new module](create-a-new-module.md))
and at least one artifact to render.

**Not this recipe:** improving the page the Publisher *generates* for a profile —
that is [how profiles render](render-profiles.md), which covers the tabs and the
`-intro.md` / `-notes.md` files. The fragment names here are those same views:
`-diff` is the *Differential* tab, `-snapshot` the *Snapshot* tab, `-dict` the
element table. The demonstration page
`input/pagecontent/rendering-artifacts.md` ships with this scaffold and renders
live — read it next to its own source.

## If you are coming from Simplifier

**FQL does not run in an IG-Publisher build.** It is a Firely-platform feature:
it works in Simplifier's page rendering and in Firely Terminal, and Simplifier's
own IG documentation never mentions the IG Publisher. There is no `<fql>` tag,
no `{{tree}}`, no `{{render:…}}` here.

What replaces it:

| Simplifier | Here |
| --- | --- |
| `{{tree}}` | `{% include StructureDefinition-<id>-snapshot.xhtml %}` (or `-diff`, `-dict`) |
| `{{xml}}` / `{{json}}` | `{% include StructureDefinition-<id>-xml.xhtml %}` / `-json-html` |
| `<fql … select …>` over one artifact's elements | `{% include StructureDefinition-<id>-dict.xhtml %}` |
| `<fql …>` across many artifacts | `{% sql … %}` over `package.db` |
| `{{render:<canonical>}}` | usually nothing — the Publisher already generates that artifact's page |

## Steps

1. **Decide which of the three families you need.**
   - One artifact, a view the Publisher already renders → an `include`.
   - Part of one example instance → `{% fragment %}`.
   - Something across several artifacts → `{% sql %}`.
2. **Write the directive** into any page under `input/pagecontent/`. Use the
   demonstration page as the reference for exact syntax.

   To *show* a directive rather than run it, escape the opening brace —
   `&#123;% … %}` inside a `<pre><code>` block. `{% raw %}` does **not** work
   here: the publisher's own Liquid runs before Jekyll and ignores it, so the
   directive executes anyway and its error is written into the page.
3. **Build and look at it.** A directive that names an artifact or fragment that
   does not exist renders as nothing, or fails the build — both are loud, which
   is the point of checking here rather than after publication.
4. **Delete the demonstration page** when you no longer need it: remove
   `input/pagecontent/rendering-artifacts.md`, its `pages:` entry in
   `sushi-config.yaml`, its menu entry, and the German mirror.

## Expected result

The rendering appears inline in your page, styled like the rest of the guide,
and the QA report shows no new errors or broken links.

## What is documented, and what only works

Checked against the primary sources on 2026-07-29, IG Publisher 2.2.11. This
matters: **no single exhaustive list of these mechanisms exists**, so anything
you find quoted elsewhere is worth verifying.

**Documented and safe to rely on** — [HL7 guidance, *Page Content*](https://build.fhir.org/ig/FHIR/ig-guidance/):

- [`{% fragment %}`](https://build.fhir.org/ig/FHIR/ig-guidance/fragments.html) — a filtered slice of an instance
- [`{% sql %}` and `{% sqlToData %}`](https://build.fhir.org/ig/FHIR/ig-guidance/sql.html) — queries over `package.db`
- [`{% json <file> <template> %}`](https://build.fhir.org/ig/FHIR/ig-guidance/jsonxml.html) — render a JSON file through a Liquid template
- [Mermaid](https://build.fhir.org/ig/FHIR/ig-guidance/diagrams-mermaid.html) and [PlantUML](https://build.fhir.org/ig/FHIR/ig-guidance/diagrams-plantuml.html) diagrams
- Generated fragment codes — [IG Publisher documentation](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation), whose own list is explicitly incomplete
- `-intro.md` / `-notes.md` files, which inject your prose into a generated artifact page

**Works, but is not in any documentation** — usable, but do not build a module's
structure on them, and re-check after an IG Publisher bump:

- `[[[ … ]]]` — auto-links a canonical URL or artifact name
- `{% lang-fragment %}`, `{% dataset %}`
- Sort and format variants of the list fragments (`list-byid-…`, `table-…`)

**Documented under a name the implementation does not use:** the guidance
describes `{% uml %}`; the keyword registered in the
Publisher is `class-diagram`. Try both and keep whichever builds.

**Experimental by its own documentation:** SQL-on-FHIR `ViewDefinition`s, added
through the `viewDefinition` IG parameter, extend `package.db` with your own
tables — the guidance says the definition and the tables "may change without
warning".

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| The include renders nothing | The fragment name does not match a generated file | Check the artifact `Id:` — the fragment is `<ResourceType>-<Id>-<view>.xhtml`, using the `Id:`, not the FSH `Profile:` name |
| A directive you wanted to *show* was executed instead | `{% raw %}` does not protect it — the publisher's Liquid runs before Jekyll and ignores it | Escape the opening brace: `&#123;% … %}` inside a `<pre><code>` block, so no directive token exists in the source |
| The page shows "Error processing command: …" | A directive ran and failed — often one you meant to display | Same fix. Note the build reports **no error** for this and stays green; read the rendered page |
| `{% sql %}` returns nothing | The table or column does not exist | Open `package.db` from the build output with any SQLite client and look at the real schema |
| The build fails after adding a page | The page is not registered | Add it to `pages:` in `sushi-config.yaml`; a `pages:` entry also needs the file to exist |
| It worked, then broke after a toolchain bump | An undocumented mechanism changed | Check the list above; prefer the documented three |
