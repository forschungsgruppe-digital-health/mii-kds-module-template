---
name: ig-translate
description: >-
  The module-facing translation workflow for a German-led MII KDS module IG.
  Produces the English translation supplements the IG Publisher expects, either
  by translating from German (de→en) or by harvesting an already-published
  English rendering. German stays authoritative/binding; every machine
  translation must be human-reviewed. Report/propose only; changes go through a
  pull request targeting dev. Activate on request/confirmation, once the module
  builds and QA is green.
license: CC-BY-4.0
---

# ig-translate — module-facing de→en translation workflow

Manages the English translation *supplements* of a concrete module IG and puts
them exactly where the IG Publisher expects them. German is the leading
language; English is the recommended second rendering.

> **Adapted from the FGDH sample IG.** Carried over from the `ig-translate`
> skill of
> [`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell)
> (CC-BY-4.0), refocused on the **module** side.

## Scope split (read this first)

Multi-language support is split across the two template repositories — do not
duplicate it:

- **The template package
  ([`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds))**
  owns the language *mechanism* and *policy*: language-neutral
  header/footer/CSS overrides, the inherited UI-string translations of the base
  template, and the de-default/en-recommended decision. Its own `ig-translate`
  skill documents those template obligations.
- **This module scaffold** owns the module-facing *workflow* below: creating or
  harvesting the actual translation supplements (`input/translations/en/…`) and
  the future-proof translated narrative pages for this concrete module IG, plus
  the supporting tool `tools/ig-translate.sh`.

If the task is "keep the template's overrides language-neutral", switch to the
template package's `ig-translate` skill. Stay here for a module's content.

## What the current toolchain renders (verified)

Empirically checked with IG Publisher 2.2.7 **and** 2.2.8 + `fhir2.base.template`
(carried over from the sample IG's verification):

| Content | Translatable today? | Mechanism |
|---------|---------------------|-----------|
| Resource texts of **StructureDefinition, CodeSystem, Questionnaire** (element `definition`, `description`, designations) | **Yes, renders** | Translation supplement `input/translations/<lang>/<Type>-<id>.{po\|xliff\|json}` |
| **ValueSet**, **ImplementationGuide** title/description, **menu** | **No** | Not supported as a supplement by the Publisher (ignored) |
| **Narrative pages** (`input/pagecontent/*.md`) | **Not yet** | The `*-<lang>.md` sibling-file convention is documented (HL7 ig-guidance: "ToDo, depends on template") but not yet read by the Publisher/template |

Consequence: the `/en/` page tree still shows narrative pages in German with the
note "There is no translation page available …" — that is **expected** (German
leading). Translated element texts do appear on the artifact pages under `/en/`.
Page translations are still produced in the correct scheme (future-proof) so
they render automatically once the toolchain implements the feature.

> Treat this table as ground truth. **Re-verify it whenever the pinned IG
> Publisher or base template version changes**, and update the table here and in
> the template package's copy.

## Binding guardrails

- **German stays leading/binding.** English is a translation aid, never the
  normative text.
- **Never change the source.** Translations are added under
  `input/translations/` (or as `*-en.md` siblings); the German
  `pagecontent`/FSH stay untouched.
- **FHIR identifiers stay English** (`name`/`id`/codes) — do not "translate"
  them.
- **No fact invention.** Mark every machine translation `TODO:REVIEW`; a
  bilingual human review of the language is mandatory before the English
  rendering is trusted.
- **Only on confirmation.** The default is a dry-run/plan (`tools/ig-translate.sh`).

## Procedure — "translate" mode (de→en)

1. **Scan:** `tools/ig-translate.sh --scan en` → lists pages and supported
   resources with their target file paths.
2. **Resource supplements:** one file per StructureDefinition/CodeSystem/
   Questionnaire at `input/translations/en/<Type>-<id>.po` (`msgid` = exact
   German source text from the generated resource, `msgstr` = English
   translation). These render.
3. **Narrative pages:** one translation per `input/pagecontent/<name>.md` at
   `input/pagecontent/<name>-en.md` (same structure/links; FHIR identifiers
   unchanged). Stored future-proof.
4. **Validate:** `tools/ig-translate.sh --validate en` (naming/placement
   convention).
5. **Build & QA:** run the module build; confirm the `/en/` artifact pages show
   the translated element texts and QA errors are as expected.
6. **Human review** of the language sign-off (mandatory).

## Procedure — "harvest" mode (adopt an existing English rendering)

1. Fill in `references/harvest-config.yaml` (source of the English texts: a
   parallel rendered English guide for narrative, FSH `translation`
   extensions / `designation`s for resource texts; page/artifact mapping).
2. **Resources:** move existing English designations / translation extensions
   from the source into `input/translations/en/<Type>-<id>.po` (instead of
   re-translating).
3. **Narrative:** copy English page content from the parallel English guide into
   `input/pagecontent/<name>-en.md` (cite the source path per page; no
   invention; mark anything unclear `TODO:REVIEW`).
4. Validate / build / review as above.

Findings are reported and proposed as changes via a pull request **targeting
`dev`** — never merged autonomously, never pushed to `main`.

## References

- [`references/translate-spec.md`](references/translate-spec.md) — the full
  mechanics, file conventions, and formats.
- [`references/harvest-config.yaml`](references/harvest-config.yaml) —
  configuration schema for adopting an existing English source.
- [`../../tools/ig-translate.sh`](../../tools/ig-translate.sh) — scan/validate
  (dry-run default).
- Template-side mechanism and policy: the `ig-translate` skill in
  [`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds).
