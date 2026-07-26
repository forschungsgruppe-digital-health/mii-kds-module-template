# Beispiel: Max Mustermann-Testpatient - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Artefaktübersicht**](artifacts.md)
* **Beispiel: Max Mustermann-Testpatient**

## Beispiel Patient: Beispiel: Max Mustermann-Testpatient

-------

**German**

-------

Profile: [Beispiel-Patient (Vorlage)](StructureDefinition-example-patient.md)

Max Mustermann-Testpatient Male, DoB: 1990-01-01

-------



## Resource Content

```json
{
  "resourceType" : "Patient",
  "id" : "ExamplePatientInstance",
  "meta" : {
    "profile" : ["https://www.medizininformatik-initiative.de/fhir/modul-template/StructureDefinition/example-patient"]
  },
  "name" : [{
    "family" : "Mustermann-Testpatient",
    "given" : ["Max"]
  }],
  "gender" : "male",
  "birthDate" : "1990-01-01"
}

```
