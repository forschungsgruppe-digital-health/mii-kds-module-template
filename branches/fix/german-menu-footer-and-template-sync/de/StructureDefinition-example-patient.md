# Beispiel-Patient (Vorlage) - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Artefaktübersicht**](artifacts.md)
* **Beispiel-Patient (Vorlage)**

## Ressourcenprofil: Beispiel-Patient (Vorlage) 

| | |
| :--- | :--- |
| *Offizielle URL*:https://www.medizininformatik-initiative.de/fhir/modul-template/StructureDefinition/example-patient | *Version*:2026.0.0 |
| Active Stand: 2026-07-25 | *Maschinenlesbarer Name*:ExamplePatient |

 
Minimales Beispielprofil, das nur mit der Vorlage ausgeliefert wird, damit ein neu erstelltes Modul sofort eine gerenderte IG erzeugt. Kein MII-Artefakt — ersetzen Sie es durch die Profile Ihres Moduls. 

**Usages:**

* Examples for this Profile: [Patient/ExamplePatientInstance](Patient-ExamplePatientInstance.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.kerndatensatz.template|current/StructureDefinition/StructureDefinition-example-patient.json)

### Formale Ansichten des Profilinhalts

 [Beschreibung von Profilen, Differentials, Snapshots und deren Repräsentationen](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

*  [Schlüsselelemente-Tabelle](#tabs-key) 
*  [Differential-Tabelle](#tabs-diff) 
*  [Snapshot-Tabelle](#tabs-snap) 
*  [Statistiken/Referenzen](#tabs-summ) 
*  [Alle](#tabs-all) 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

** Summary **

Mandatory: 2 elements
 Must-Support: 4 elements

 **Schlüsselelemente-Ansicht** 

#### Terminology Bindings

#### Constraints

 **Differential-Ansicht** 

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

 **Snapshot-AnsichtView** 

#### Terminology Bindings

#### Constraints

Diese Struktur ist abgeleitet von [Patient](http://hl7.org/fhir/R4/patient.html) 

** Summary **

Mandatory: 2 elements
 Must-Support: 4 elements

 

Weitere Repräsentationen des Profils: [CSV](../StructureDefinition-example-patient.csv), [Excel](../StructureDefinition-example-patient.xlsx), [Schematron](../StructureDefinition-example-patient.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "example-patient",
  "url" : "https://www.medizininformatik-initiative.de/fhir/modul-template/StructureDefinition/example-patient",
  "version" : "2026.0.0",
  "name" : "ExamplePatient",
  "title" : "Beispiel-Patient (Vorlage)",
  "status" : "active",
  "date" : "2026-07-25T22:12:33+00:00",
  "publisher" : "Medical Informatics Initiative (MII)",
  "contact" : [{
    "name" : "Medical Informatics Initiative (MII)",
    "telecom" : [{
      "system" : "url",
      "value" : "https://www.medizininformatik-initiative.de/en"
    }]
  }],
  "description" : "Minimales Beispielprofil, das nur mit der Vorlage ausgeliefert wird, damit ein neu erstelltes Modul sofort eine gerenderte IG erzeugt. Kein MII-Artefakt — ersetzen Sie es durch die Profile Ihres Moduls.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "urn:iso:std:iso:3166",
      "code" : "DE",
      "display" : "Germany"
    }]
  }],
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "w5",
    "uri" : "http://hl7.org/fhir/fivews",
    "name" : "FiveWs Pattern Mapping"
  },
  {
    "identity" : "v2",
    "uri" : "http://hl7.org/v2",
    "name" : "HL7 v2 Mapping"
  },
  {
    "identity" : "loinc",
    "uri" : "http://loinc.org",
    "name" : "LOINC code for the element"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Patient",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Patient|4.0.1",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "Patient",
      "path" : "Patient"
    },
    {
      "id" : "Patient.name",
      "path" : "Patient.name",
      "min" : 1,
      "mustSupport" : true
    },
    {
      "id" : "Patient.name.family",
      "path" : "Patient.name.family",
      "min" : 1,
      "mustSupport" : true
    },
    {
      "id" : "Patient.gender",
      "path" : "Patient.gender",
      "mustSupport" : true
    },
    {
      "id" : "Patient.birthDate",
      "path" : "Patient.birthDate",
      "mustSupport" : true
    }]
  }
}

```
