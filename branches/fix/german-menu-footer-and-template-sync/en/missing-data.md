# Handling Missing Data - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Conformance**](conformance.md)
* **Handling Missing Data**

## Handling Missing Data

 There is no translation page available for the current page, so it has been rendered in the default language 

### Fehlende Daten

Dieser Abschnitt beschreibt den Umgang mit fehlenden Daten in den Ressourcen des Moduls **Module Template**. Die Regeln folgen der [FHIR-Kernspezifikation](https://hl7.org/fhir/R4/extensibility.html#Special-Case) und dem [International Patient Summary (IPS)](https://hl7.org/fhir/uv/ips/Empty-Sections-and-Missing-Data.html).

#### Elemente mit Mindest-Kardinalität = 0

**Regel:** Liegt für ein Element mit min = 0 (auch Must-Support) kein Wert vor, **SHALL** das Element aus der Ressource weggelassen werden.

#### Pflicht-Elemente (Mindest-Kardinalität > 0)

**Regel:** Ein Pflicht-Element **SHALL** vorhanden sein, auch wenn kein Wert vorliegt. Für nicht-kodierte Elemente wird die [Data-Absent-Reason-Extension](http://hl7.org/fhir/StructureDefinition/data-absent-reason) verwendet; für kodierte Elemente ein entsprechender NullFlavor-Code (z. B. `unknown`).

> [TODO: Nur ergänzen, falls Ihr Modul modul-spezifische Sonderfälle hat.]

