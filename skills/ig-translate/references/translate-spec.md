# ig-translate — mechanics, file conventions, formats

As of 2026; empirically verified with IG Publisher 2.2.7/2.2.8 +
`fhir2.base.template`. The authoritative tool logic is `tools/ig-translate.sh`.

## 1. Resource texts (render today)

**Supported resource types** (Publisher constant
`TRANSLATION_SUPPLEMENT_RESOURCE_TYPES`): **StructureDefinition, CodeSystem,
Questionnaire**. Not supported: ValueSet, ImplementationGuide,
CapabilityStatement.

**Placement & naming:** one translation supplement per resource under the
translation-sources folder (`translation-sources: input/translations/<lang>`):

```
input/translations/en/<ResourceType>-<id>.<ext>     # ext ∈ {po, xliff, json}
```

Examples (for a "Dokument" module):
- `input/translations/en/StructureDefinition-mii-pr-dokument-dokument.po`
- `input/translations/en/StructureDefinition-mii-ex-dokument-nlp-processing-status.po`
- `input/translations/en/StructureDefinition-mii-lm-dokument.po`  (Logical Model = StructureDefinition)
- `input/translations/en/CodeSystem-mii-cs-dokument-nlp-processing-status.po`

> A wrong name (for example `ImplementationGuide-…po`, `menu.po`, or any
> non-`{type}-{id}` name) is **ignored** by the Publisher (log: "name is not
> {type}-{id}.xxx" / "resource type … is not supported").

**`.po` format** (preferred; case-insensitive matching, plural forms):

```po
#: StructureDefinition.description
msgid "<exact German source text from the generated resource>"
msgstr "<English translation>"
```

`msgid` MUST match the German source text of the generated resource exactly
(from `fsh-generated/resources/<Type>-<id>.json`). Translatable fields include:
`description`, element `definition`/`comment`/`requirements`, binding
descriptions, CodeSystem `concept.display`/`definition`/`designation`.

## 2. ValueSet / IG title / menu (do NOT render)

There is no supplement mechanism in the current Publisher. Leave these out on
purpose; do not "simulate" them with wrongly named `.po` files (they would only
be ignored). Add them here once a future Publisher supports them.

## 3. Narrative pages (future-proof, do not render yet)

**Convention** (HL7 ig-guidance, "depends on template / ToDo"): one language
variant per source page, as a sibling file:

```
input/pagecontent/<name>.md        # German (leading)
input/pagecontent/<name>-en.md     # English translation (future-proof)
```

Content rules:
- Copy structure/headings/links 1:1; leave internal artifact links
  (`StructureDefinition-…html` etc.) **unchanged**.
- Do not translate FHIR identifiers, code values, or canonical URLs.
- Leave embedded HTML/image references unchanged.
- Add a `TODO:REVIEW` header line on machine translation.

> Behaviour today: the Publisher does **not** (yet) read `*-en.md`; `/en/` pages
> stay German with the standard note. The files are prepared and render
> automatically once the Publisher/template enable page translation.

## 4. Configuration parameters (`sushi-config.yaml`)

```yaml
parameters:
  i18n-default-lang: de          # leading language
  i18n-lang:
    - en                         # additional rendered language(s)
  translation-sources:
    - input/translations/en      # folder holding the supplements
```

## 5. Guardrails (summary)

German leading · add to the source, never modify it · leave FHIR identifiers in
English · no invention, mark `TODO:REVIEW` · a bilingual human language review
is mandatory · only on confirmation, dry-run default.
