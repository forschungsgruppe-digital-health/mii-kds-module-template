---
name: ig-translate
description: >-
  The module-facing translation workflow for an English-default MII KDS module
  IG. Produces the German translation supplements the IG Publisher expects,
  either by translating from English (en→de) or by harvesting an
  already-published German rendering. The English source stays
  authoritative/binding; every machine translation must be human-reviewed.
  Report/propose only; changes go through a pull request targeting dev. Activate
  on request/confirmation, once the module builds and QA is green.
license: CC-BY-4.0
---

# ig-translate — module-facing en→de translation workflow

Manages the German translation *supplements* of a concrete module IG and puts
them exactly where the IG Publisher expects them. English is the default
language; German is the translation.

> **Adapted from the MII KDS sample IG.** Carried over from the `ig-translate`
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
  template, and the en-default/de-translation decision. Its own `ig-translate`
  skill documents those template obligations.
- **This module scaffold** owns the module-facing *workflow* below: creating or
  harvesting the actual translation supplements and translated narrative pages
  (`input/translations/de/…`) for this concrete module IG, plus the supporting
  tool `scripts/ig-translate.sh`.

If the task is "keep the template's overrides language-neutral", switch to the
template package's `ig-translate` skill. Stay here for a module's content.

## What the current toolchain renders (verified)

Re-verified with **IG Publisher 2.2.11** + `fhir2.base.template` 0.1.0 on the
template package's preview (2026-07). The earlier sample-IG table was WRONG
about narrative pages: it used a `*-<lang>.md` sibling, which the toolchain reads
as a separate page, not a translation. The correct location is a
translation-source folder, as the HL7 reference
[`FHIR/multi-lang-test-ig`](https://github.com/FHIR/multi-lang-test-ig) uses:

| Content | Translatable? | Mechanism (file path) |
|---------|---------------|-----------------------|
| **Narrative pages** (`input/pagecontent/<name>.md`) | **Yes, renders** | `input/translations/<lang>/pagecontent/<same-filename>` — the whole page renders in `<lang>` on `/<lang>/`. No file → falls back to the default-language source. |
| Resource texts of **StructureDefinition, CodeSystem, Questionnaire** (`description`, designations, element `definition`) | **Yes, renders** | Supplement `input/translations/<lang>/<Type>-<id>.{po\|xliff\|json}` |
| **Menu** (`input/includes/menu.xml`) | **Yes** | `input/translations/<lang>/includes/menu.xml` |
| **ValueSet**, some **ImplementationGuide** title fields, `concept.display`/`concept.definition` | **Partial / No** | Not applied from a plain `.po` supplement on this toolchain |

Consequence: place the German rendering of `input/pagecontent/<name>.md` at
`input/translations/de/pagecontent/<name>.md` and `/de/<name>.html` renders in
German. Do NOT use a `<name>-<lang>.md` sibling in `input/pagecontent/`.

> Treat this table as ground truth. **Re-verify it whenever the pinned IG
> Publisher or base template version changes**, and update the table here and in
> the template package's copy.

## Binding guardrails

- **The English source stays leading/binding.** A translation is a rendering
  aid, never the normative text.
- **Never change the source.** Translations are added under
  `input/translations/<lang>/` (pages under `.../pagecontent/`, resources as
  `.po` supplements); the English `pagecontent`/FSH stay untouched.
- **FHIR identifiers stay English** (`name`/`id`/codes) — do not "translate"
  them.
- **No fact invention.** Mark every machine translation `TODO:REVIEW`; a
  bilingual human review of the language is mandatory before the German
  rendering is trusted.
- **Only on confirmation.** The default is a dry-run/plan (`scripts/ig-translate.sh`).

## Procedure — "translate" mode (en→de)

1. **Scan:** `scripts/ig-translate.sh --scan de` → lists pages and supported
   resources with their target file paths.
2. **Resource supplements:** one file per StructureDefinition/CodeSystem/
   Questionnaire at `input/translations/de/<Type>-<id>.po` (`msgid` = exact
   English source text from the generated resource, `msgstr` = German
   translation). These render.
3. **Narrative pages:** one translation per `input/pagecontent/<name>.md` at
   `input/translations/de/pagecontent/<name>.md` (same file name, structure and
   links; FHIR identifiers unchanged).
4. **Validate:** `scripts/ig-translate.sh --validate de` (naming/placement
   convention).
5. **Build & QA:** run the module build; confirm the `/de/` artifact pages show
   the translated element texts and QA errors are as expected.
6. **Human review** of the language sign-off (mandatory).

## Procedure — "harvest" mode (adopt an existing German rendering)

1. Fill in `references/harvest-config.yaml` (source of the German texts: a
   parallel rendered German guide for narrative, FSH `translation`
   extensions / `designation`s for resource texts; page/artifact mapping).
2. **Resources:** move existing German designations / translation extensions
   from the source into `input/translations/de/<Type>-<id>.po` (instead of
   re-translating).
3. **Narrative:** copy German page content from the parallel German guide into
   `input/translations/de/pagecontent/<name>.md` (cite the source path per page;
   no invention; mark anything unclear `TODO:REVIEW`).
4. Validate / build / review as above.

Findings are reported and proposed as changes via a pull request **targeting
`dev`** — never merged autonomously, never pushed to `main`.

## References

- [`references/translate-spec.md`](references/translate-spec.md) — the full
  mechanics, file conventions, and formats.
- [`references/harvest-config.yaml`](references/harvest-config.yaml) —
  configuration schema for adopting an existing German rendering.
- [`../../scripts/ig-translate.sh`](../../scripts/ig-translate.sh) — scan/validate
  (dry-run default).
- Template-side mechanism and policy: the `ig-translate` skill in
  [`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds).
