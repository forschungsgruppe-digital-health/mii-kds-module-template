<!-- markdownlint-disable MD041 -->
<!-- Terminologie-Seite. Der IG-Publisher listet ValueSets/CodeSystems auf den
     Artefakt-Seiten automatisch; hier stehen die MII-Hinweise dazu. -->

Diese Seite beschreibt die im Modul **{{MODULE_TITLE}}** verwendeten ValueSets
und CodeSystems. Allgemeine Hinweise zur Verwendung von Codes: siehe
[FHIR Terminology](http://hl7.org/fhir/R4/terminologies.html).

{:.bg-info}
**Wichtig:** CodeSystem-Ressourcen externer Terminologien (z. B. ICD-10-GM, OPS,
SNOMED CT) werden in diesem Modul **nicht** publiziert, sondern über den
MII-Terminologieserver (SU-TermServ) bezogen:
[https://mii-termserv.de/](https://mii-termserv.de/).

{:.bg-info}
**Expansionen:** ValueSet-Expansionen dieses Leitfadens werden über einen
FHIR-Terminologieserver erzeugt — über SU-TermServ, sofern das
Client-Zertifikat konfiguriert ist, sonst über den öffentlichen HL7-Server
`tx.fhir.org` (dann expandieren einige MII-spezifische ValueSets ggf. nicht
vollständig).

> [TODO: Falls Ihr Modul SNOMED CT nutzt, geben Sie die verwendete Edition/Version
> an. Listen Sie die modul-eigenen ValueSets/CodeSystems auf oder verweisen Sie
> auf die automatisch erzeugte Artefakt-Liste. Soll Ihr Modul Implementierenden
> eine verbindliche Anforderung an Expansionen auferlegen, gehört sie auf die
> Konformitätsseiten — diese Seite gehört nicht zum Konformitäts-Abschnitt.]
{: .mii-highlight .mii-highlight-grey}
