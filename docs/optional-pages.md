# Optional pages — the (0..1) menu entries and how to decide them

The MII-agreed module menu structure (see [page-structure.md](page-structure.md))
gives every entry a cardinality: **(1..1)** entries are mandatory in every
module, **(0..1)** entries are per-module decisions. This document is the
**decision checklist** for the optional entries; the procedure for executing
either decision lives in one canonical place —
[recipes/remove-an-optional-page.md](recipes/remove-an-optional-page.md).

## How optional entries are marked

Every optional page ships in **four visible forms**, chosen to fit the
scaffold's existing conventions (placeholder table, `[TODO]` banners, the
convention check):

1. **In the rendered menu** — the entry's label carries the suffix
   **`(optional)`** in BOTH menu files (`input/includes/menu.xml`,
   `input/translations/de/includes/menu.xml`; the word is identical in English
   and German), so the open decision is visible in the navigation itself —
   not only in source comments.
2. **In the rendered page** — a banner at the top ("Optional page (0..1)…",
   `mii-highlight` style, in both languages), so a module lead reviewing the
   preview sees the open decision without reading source.
3. **In the source** — an `OPTIONAL-PAGE` HTML comment in the page file (both
   languages) and `OPTIONAL (0..1)` comments at the menu entries and in the
   `sushi-config.yaml` `pages:` tree.
4. **In CI** — the convention check's rule **M9**
   (`scripts/convention-check.mjs`): on development branches it *reports* the
   pages and menu entries still carrying a marker (green, visible in the job
   summary); on a `release/**` branch an undecided marker — the `OPTIONAL-PAGE`
   comment **or** an `(optional)` menu label — **fails** the check, so an
   undecided option cannot ship silently. A marker present in only one
   language (page or menu) fails on every branch (a half-applied decision).

All four forms are **scaffold-only**: executing the decision deletes them — see
the recipe.

> **Why a marker string and not a file list:** the decision state lives in the
> page and the menu themselves, so deleting the banner and the label suffix
> *is* recording the decision — there is no second registry to update, and the
> check can never disagree with the page.

## The decision checklist

| Menu entry (cluster) | Page | Keep it when … | Drop it when … |
| --- | --- | --- | --- |
| Guidance for Researchers (Guidance) | `researcher-guidance.md` | your module's data needs research-specific interpretation notes | the guidance page covers everything |
| Extensions (Artifacts) | `extensions.md` | the module defines its own extensions | it defines none |
| Search Parameters (Artifacts) | `search-parameters.md` | the module defines its own search parameters | it defines none (cross-module ones live in the Meta module) |
| Operations (Artifacts) | `operations.md` | the module defines FHIR operations | it defines none |
| Value Sets (Artifacts) | `value-sets.md` | the module defines ValueSets | it defines none |
| Code Systems (Artifacts) | `code-systems.md` | the module defines CodeSystems | it defines none |
| Metadata Overview (Metadata) | `metadata.md` | the module's profiles carry the CRMI metadata characteristics the page documents (e.g. the Base module) | the metadata story is fully told by [Versioning](../input/pagecontent/version-history.md) |

## Executing the decision

Both procedures — **keep** (delete the `(optional)` label suffix in both menus
+ the banner and marker in both page files + the source comments) and
**remove** (the complete one-pass removal: both page files, both menu entries,
the `pages:` row, the `.po` title unit, inbound links) — are specified
step-by-step, with the per-entry notes and how to satisfy the convention check
afterwards, in
**[recipes/remove-an-optional-page.md](recipes/remove-an-optional-page.md)**.
That recipe is the single source of truth; do not work from memory or from a
copy.

## Relationship to the demo page (M8)

`rendering-artifacts.md` is **not** an optional menu entry — it is the
scaffold's demonstration page with its own release gate (M8) and removal list
(see `docs/recipes/render-existing-artifacts.md`). The mechanisms are
deliberately parallel: both are visible in development and fail a release.
