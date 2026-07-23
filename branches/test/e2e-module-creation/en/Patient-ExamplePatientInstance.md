# Beispiel: Max Mustermann-Testpatient - MII Implementation Guide Demo Module v2026.0.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Beispiel: Max Mustermann-Testpatient**

## Example Patient: Beispiel: Max Mustermann-Testpatient

-------

**English**

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
    "profile" : ["https://www.medizininformatik-initiative.de/fhir/modul-demo/StructureDefinition/example-patient"]
  },
  "name" : [{
    "family" : "Mustermann-Testpatient",
    "given" : ["Max"]
  }],
  "gender" : "male",
  "birthDate" : "1990-01-01"
}

```
