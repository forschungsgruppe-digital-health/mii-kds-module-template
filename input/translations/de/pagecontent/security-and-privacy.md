<!-- markdownlint-disable MD041 -->
<!-- Sicherheit & Datenschutz. Diese Seite ist von den HL7-Best-Practices für
     Implementation Guides ausdrücklich gefordert ("Security and Privacy
     Considerations"). Sie richtet sich an Sicherheits- und
     Datenschutz-Fachleute. Ersetzen Sie die [TODO]-Hinweise durch die Aussagen
     Ihres Moduls; entfernen Sie die Seite NICHT. -->

### Sicherheit und Datenschutz

Dieser Abschnitt richtet sich an Sicherheits- und Datenschutz-Fachleute. Er
beschreibt, welche Angriffe und Risiken für das Modul **{{MODULE_TITLE}}**
betrachtet wurden und welche Gegenmaßnahmen vorgesehen sind.

Grundlagen und allgemeine Anforderungen stehen in der FHIR-Kernspezifikation:
[Security & Privacy Module](https://build.fhir.org/secpriv-module.html) und die
[Security-Checkliste](https://build.fhir.org/security.html). Dieser Abschnitt
wiederholt sie nicht, sondern nennt nur die **modul-spezifischen** Aspekte.

#### Datenschutzgrundsätze

Für die Verarbeitung personenbezogener Daten gelten Transparenz, Zweckbindung,
Datenminimierung, Richtigkeit, Speicherbegrenzung und Integrität/Vertraulichkeit
(DSGVO Art. 5). Im MII-Kontext erfolgt die Nutzung auf Basis der
MII-Broad-Consent-Regelungen.

> [TODO: Beschreiben Sie, welche Datenkategorien Ihr Modul führt und welche
> Zweckbindung bzw. Rechtsgrundlage im MII-Kontext gilt.]

#### Sicherheitsbetrachtung

Sicherheit ist Risikomanagement bezüglich Vertraulichkeit, Integrität und
Verfügbarkeit.

> [TODO: Nennen Sie die betrachteten Angriffe/Risiken und die Gegenmaßnahmen —
> z. B. Zugriffsschutz der FHIR-API, Pseudonymisierung, Transportverschlüsselung,
> Protokollierung.]

#### Modul-spezifische Konformitätsanforderungen

> [TODO: Falls Ihr Modul sicherheits- oder datenschutzbezogene
> SHALL/SHOULD/MAY-Anforderungen definiert, führen Sie sie hier auf und benennen
> Sie, welchem Risiko sie begegnen.]

#### Verbleibende Risiken

> [TODO: Nennen Sie Risiken, die NICHT durch diese Spezifikation adressiert
> werden und daher im Systemdesign, im Betrieb oder per Policy behandelt werden
> müssen.]
