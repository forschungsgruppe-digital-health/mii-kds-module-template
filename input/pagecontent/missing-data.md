<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Ported from kerndatensatz-basis
     input/pagecontent/missing-data.md (branch main); the case split by binding
     strength follows the MII meta wiki page "Conformance", section "Fehlende Daten"
     (https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance).
     German mirror: input/translations/de/pagecontent/missing-data.md — both files
     must say the same thing.

     NOTE ON CONFORMANCE VERBS: the German wiki words the "example / preferred /
     extensible" case with SOLLTE/SOLL, while the MII's own English rendering in
     kerndatensatz-basis words it with SHALL. Each language page here keeps the
     wording of its source verbatim. Harmonising the two is an MII-wide decision,
     not a per-module one — do not "fix" it here. -->

### Handling Missing Data

There are situations in which information on a particular data element is
missing and the source system does not know the reason for its absence.

This page states how a conformant system represents such cases in the
**{{MODULE_TITLE}}** module's resources. The rules follow the
[FHIR core specification](https://hl7.org/fhir/R4/extensibility.html#Special-Case)
and are consistent with international practice as defined by the
[International Patient Summary (IPS)](https://hl7.org/fhir/uv/ips/Empty-Sections-and-Missing-Data.html).

General guidance on Must Support elements is on the
[Must Support](must-support.html) page; conformance expectations and the rules
for coded elements are on the [General Requirements](general-requirements.html)
page.

#### Elements with minimum cardinality 0

**Rule:** §missing-data-1:if the source system has no data instance for an element with a minimum cardinality of `0` — including elements flagged Must Support — the data element **SHALL** be omitted from the resource§

This applies to coded and non-coded elements alike. Simply leave the element out
of the resource instance.

#### Mandatory elements (minimum cardinality > 0)

**Rule:** §missing-data-2:if the data element is mandatory (minimum cardinality > 0) it **SHALL** be present even when the source system holds no data, or does not know the reason for the absence§

How the missing value is represented depends on whether the element is coded or
non-coded.

##### Non-coded data elements

§missing-data-3:For non-coded data elements (e.g. `string`, `HumanName`, `Address`), the [DataAbsentReason extension](http://hl7.org/fhir/R4/extension-data-absent-reason.html) **SHALL** be used on the datatype with the code `unknown`§.

**Code:** `unknown` — the value is expected to exist but is not known.

**Example:** a Patient resource whose family name is not available:

```json
{
  "resourceType": "Patient",
  "id": "example-missing-name",
  "name": [
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
          "valueCode": "unknown"
        }
      ]
    }
  ],
  "gender": "unknown",
  "birthDate": "1990-01-01"
}
```

##### Coded data elements

For coded data elements the approach depends on the binding strength of the
element.

###### Binding strength example, preferred or extensible

For elements with an `example`, `preferred` or `extensible` binding
(`CodeableConcept` or `Coding` datatypes):

1. **The source system holds text but no coded value:** only the `text` element
   is used. For `Coding` datatypes the text-only value is carried in `display`.
2. **Neither text nor coded data is available:**
   * use the appropriate "unknown" concept from the bound ValueSet if one
     exists;
   * otherwise use the code `unknown` from the
     [DataAbsentReason code system](http://hl7.org/fhir/R4/codesystem-data-absent-reason.html).

**Example:** a Condition resource whose mandatory `Condition.code` is unknown:

```json
{
  "resourceType": "Condition",
  "id": "example-unknown-code",
  "clinicalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/data-absent-reason",
        "code": "unknown",
        "display": "Unknown"
      }
    ]
  },
  "subject": {
    "reference": "Patient/example"
  }
}
```

###### Binding strength required

For elements with a `required` binding (`CodeableConcept`, `Coding` or `code`
datatypes):

1. Use the appropriate "unknown" concept from the ValueSet if one exists.
2. §missing-data-4:If the ValueSet has no such concept, a concept from the ValueSet **SHALL** nevertheless be used — otherwise the instance is **not conformant**§

> [TODO: Only add anything here if YOUR module has module-specific special cases
> — for example an element whose ValueSet carries its own "unknown" concept, or
> a data category for which the module prescribes a different representation.
> Delete this prompt afterwards.]

#### See also

* [Must Support](must-support.html) — server and client expectations for Must
  Support elements.
* [General Requirements](general-requirements.html) — using codes in profiles
  and claiming conformance.
* [FHIR R4 conformance rules](http://hl7.org/fhir/R4/conformance-rules.html#missing)
  — the core specification's guidance on missing data.
