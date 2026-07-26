# Recipe: extend the translations of your module IG (menu, footer, content, resources)

**Goal.** Add or extend a translation for any part of your module IG — the
navigation **menu**, the **footer / base UI chrome**, the **narrative content**,
and the **conformance resources**.

**Prerequisites.** A module that builds ([create a new module](create-a-new-module.md)).
The four layers are independent — translate only the ones you need.

**Language policy.** This module is **English-default with a German translation**,
the same model as kerndatensatz-basis: English is the default rendering
language (`i18n-default-lang: en`), German
the recommended second rendering (`i18n-lang: [de]`, sources under
`input/translations/de`). Everything below works the same for a further language
— replace `de` with that language code and add it to `i18n-lang`.

> **Why translation is *additive*:** you never edit the German source to
> translate it. Each language gets its own file beside the source, and a part
> with no translation falls back to German. Nothing added here can break a build
> — at worst it is ignored.

---

## The four layers at a glance

Your IG's visible text comes from four places, each with its **own** mechanism:

| # | Layer | Example text | Where the translation goes | You maintain it? |
|---|---|---|---|---|
| 1 | **Narrative content** | your page prose | `input/translations/<lang>/pagecontent/<same-filename>.md` | **yes** |
| 2 | **Menu** | `Startseite`, `Anleitung` | `input/translations/<lang>/includes/menu.xml` | **yes** |
| 3 | **Base UI chrome** (footer, buttons, boilerplate) | `Erstellt <date>`, `Inhaltsverzeichnis` | the **IG template**'s `translations/` | **no — inherited** |
| 4 | **Conformance resources** | a profile's `description` | `input/translations/<lang>/<ResourceType>-<id>.po` | **yes** |

---

## Steps

### 1. Narrative content (pages)

Put the translated page under `pagecontent/` in the translation-source folder,
with the **same file name** as the German page:

```text
input/pagecontent/index.md                     # German — the source
input/translations/de/pagecontent/index.md     # German — renders on /de/
```

- Keep structure, headings and links 1:1 with the German page.
- Translate prose, not identifiers: leave artifact links
  (`StructureDefinition-<id>.html`, …) and FHIR ids unchanged.
- A page with no translation falls back to German on `/en/` with a "no
  translation available" note. Translate the pages that matter most first.

> **The mistake to avoid:** a `<name>-en.md` sibling inside `input/pagecontent/`
> is **not** a translation — the toolchain renders it as a *separate page* and
> `/en/` keeps showing German. It must live under
> `input/translations/<lang>/pagecontent/`, mirroring the HL7 reference IG
> [`FHIR/multi-lang-test-ig`](https://github.com/FHIR/multi-lang-test-ig).

---

### 2. Menu

This module maintains its menu as **files**, one per language:

```text
input/includes/menu.xml                      # German — the source menu
input/translations/de/includes/menu.xml      # German translation
```

When you add, rename or remove a page, update **both** files (and the `pages:`
tree in `sushi-config.yaml`).

Rules:

- **Never add a `menu:` property to `sushi-config.yaml`.** SUSHI would generate a
  single `menu.xml` that cannot be translated and competes with these files —
  the navigation would then stay in one language on every rendering.
- Keep the `href` targets **identical** across languages; translate only labels.
- A dropdown parent must link to a **real page** (`href="#"` fails the
  template's menu QA check).
- Only **one** sub-menu level is supported.

---

### 3. Base UI chrome (footer, buttons, boilerplate) — inherited

The footer's `Links` / table-of-contents / QA-report labels, the copyright line,
`Package … based on FHIR …`, `Generated <date>` and the page-navigation buttons
come from the **IG template**, not from your module. You get German and English
for free.

**Nothing to do in a module.** If a base label is blank in some language, the
fix belongs in the template repository
([`ig-template-mii-kds`](https://github.com/medizininformatik-initiative/ig-template-mii-kds)),
which vendors the base UI-string catalogs — see its
`docs/recipes/add-translation.md` §3. Open an issue there rather than patching
around it here.

> **Keep the template current** so you receive such fixes: the vendored copy in
> `ig-template/` is refreshed by `tools/sync-ig-template.sh` and the
> `sync-ig-template` workflow.

---

### 4. Conformance resources (profiles, code systems, questionnaires)

For each resource whose text you want in English, add one supplement named
exactly `<ResourceType>-<id>.po`:

```text
input/translations/de/StructureDefinition-example-patient.po
```

Format (`msgid` = the German source, `msgstr` = the translation):

```po
#: StructureDefinition.description
msgid "Minimales Beispielprofil …"
msgstr "Minimal example profile …"
```

- The `msgid` must match the generated German text **byte for byte** — copy it
  from `fsh-generated/resources/<Type>-<id>.json` after `sushi .` (quote style,
  umlauts and trailing punctuation included).
- The file name must match the **generated** `resourceType` + `id`, not the FSH
  name.

### What actually renders (verified on IG Publisher 2.2.11)

| Field | Translated by a `.po` supplement? |
|---|---|
| Resource-level `description` (StructureDefinition, CodeSystem, Questionnaire), and a StructureDefinition's element `definition` / `comment` / `requirements` | **Yes** |
| `CodeSystem.concept.display` / `concept.definition` | **No** — localize with a language-tagged `designation` in the resource |
| Resource `title` | **No** — leave it German |
| ValueSet texts, ImplementationGuide title/description | **No** — a supplement is silently ignored |

> **Do not "simulate" the unsupported cases.** A `ValueSet-*.po` or
> `ImplementationGuide-*.po` is ignored — worse than an error, because it gives a
> false sense of coverage.

---

### 5. Build and check

```sh
sushi .
# then the IG Publisher (see first-build-in-devcontainer.md), or push the branch
# and let CI build the /de/ and /en/ preview.
```

1. `/de/` — menu in German; footer shows the copyright, `Package … basiert auf
   FHIR …` and `Erstellt <date>`.
2. `/en/` — menu in English; footer shows `Package … based on FHIR …` and
   `Generated <date>`.
3. A translated page renders in English on `/en/`; an untranslated one falls back
   to German.
4. A translated resource's `description` is English on `/en/`, German on `/de/`.

The build must stay green (QA errors = 0).

---

## Expected result

Both renderings are complete: `/en/` and `/de/` each show their own menu, pages
and resource text, the footer labels are filled in, and the language switcher
moves between them.

## Common errors & fixes

| Symptom | Cause | Fix |
|---|---|---|
| Menu stays in one language everywhere | A `menu:` property crept into `sushi-config.yaml`, or the per-language menu file is missing | Remove the property; add `input/translations/<lang>/includes/menu.xml` (§2) |
| Menu QA error about `href="#"` | A dropdown parent has no real target | Point it at a real page (§2) |
| Navigation differs between languages | An entry was added to one menu file only | Keep both menu files in step (§2) |
| Base/footer labels blank in some language | The template lacks that language's UI-string catalog | Fix in the template repo (§3); make sure your `ig-template/` mirror is current |
| A translated page does not appear on `/de/` | It is a `<name>-de.md` sibling, or the file name differs from the German page | Move it to `input/translations/de/pagecontent/<same-filename>` (§1) |
| A resource supplement does nothing | `msgid` mismatch, wrong file name, or an untranslatable field | Copy the `msgid` from `fsh-generated/resources/…`; check §4 |

---

## Adding a third language

1. Add the code to `i18n-lang` and a matching entry to `translation-sources` in
   `sushi-config.yaml`.
2. Create `input/translations/<lang>/` with `pagecontent/`, `includes/menu.xml`
   and any resource `.po` files.
3. Ask the template repo to vendor that language's base UI-string catalogs (§3),
   otherwise the footer/base labels render blank in the new language.
