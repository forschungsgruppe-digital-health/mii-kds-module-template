# Page structure — the agreed MII module menu (and who owns it)

**Ownership (Option A).** The MII module IG **page structure** — which pages
exist and the navigation menu — lives **here, in the module template**,
alongside the page content. The IG template (`ig-template-mii-kds`) is
**presentation-only** (header, footer, CSS, logo); it does not define or own
the page set.

> **Why:** this is standard FHIR practice — a template provides *presentation*,
> an IG provides *content and structure*. It is also the simplest: everything a
> module needs is in one place, there is nothing to sync against another repo,
> and a module author edits the menu and pages directly.
> *(The alternative considered was Option B — the IG template owns a canonical
> `structure/` that modules mirror + re-sync. It was set aside because the IG
> Publisher cannot inject a template menu automatically, so Option B would add
> a cross-repo sync burden for no rendered difference.)*

## The agreed structure

The menu implements the MII-agreed module menu structure (agreed in the
template discussion, 2026). **(1..1)** = mandatory in every module; **(0..1)**
= optional, decided per module — see [optional-pages.md](optional-pages.md)
for the decision checklist and the per-entry removal procedure.

| Menu entry | Card. | Target |
| --- | --- | --- |
| Home | 1..1 | `index.html` |
| **Guidance** | 1..1 | dropdown (parent → `guidance.html`) |
| — Guidance | 1..1 | `guidance.html` |
| — Guidance for Researchers | 0..1 | `researcher-guidance.html` |
| — Guidance for Implementers | 1..1 | `implementer-guidance.html` |
| — Datasets and Descriptions | 1..1 | **link-only** → `artifacts.html#2` (Logical-Models section of the Artifacts Summary) |
| — UML Diagrams | 1..1 | `uml-diagrams.html` |
| **Conformance** | 1..1 | dropdown (parent → Meta-module Conformance, external) |
| — Conformance | 1..1 | **link-only** → Meta module (interim: meta wiki `Conformance`) |
| — General Requirements | 1..1 | **link-only** → Meta module (interim: `Conformance#anforderungsdokumentation`) |
| — Must Support | 1..1 | **link-only** → Meta module (interim: `Conformance#must-support-ms`) |
| — Handling Missing Data | 1..1 | **link-only** → Meta module (interim: `Conformance#fehlende-daten`) |
| — Security and Privacy | 1..1 | `security-and-privacy.html` (three-stage static content: MII data protection concept → DIMP → module-specific aspects; stage 3's CONTENT is optional — a module without own aspects adopts the section's default text, and the scaffold's highlighted *Person* example must be removed before the first release, gated by convention check M11) |
| **Artifacts** | 1..1 | dropdown (parent → `artifacts.html`) |
| — Artifacts Summary | 1..1 | `artifacts.html` (generated) |
| — Profiles | 1..1 | `profiles.html` |
| — Extensions | 0..1 | `extensions.html` |
| — Capability Statements | 1..1 | `capability-statements.html` |
| — Search Parameters | 0..1 | `search-parameters.html` |
| — Operations | 0..1 | `operations.html` |
| — Logical Models | 1..1 | `logical-models.html` |
| — Value Sets | 0..1 | `value-sets.html` |
| — Code Systems | 0..1 | `code-systems.html` |
| — Examples | 1..1 | `examples.html` |
| — Rendering Artifacts (demo) | scaffold-only | `rendering-artifacts.html` — not part of the agreed structure; removed before release (convention check M8) |
| Downloads | 1..1 | `downloads.html` |
| Changelog | 1..1 | `changes.html` |
| **Metadata** | 1..1 | dropdown (parent → `version-history.html` — the mandatory child, so the optional overview can be removed without re-targeting) |
| — Metadata Overview | 0..1 | `metadata.html` |
| — Versioning | 1..1 | `version-history.html` |

Not in the menu but in the `pages:` tree: `translationinfo.md` (linked from the
translation banner).

## Link-only entries — the two mechanisms

**Datasets and Descriptions → `artifacts.html#2` (positional anchor).** The IG
Publisher emits *numeric* per-section anchors on the generated Artifacts
Summary (`<a name="1">`, `<a name="2">`, …), one per artifact-type section in a
fixed order. With the standard MII module artifact set the sections are
`1` = Behavior: Capability Statements, `2` = Structures: Logical Models — the
section kerndatensatz-basis renders as **Sec. 15.0.2**, which is where the
module's datasets (logical models) are listed. Two consequences:

- On the **scaffold's own preview** the anchor lands elsewhere (the scaffold
  ships no CapabilityStatement/LogicalModel artifacts yet, so the section
  numbering differs). This is accepted for the scaffold.
- In **your module**, re-check the anchor once the artifact set is real: build,
  open `artifacts.html`, and confirm `#2` is the Logical-Models section (it is,
  whenever the module ships CapabilityStatements and Logical Models — both
  mandatory menu entries). If your artifact mix differs, adjust the number in
  BOTH menu files and on `guidance.md`/its German mirror.

**The Conformance cluster → the Meta module (INTERIM meta-wiki links).** The
MII-wide conformance rules are maintained centrally in
[`kerndatensatz-meta`](https://github.com/medizininformatik-initiative/kerndatensatz-meta);
per the agreed structure, modules link them instead of restating them. The Meta
module currently has **no published IG rendering** (only a CI build without
conformance pages), so the menu links point at the authoritative wiki page
sections:

| Menu entry | Interim target |
| --- | --- |
| Conformance | `…/kerndatensatz-meta/wiki/Conformance` |
| General Requirements | `…/wiki/Conformance#anforderungsdokumentation` |
| Must Support | `…/wiki/Conformance#must-support-ms` |
| Handling Missing Data | `…/wiki/Conformance#fehlende-daten` |

> **Gate item:** when the Meta module publishes a stable IG rendering with its
> own Conformance / General Requirements / Must Support / Handling Missing Data
> menu entries, switch the four links (both menu files, plus the Conformance
> mentions on `index.md` and `guidance.md`, both languages) to those pages. Do
> not invent the URLs before they exist.

## Retired pages (explicit retirement, no redirects)

The agreed structure replaced the earlier combined pages. The old pages are
**retired**, not redirected: GitHub Pages previews carry no server-side
redirects, the scaffold's rendered output is a preview (not a published
canonical), and stub pages would re-enter the menu QA, the `pages:` tree and
the `.po` catalogue that the split exists to clean up. Modules that already
**formally published** the old URLs keep those URLs alive through their own
publication history (the publisher's versioned archive); new publications use
the new page set.

| Old page (≤ template v0.6.x) | Where it went |
| --- | --- |
| `profiles-and-extensions.md` | split → `profiles.md` + `extensions.md` |
| `search-parameters-and-operations.md` | split → `search-parameters.md` + `operations.md` |
| `terminology.md` | split → `value-sets.md` + `code-systems.md` (SU-TermServ note → Code Systems, expansion note → Value Sets) |
| `datasets-and-descriptions.md` | page removed → menu **link** to `artifacts.html#2` (describe the data elements in the Logical Models' own narrative/intros) |
| `conformance.md` | page removed → menu **link** to the Meta module |
| `general-requirements.md` | page removed → menu **link** to the Meta module |
| `must-support.md` | page removed → menu **link** to the Meta module |
| `missing-data.md` | page removed → menu **link** to the Meta module |
| — | `changes.md` moved from under Versioning to a **top-level** Changelog entry; `metadata.md` + `version-history.md` now form the **Metadata** dropdown |

**Where module-specific conformance statements go now:** the retired pages
carried the `§<id>:…§` conformance-statement markers and the `§§§` summary
table (an IG-Publisher feature, see
[HL7 ig-guidance](https://build.fhir.org/ig/FHIR/ig-guidance/conformance-statements.html)).
The scaffold no longer ships marked statements — the MII-wide rules they marked
live in the Meta module now. A module that states its *own* normative
requirements (typically on `security-and-privacy.md` or an artifact page) may
still mark them with `§<page>-<n>:…§` on the **English** page and render a
table with a `§§§` paragraph; the Expectation column derives from the English
SHALL/SHOULD/MAY keywords (see `docs/open-tasks.md`, "Verified by
observation").

## What this means in practice

- The `pages:` block in `sushi-config.yaml` and the menu files are owned and
  edited by the module — but the **mandatory (1..1) entries are the agreed
  MII structure**: keep them; decide the (0..1) entries per
  [optional-pages.md](optional-pages.md).
- The **menu** is maintained as `input/includes/menu.xml` (English, the default
  language) plus a German translation at
  `input/translations/de/includes/menu.xml` — not via the `menu:` property,
  which cannot be translated. Update both files, the `pages:` tree and the
  IG-level `.po` catalogue together (same commit).
- The IG template carries no `structure/` folder and no page set; there is no
  structure-sync step.
