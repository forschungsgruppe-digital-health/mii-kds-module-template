# Multi-language support (German default, English supplement)

This template produces a bilingual IG with **German as the default language
and English as the recommended second language**.

> **Why this deviates from kerndatensatz-basis:** basis is en-default with
> German translations under `translations/de/`. This template inverts that on
> purpose (project decision) — the IG *content* language for modules built
> from this template is German-first. Do not "correct" it back to en-default.

The corresponding `sushi-config.yaml` parameters (already set):

```yaml
parameters:
  i18n-default-lang: de
  i18n-lang:
    - en
  translation-sources:
    - input/translations/en
```

## Directory structure

```
input/
└── translations/
    └── en/                          # English translation supplements
        ├── pagecontent/             # Translated narrative pages (same file
        │                            #   names as input/pagecontent/)
        ├── includes/                # Translated fragments (e.g. menu.xml)
        ├── intro-notes/             # Translated per-artifact intro/notes
        └── *.po                     # Resource translations (PO format), e.g.
                                     #   ImplementationGuide-mii-ig-{{MODULE_SLUG}}.po
```

## Workflow: adding English translations

1. **Build first.** The IG Publisher generates translation templates for
   every resource into `translations/en/po/` (repo root, gitignored) on each
   build.
2. **Resources (profiles, extensions, value sets, …):** copy the generated
   `.po` file into `input/translations/en/`, translate the `msgstr` lines
   (Poedit, any text editor, or machine translation with human review), and
   rebuild.
3. **Pages:** create the English page under
   `input/translations/en/pagecontent/<same-filename>.md`; the publisher
   matches it to the German original by file name.
4. **Menu:** maintain the translated `menu.xml` under
   `input/translations/en/includes/`.

Translations placed under `input/translations/en/` are preserved across
rebuilds; everything under the repo-root `translations/` directory is
generated output.

Useful references:

- PO format: https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html
- FHIR multi-language guidance: https://build.fhir.org/ig/FHIR/ig-guidance/languages.html
