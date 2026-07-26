<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Ported from kerndatensatz-basis
     input/pagecontent/must-support.md (branch main); the definition and the
     server/client expectations follow the MII meta wiki page "Conformance",
     section "Must Support (MS)"
     (https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance).
     German mirror: input/translations/de/pagecontent/must-support.md — both
     files must say the same thing.
     The expectations below are MII-wide and identical for every module. Change
     them ONLY if your module deviates for a documented reason. -->

### Must Support

For querying and reading this module's profiles, *Must Support* on any profile
data element **SHALL** be interpreted as described on this page.

#### Definition

Elements of a FHIR resource can be marked in a profile as **mandatory** or as
[**Must Support**](http://hl7.org/fhir/R4/profiling.html#mustsupport).

* **Mandatory elements** are elements with a minimum cardinality of `1`
  (e.g. `1..1`, `1..*`). They **SHALL** always be present. In exceptional cases
  the value may be missing — the absence **SHALL** then be documented, for
  example with the `Data-Absent-Reason` extension (see
  [Handling Missing Data](missing-data.html)).
* §must-support-1:**Must Support (MS)** means that systems **SHALL** support the element even
  where its cardinality is `0..*`. *Support* means: systems **SHALL** be capable
  of populating, storing, displaying and correctly processing the element.

Must Support is therefore **not** the same as cardinality: an element can be
`0..1` and still be Must Support — the data may be absent, the ability to handle
it may not.

A distinction is made between data-providing systems (senders/servers) and
data-consuming systems (recipients/clients). In the MII infrastructure the FHIR
API of a Data Integration Centre (DIZ) is the data-providing system that answers
requests.

#### Expectations for data-providing systems

*(for example the FHIR API of a Data Integration Centre)*

§must-support-2:A conformant data-providing system **SHALL** be capable of populating a Must Support element with locally available data, storing it in the resource, and making it retrievable on request§

A conformant data-providing system **SHALL** be capable of:

* populating a Must Support element with data where that data is locally
  available (e.g. via ETL from the primary systems),
* storing the element in the resource,
* making it retrievable on request (e.g. for a feasibility query).

#### Expectations for data-consuming systems

*(for example requesting applications)*

A conformant data-consuming system **SHALL** be capable of:

* displaying Must Support elements correctly to the user,
* taking their values into account for calculations or further processing,
* processing resource instances containing Must Support elements without errors
  or aborts.

#### Must Support and missing data

* §must-support-3:Where no information is present for a data element and the reason for its absence is unknown, servers **SHALL NOT** include the element in the returned resource instance§
* §must-support-4:Clients **SHALL** interpret a missing data element in a resource instance as "not present in the server's system"§
* Where information is missing and the server knows the precise reason, it
  **SHOULD** convey that reason as described in
  [Handling Missing Data](missing-data.html).

#### How Must Support is shown in the rendered tables

Each profile page shows several formal views of the profile content as a tree,
under the tabs *Differential Table*, *Key Elements Table* and *Snapshot Table*.

In these views:

* elements whose cardinality in the column "Card." starts with `1` (e.g. `1..1`)
  are **mandatory**;
* elements flagged Must Support carry a red
  <span style="padding-left: 3px; padding-right: 3px; color: white; background-color: red" title="This element must be supported">S</span>
  marker.

The following sub-sections state what the flag means for the different kinds of
element.

#### Must Support — primitive elements

Primitive elements are single elements carrying a primitive value. For a Must
Support primitive element the server **SHALL** be capable of providing the
element value, and the client **SHALL** be capable of processing it.

For example, if `Patient.birthDate` is flagged Must Support:

* servers **SHALL** be capable of providing a value in `Patient.birthDate`,
* clients **SHALL** be capable of processing the value in `Patient.birthDate`.

#### Must Support — complex elements

Complex elements are composed of primitive and further complex elements. For a
complex element flagged Must Support the server **SHALL** be capable of
providing those sub-element values that are themselves flagged Must Support; if
no sub-element is flagged, the server **SHALL** be capable of providing at least
one sub-element value. The client **SHALL** be capable of processing the Must
Support sub-element values. Where sub-elements of a complex element are flagged
Must Support, supporting those sub-elements fulfils the expectation on the
parent element.

For example, if `Patient.name` is flagged Must Support and its sub-elements
`family` and `given` are as well:

* servers **SHALL** be capable of providing values in `Patient.name.family` and
  `Patient.name.given`,
* clients **SHALL** be capable of processing those values.

Conversely, if a sub-element is flagged Must Support but its parent is not,
there is *no* expectation to support the parent as such. Where the parent
element is present in the structure without being flagged, servers **SHALL**
nevertheless support the flagged sub-element(s).

#### Must Support — references

Where a Must Support reference element has a single target profile, that target
profile **SHALL** be supported.

For example, if `Condition.subject` references this module's Patient profile and
is flagged Must Support:

* servers **SHALL** be capable of providing a `Condition.subject` with a valid
  reference to that profile,
* clients **SHALL** be capable of processing such a reference.

Where a Must Support reference element has several target profiles and none of
them is flagged Must Support, *at least one* target profile **SHALL** be
supported.

#### Must Support — choice of data types

For Must Support choice elements (`value[x]` and similar) the server **SHALL**
support the datatypes flagged Must Support, and the client **SHALL** be capable
of processing all datatypes flagged Must Support.

For example, if `Observation.value[x]` has several Must Support datatypes:

* servers **SHALL** be capable of populating the flagged datatypes (e.g.
  `valueQuantity`, `valueCodeableConcept`, `valueString`),
* clients **SHALL** be capable of processing all flagged datatypes,
* systems **MAY** support further choices, but are not required to.

#### Must Support — slices

FHIR profiles use [slicing](http://hl7.org/fhir/R4/profiling.html#slicing) to
constrain repeating elements. The element carrying the slicing discriminator
(the "slicer") may be flagged Must Support, but each slice **SHALL** be flagged
explicitly for the Must Support expectation to apply to it. For Must Support
slices the server **SHALL** be capable of providing data conforming to the
explicitly flagged slices, and the client **SHALL** be capable of processing
such data.

For example, if `identifier` is a Must Support slicer defining slices for
several identifier types, only the explicitly flagged slices are required:

* servers **SHALL** be capable of providing identifiers conforming to the Must
  Support slices,
* clients **SHALL** be capable of processing them,
* systems **MAY** support further slices, but are not required to.

> [TODO: Only add anything here if YOUR module defines additional or deviating
> Must Support rules — and state the reason for the deviation. Delete this
> prompt afterwards.]

#### See also

* [General Requirements](general-requirements.html) — requirements common to all
  actors and profiles.
* [Handling Missing Data](missing-data.html) — representing absent values.
* [Conformance](conformance.html) — overview of the conformance requirements.
