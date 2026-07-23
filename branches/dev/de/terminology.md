# Terminology - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Terminology**

## Terminology

Diese Seite beschreibt die im Modul **Module Template** verwendeten ValueSets und CodeSystems. Allgemeine Hinweise zur Verwendung von Codes: siehe [FHIR Terminology](http://hl7.org/fhir/R4/terminologies.html).

**Wichtig:** CodeSystem-Ressourcen externer Terminologien (z. B. ICD-10-GM, OPS, SNOMED CT) werden in diesem Modul **nicht** publiziert, sondern über den MII-Terminologieserver (SU-TermServ) bezogen: [https://mii-termserv.de/](https://mii-termserv.de/).

**Expansionen:** ValueSet-Expansionen MÜSSEN zur Validierung über einen FHIR-Terminologieserver erzeugt werden. Dieser Build nutzt SU-TermServ, sofern das Client-Zertifikat konfiguriert ist, sonst den öffentlichen HL7-Server `tx.fhir.org` (dann expandieren einige MII-spezifische ValueSets ggf. nicht vollständig).

> [TODO: Falls Ihr Modul SNOMED CT nutzt, geben Sie die verwendete Edition/Version an. Listen Sie die modul-eigenen ValueSets/CodeSystems auf oder verweisen Sie auf die automatisch erzeugte Artefakt-Liste.]

