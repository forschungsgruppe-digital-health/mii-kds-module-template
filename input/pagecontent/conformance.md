<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Overview of the Conformance section; the
     sub-page set is the MII standard set (source: MII meta wiki page
     "Conformance",
     https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance;
     structure as in kerndatensatz-basis input/pagecontent/conformance.md).
     German mirror: input/translations/de/pagecontent/conformance.md — both files
     must say the same thing, and both must list the same sub-pages as the two
     menu files. -->

### Conformance

This section defines the conformance requirements for systems implementing the
profiles of the **{{MODULE_TITLE}}** module.

* **[General Requirements](general-requirements.html)** — the conformance verbs
  (SHALL/SHOULD/MAY per RFC-2119), claiming conformance, using codes in the
  profiles, and the expectations on the FHIR RESTful API.
* **[Must Support](must-support.html)** — what *Must Support* means for
  data-providing and data-consuming systems.
* **[Handling Missing Data](missing-data.html)** — how missing or unknown values
  are represented.
* **[Security and Privacy](security-and-privacy.html)** — the security and
  data-protection considerations of this module.

The binding rules are those of the
[MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance);
the pages of this section reproduce them.

For implementation guidance see the [Guidance](guidance.html) section; for the
technical artifacts see the [Artifacts](artifacts.html) section.

> [TODO: Add the conformance statements that are specific to your module.
>
> Note on collecting them: conformance statements are **not** detected
> automatically. The IG Publisher only collects sentences that are explicitly
> marked — `§<page>-<n>:Servers SHALL …§` — and renders a summary table where a
> paragraph contains nothing but `§§§`. As long as no sentence is marked, there
> is no summary table. `kerndatensatz-basis` uses this mechanism; whether this
> template adopts it is still open, because the "Expectation" column is derived
> from the English keywords SHALL/SHOULD/MAY and the German translation of a
> page uses MUSS/SOLLTE/KANN — see the open decisions in
> `docs/ig-best-practices-checklist.md`. Verify with a real IG-Publisher build
> before shipping either way.]

---

### List of Conformance Statements

The table below lists every conformance statement (a sentence marked with
`§id:…§` in the narrative pages) together with its expectation and a link back
to where it is stated.

§§§
