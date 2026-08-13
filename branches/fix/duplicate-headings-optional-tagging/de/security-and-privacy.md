# Sicherheit und Datenschutz - MII Implementation Guide Module Template v2027.0.0-draft.1

* [**Inhaltsverzeichnis**](toc.md)
* **Sicherheit und Datenschutz**

## Sicherheit und Datenschutz

Dieser Abschnitt richtet sich an Sicherheits- und Datenschutz-Fachleute. Allgemeine Anforderungen stehen in der FHIR-Kernspezifikation — [Security & Privacy Module](https://build.fhir.org/secpriv-module.html) und die [Security-Checkliste](https://build.fhir.org/security.html). Diese Seite wiederholt sie nicht; sie verlinkt den MII-weiten Datenschutzrahmen und nennt, was **für dieses Modul spezifisch** ist.

### 1. Das Datenschutzkonzept der MII

Das [übergreifende Datenschutzkonzept der Medizininformatik-Initiative](https://www.medizininformatik-initiative.de/de/datenschutzkonzept) regelt, wie Patientendaten MII-weit für die Forschung verarbeitet werden dürfen: die Rechtsgrundlage (der Broad Consent der MII), die Rollen der Datenintegrationszentren und der Use-&-Access-Committees sowie die standortübergreifenden Anwendungsszenarien (Machbarkeitsanfragen, verteilte Analysen, Daten- und Bioproben-Bereitstellung). Alles, was dieses Modul spezifiziert, bewegt sich innerhalb dieses Rahmens — dieser Leitfaden fügt keinen eigenen Verarbeitungszweck hinzu.

### 2. De-Identifikation, Minimierung und Pseudonymisierung (DIMP)

Wie Daten, die ein Datenintegrationszentrum verlassen, praktisch de-identifiziert werden, spezifiziert [DIMP (De-Identification — Minimisation — Pseudonymisation)](https://medizininformatik-initiative.github.io/dataportal/data-node/DIMP.html) in der Dokumentation des MII-Datenportals: direkte Identifikatoren werden entfernt, vom genehmigten Projekt nicht benötigte Datenelemente entfallen, und identifizierende Werte werden durch projektspezifische Pseudonyme ersetzt (FHIR-Pseudonymizer-Konfiguration). Die Profile dieses Moduls beschreiben die Daten **vor** Anwendung von DIMP; welche Elemente eine konkrete Datenbereitstellung erreicht, entscheidet je Projekt die DIMP-Konfiguration, nicht dieser Leitfaden.

### 3. Modul-spezifische Aspekte

Dies ist der eigene Beitrag des Moduls: die Sicherheits- und Datenschutz-Eigenschaften, die aus der **Art der Daten dieses Moduls** folgen. Beispiele aus anderen KDS-Modulen, was hierher gehört:

* Modul **Dokument** — Dokumente werden Base64-kodiert eingebettet (`DocumentReference.content.attachment.data`); ein eingebettetes Dokument kann beliebige identifizierende Angaben enthalten (Briefköpfe, Freitext, eingescannte Unterschriften), die eine Pseudonymisierung auf Profilebene nicht erreicht — Dokumentinhalte brauchen daher vor der Bereitstellung einen eigenen De-Identifikationsschritt.
* Modul **Person** — die Patienten-Identifikatoren sind Pseudonyme der Treuhandstelle; Systeme dürfen ein Record Linkage nicht zur Re-Identifizierung führen lassen, und der Geltungsbereich eines Pseudonyms (standortweit vs. projektspezifisch) ist beim Zusammenführen von Daten zu respektieren.

> [TODO: Nennen Sie die spezifischen Aspekte Ihres Moduls — die geführten Datenkategorien und ihre Sensibilität, Risiken, die eine Pseudonymisierung auf Profilebene nicht abdeckt, sowie sicherheits- oder datenschutzbezogene SHALL/SHOULD/MAY-Anforderungen dieses Moduls an Implementierende, jeweils mit dem adressierten Risiko. Benennen Sie verbleibende Risiken, die im Systemdesign, im Betrieb oder per Policy behandelt werden müssen.]

