# Recipe: render existing FHIR artifacts in a narrative page

**Goal.** Show a profile, an example or a table of your own artifacts *inside* a
narrative page, instead of linking the reader away to the generated artifact
page.

**Prerequisites.** A module that builds ([create a new module](create-a-new-module.md))
and at least one artifact to render. The demonstration page
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
| `{{tree}}` | `{% raw %}{% include StructureDefinition-<id>-snapshot.xhtml %}{% endraw %}` (or `-diff`, `-dict`) |
| `{{xml}}` / `{{json}}` | `{% raw %}{% include StructureDefinition-<id>-xml.xhtml %}{% endraw %}` / `-json-html` |
| `<fql … select …>` over one artifact's elements | `{% raw %}{% include StructureDefinition-<id>-dict.xhtml %}{% endraw %}` |
| `<fql …>` across many artifacts | `{% raw %}{% sql … %}{% endraw %}` over `package.db` |
| `{{render:<canonical>}}` | usually nothing — the Publisher already generates that artifact's page |

## Steps

1. **Decide which of the three families you need.**
   - One artifact, a view the Publisher already renders → an `include`.
   - Part of one example instance → `{% raw %}{% fragment %}{% endraw %}`.
   - Something across several artifacts → `{% raw %}{% sql %}{% endraw %}`.
2. **Write the directive** into any page under `input/pagecontent/`. Use the
   demonstration page as the reference for exact syntax.
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

- [`{% raw %}{% fragment %}{% endraw %}`](https://build.fhir.org/ig/FHIR/ig-guidance/fragments.html) — a filtered slice of an instance
- [`{% raw %}{% sql %}{% endraw %}` and `{% raw %}{% sqlToData %}{% endraw %}`](https://build.fhir.org/ig/FHIR/ig-guidance/sql.html) — queries over `package.db`
- [`{% raw %}{% json <file> <template> %}{% endraw %}`](https://build.fhir.org/ig/FHIR/ig-guidance/jsonxml.html) — render a JSON file through a Liquid template
- [Mermaid](https://build.fhir.org/ig/FHIR/ig-guidance/diagrams-mermaid.html) and [PlantUML](https://build.fhir.org/ig/FHIR/ig-guidance/diagrams-plantuml.html) diagrams
- Generated fragment codes — [IG Publisher documentation](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation), whose own list is explicitly incomplete
- `-intro.md` / `-notes.md` files, which inject your prose into a generated artifact page

**Works, but is not in any documentation** — usable, but do not build a module's
structure on them, and re-check after an IG Publisher bump:

- `[[[ … ]]]` — auto-links a canonical URL or artifact name
- `{% raw %}{% lang-fragment %}{% endraw %}`, `{% raw %}{% dataset %}{% endraw %}`
- Sort and format variants of the list fragments (`list-byid-…`, `table-…`)

**Documented under a name the implementation does not use:** the guidance
describes `{% raw %}{% uml %}{% endraw %}`; the keyword registered in the
Publisher is `class-diagram`. Try both and keep whichever builds.

**Experimental by its own documentation:** SQL-on-FHIR `ViewDefinition`s, added
through the `viewDefinition` IG parameter, extend `package.db` with your own
tables — the guidance says the definition and the tables "may change without
warning".

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| The include renders nothing | The fragment name does not match a generated file | Check the artifact `Id:` — the fragment is `<ResourceType>-<Id>-<view>.xhtml`, using the `Id:`, not the FSH `Profile:` name |
| The directive appears as literal text on the page | It was inside a code fence, or Liquid was disabled | Wrap examples in `{% raw %}…{% endraw %}` only when you want to *show* the directive |
| `{% raw %}{% sql %}{% endraw %}` returns nothing | The table or column does not exist | Open `package.db` from the build output with any SQLite client and look at the real schema |
| The build fails after adding a page | The page is not registered | Add it to `pages:` in `sushi-config.yaml`; a `pages:` entry also needs the file to exist |
| It worked, then broke after a toolchain bump | An undocumented mechanism changed | Check the list above; prefer the documented three |
