# Conformance - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Conformance**

## Conformance

### Conformance

This section defines the conformance requirements for systems implementing the profiles of the **Module Template** module.

* **[General Requirements](general-requirements.md)** — the conformance verbs (SHALL/SHOULD/MAY per RFC-2119), claiming conformance, using codes in the profiles, and the expectations on the FHIR RESTful API.
* **[Must Support](must-support.md)** — what **Must Support** means for data-providing and data-consuming systems.
* **[Handling Missing Data](missing-data.md)** — how missing or unknown values are represented.
* **[Security and Privacy](security-and-privacy.md)** — the security and data-protection considerations of this module.

The binding rules are those of the [MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance); the pages of this section reproduce them.

For implementation guidance see the [Guidance](guidance.md) section; for the technical artifacts see the [Artifacts](artifacts.md) section.

> [TODO: Add the conformance statements that are specific to your module.Note on collecting them: conformance statements are **not** detected automatically. The IG Publisher only collects sentences that are explicitly marked — `§<page>-<n>:Servers SHALL …§` — and renders a summary table where a paragraph contains nothing but `§§§`. As long as no sentence is marked, there is no summary table. `kerndatensatz-basis` uses this mechanism; whether this template adopts it is still open, because the "Expectation" column is derived from the English keywords SHALL/SHOULD/MAY and the German translation of a page uses MUSS/SOLLTE/KANN — see the open decisions in `docs/ig-best-practices-checklist.md`. Verify with a real IG-Publisher build before shipping either way.]

