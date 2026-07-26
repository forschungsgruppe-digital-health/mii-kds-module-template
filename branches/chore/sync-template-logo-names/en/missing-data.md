# Handling Missing Data - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Conformance**](conformance.md)
* **Handling Missing Data**

## Handling Missing Data

 There is no translation page available for the current page, so it has been rendered in the default language 

### Umgang mit fehlenden Daten

Es gibt Situationen, in denen Informationen zu einem Datenelement fehlen und das Quellsystem den Grund für das Fehlen nicht kennt. Es gelten die folgenden Regeln.

#### Grundregeln

* Liegt dem Quellsystem **keine Dateninstanz** für ein Element mit Mindestkardinalität `0` vor (einschließlich der mit **Must Support** gekennzeichneten Elemente), MUSS das Datenelement in der Ressource **ausgelassen** werden.
* Handelt es sich um ein **obligatorisches Element** (Mindestkardinalität `1..`), MUSS es **vorhanden sein**, auch wenn das Quellsystem keine Daten hat. Wie der fehlende Wert dargestellt wird, hängt vom Datenelement ab:

#### Nicht-codierte Datenelemente

Es MUSS die Extension [`Data-Absent-Reason`](http://hl7.org/fhir/R4/extension-data-absent-reason.html) am Datentyp mit dem Code `unknown` verwendet werden.

#### Codierte Datenelemente mit ValueSet-Binding „example", „preferred" oder „extensible"

* Enthält das Quellsystem **nur Freitext**, SOLLTE ausschließlich das Textelement (`CodeableConcept.text`) genutzt werden.
* Sind weder Text noch codierte Daten vorhanden: 
* enthält das ValueSet einen „unbekannt"-Code, SOLL dieser verwendet werden;
* andernfalls SOLL der Code `unknown` aus dem CodeSystem [DataAbsentReason](http://hl7.org/fhir/R4/codesystem-data-absent-reason.html) genutzt werden.
 

#### Codierte Datenelemente mit ValueSet-Binding „required"

* Enthält das ValueSet einen „unbekannt"-Code, MUSS dieser verwendet werden.
* Andernfalls MUSS ein Konzept aus dem ValueSet verwendet werden — die Instanz wäre sonst **nicht konform**.

> [TODO: Nur ergänzen, falls Ihr Modul modul-spezifische Sonderfälle hat.]

