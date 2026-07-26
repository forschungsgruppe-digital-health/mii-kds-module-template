<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Ported from kerndatensatz-basis
     input/pagecontent/general-requirements.md (branch main) and the MII meta wiki
     page "Conformance" (https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance),
     from which the conformance-verb table is taken verbatim.
     German mirror: input/translations/de/pagecontent/general-requirements.md —
     both files must say the same thing.
     The verb table and the MII-wide rules below apply UNCHANGED to every module.
     Do not shorten or reword them; add your module's own requirements underneath. -->

### General Requirements

This page documents the requirements that apply to the whole
**{{MODULE_TITLE}}** module and to every MII actor implementing it.

#### Documenting requirements

Requirements in this specification are indicated by the following keywords
written in capital letters, based on
[RFC-2119](https://datatracker.ietf.org/doc/html/rfc2119) and the FHIR
[conformance language](http://hl7.org/fhir/R4/conformance-rules.html#conflang):

| German | English |
|---|---|
| MUSS / MÜSSEN | MUST / SHALL |
| DARF NICHT / DÜRFEN NICHT | MUST NOT / SHALL NOT |
| VERPFLICHTEND | REQUIRED |
| SOLLTE / SOLLTEN | SHOULD |
| SOLLTE NICHT / SOLLTEN NICHT | SHOULD NOT |
| EMPFOHLEN | RECOMMENDED |
| KANN / OPTIONAL | MAY |

The German column is the wording used in the German rendering of this guide; the
English column is the RFC-2119 keyword it corresponds to. The two are equivalent
— a requirement does not change its strength by being read in the other
language.

#### MII conformance artifacts

* The [Profiles and Extensions](profiles-and-extensions.html) page lists the
  profiles defined by this module. Their
  [StructureDefinitions](http://hl7.org/fhir/R4/structuredefinition.html) define
  the *minimum* elements, extensions, vocabularies and ValueSets that **SHALL**
  be present, and constrain how the elements are used.
* Profile elements carry *mandatory* and *Must Support* requirements. Mandatory
  elements have a minimum cardinality of 1 (min=1). The
  [Must Support](must-support.html) page defines what servers and clients are
  expected to do with them and how the flags are rendered.
* The [Capability Statements](capability-statements.html) page states the
  RESTful transactions, supported profiles and search parameters expected of a
  conformant server. Profiles carry the structural constraints, terminology
  bindings and invariants; the CapabilityStatements carry the interaction
  expectations. Implementers need both.

#### Standards and alignment

The MII core dataset specifications build, wherever possible, on international
standards and terminologies. The following are of particular relevance across
modules:

* **[International Patient Summary (IPS)](http://hl7.org/fhir/uv/ips/)** —
  international standard for patient summaries.
* **[German base profiles (Basisprofil DE R4)](https://ig.fhir.de/basisprofile-de/)**
  — adaptation to the conditions of the German healthcare system.
* **[KBV FHIR specifications](https://simplifier.net/organization/kassenrztlichebundesvereinigungkbv)**
  — compatibility with the specifications of the National Association of
  Statutory Health Insurance Physicians.
* **[gematik FHIR specifications](https://simplifier.net/organization/gematik)**
  — compatibility with the gematik specifications.
* **[ISiK (Informationssysteme im Krankenhaus)](https://fachportal.gematik.de/informationen-fuer/isik)**
  — reference specification for hospital information systems.

Where this module adapts a profile away from one of these specifications, the
reason is given in prose on the profile page.

> [TODO: Name the standards and specifications YOUR module actually aligns with
> (they should match the `dependencies` in `sushi-config.yaml`), and delete the
> entries above that do not apply.]

#### Claiming conformance

A system claims conformance to this module by fulfilling the module's profiles.
Two levels are distinguished.

##### Profile support

Systems may deploy and support one or more of this module's profiles to
represent clinical information, using the profile's content model without
implementing the associated interactions.

* Servers **SHALL** be able to populate all profile data elements that are
  mandatory or flagged as *Must Support* in that profile's StructureDefinition.
* Servers **SHOULD** declare support for a profile by including its official
  URL in `CapabilityStatement.rest.resource.supportedProfile`. The official
  ("canonical") URL of each profile is shown on its profile page.

##### Profile support and interaction support

Systems may support one or more profiles *and* the RESTful interactions defined
for the corresponding resources.

* A conformant server **SHALL** be able to populate all profile data elements
  that are mandatory and/or flagged as *Must Support*.
* A conformant server **SHOULD** declare conformance with the applicable
  CapabilityStatement by including its official URL in
  `CapabilityStatement.instantiates`.
* A conformant server **SHALL** state the full capability details of the
  CapabilityStatement it claims to implement.
* A conformant server claiming interaction support **SHALL** declare support for
  the profile by including its official URL in
  `CapabilityStatement.rest.resource.supportedProfile`.
* A conformant server claiming interaction support **SHALL** declare support for
  that profile's FHIR RESTful transactions.

#### Using codes in profiles

The rules below summarise the requirements that
[FHIR terminology](http://hl7.org/fhir/R4/terminologies.html) places on coded
elements (`CodeableConcept`, `Coding` and `code` datatypes).

##### Required bindings

A [required binding](http://hl7.org/fhir/R4/terminologies.html#required) to a
ValueSet means that one of the codes from that ValueSet **SHALL** be used. For
`CodeableConcept`, which permits several codings plus a text element, the rule
applies to *at least one* of the codings — text alone is *not* valid.

* Servers **SHALL** provide at least one code from the bound ValueSet;
  additional codes from other systems **MAY** be provided.
* Clients **SHALL** be capable of processing the codes of the bound ValueSet.

##### Extensible bindings

An [extensible binding](http://hl7.org/fhir/R4/terminologies.html#extensible)
means that one of the codes from the ValueSet **SHALL** be used if a suitable
concept exists there. If none exists, alternative code(s) may be provided. For
`CodeableConcept` the rule again applies to *at least one* of the codings; if
only text is available and it has no conceptual overlap with the bound values,
text alone may be used.

* Servers **SHALL** provide a code from the bound ValueSet *if the concept
  exists* there, an alternative code *if it does not*, or text if only text is
  available.
* Clients **SHALL** be capable of processing codes of the bound ValueSet,
  alternative codes, and text.

##### Several codings in one CodeableConcept

Alternative codes may be supplied in addition to the codes of a required or
extensible ValueSet ("additional codings"). They may be equivalent to, or
narrower than, the standard concept.

The following illustrates a diagnosis carrying both an ICD-10-GM code and a
SNOMED CT code for international interoperability:

```json
"code": {
  "coding": [
    {
      "system": "http://fhir.de/CodeSystem/bfarm/icd-10-gm",
      "code": "E11.90",
      "display": "Diabetes mellitus, Typ 2, ohne Komplikationen"
    },
    {
      "system": "http://snomed.info/sct",
      "code": "44054006",
      "display": "Diabetes mellitus type 2"
    }
  ]
}
```

#### Missing data

There are situations in which no information is available for a data element and
the source system does not know why. The
[Handling Missing Data](missing-data.html) page defines how this is represented.

#### FHIR RESTful search API

For all search interactions supported by this guide:

* Servers **SHALL** support `POST`-based search.
* Servers **SHALL** support `GET`-based search.

For the individual search parameter types:

* **Token** — [how to search by token](http://hl7.org/fhir/R4/search.html#token)
  * Clients **SHALL** supply at least a code value and **MAY** supply system and
    code.
  * Servers **SHALL** support both code-only and system+code searches.
* **Reference** — [how to search by reference](http://hl7.org/fhir/R4/search.html#reference)
  * Clients **SHALL** supply at least an id value and **MAY** supply type and
    id.
  * Servers **SHALL** support both id-only and type+id searches.
* **Date** — [how to search by date](http://hl7.org/fhir/R4/search.html#date)
  * Clients **SHALL** supply values precise to the *day* for elements of type
    `date`, and to the *second including time offset* for elements of type
    `dateTime`.
  * Servers **SHALL** support values of that precision.

#### Modifier elements

A [modifier element](http://hl7.org/fhir/R4/conformance-rules.html#isModifier)
changes the meaning of the element that contains it. Not every modifier element
is mandatory or *Must Support*, and there is no blanket requirement to support
them. For modifier elements that *are* mandatory or *Must Support*, servers and
clients **SHALL** be able to process them.

Clients must be aware of *unexpected* modifier elements in received data: they
can change the meaning of the data and, if mishandled, lead to errors or even
security problems. Unless a client can establish that it processes such an
element safely, rejecting the instance is usually the only safe response.

Modifier elements that are frequently *not* flagged Must Support include:

* the `modifierExtension` element present on every profile,
* `Observation.valueQuantity.comparator`,
* `Patient.active`.

Implementers **SHOULD** read the profile pages carefully to see which elements
are modifiers and how they affect the interpretation of a resource.

> [TODO: Add the general requirements that are specific to YOUR module — for
> example additional expectations on the FHIR RESTful API, on search parameters,
> or on the use of codes in your profiles. Delete this prompt afterwards.]

#### See also

* [Must Support](must-support.html) — detailed Must Support expectations.
* [Handling Missing Data](missing-data.html) — representing absent values.
* [Capability Statements](capability-statements.html) — server and client
  capability requirements.
* [Security and Privacy](security-and-privacy.html) — module-specific security
  and data-protection considerations.
