<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Overview of the Conformance section. The
     FIRST THREE sub-pages carry the conformance topics of the MII meta wiki page
     "Conformance",
     https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance;
     structure as in kerndatensatz-basis input/pagecontent/conformance.md.
     "Security and Privacy" is an addition of this template per HL7 IG best
     practice — see docs/ig-best-practices-checklist.md.
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

The MII meta wiki page
[Conformance](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance)
is authoritative for the MII-wide conformance rules. General Requirements, Must
Support and Handling Missing Data restate them for this module; where the two
differ, the wiki wins. Security and Privacy is an additional page of this guide,
following HL7's IG best-practice guidance.

For implementation guidance see the [Guidance](guidance.html) section; for the
technical artifacts see the [Artifacts](artifacts.html) section.

> [TODO: Add the conformance statements that are specific to your module.
>
> How the list below is produced: conformance statements are **not** detected
> automatically. Every normative sentence on the English pages is wrapped in an
> explicit marker — an id, a colon and the statement text, delimited by section
> signs — and the table at the end of this page is generated from those markers.
> `input/pagecontent/general-requirements.md` shows the syntax in place: copy a
> marked sentence from there and give yours the next free id on its page. The
> German mirror deliberately carries no markers; the list is produced from the
> English pages only.
>
> Keep the set **curated** — mark real obligations, not every sentence that
> happens to contain a bold verb — and keep each marked sentence
> self-contained: the table shows it out of context.]

---

### List of Conformance Statements

The table below lists every marked conformance statement of this guide together
with its expectation and a link back to where it is stated.

§§§
