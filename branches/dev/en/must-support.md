# Must Support - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Conformance**](conformance.md)
* **Must Support**

## Must Support

Für das Abfragen und Lesen von MII-Profilen ist **Must Support** auf einem Datenelement wie folgt zu interpretieren.

### Pflicht-Elemente (min = 1)

Pflicht-Elemente haben eine Mindest-Kardinalität von 1. Die Daten werden immer erwartet. Sind sie ausnahmsweise nicht vorhanden, gilt der Abschnitt [Umgang mit fehlenden Daten](missing-data.md).

### Must-Support-Elemente

Als **Must Support** (MS) markierte Elemente MÜSSEN von konformen Systemen unterstützt werden. Es wird zwischen datenliefernden Systemen (Server, z. B. die FHIR-API eines DIZ) und datenempfangenden Systemen (Client) unterschieden.

#### Erwartung an Server

Der Server **SHALL** ein Must-Support-Element befüllen können, sofern die Daten lokal verfügbar sind, es speichern und auf Anfrage bereitstellen können.

#### Erwartung an Clients

Der Client **SHALL** das Element verarbeiten (anzeigen/speichern/weiterverarbeiten) können.

> [TODO: Nur ergänzen, falls Ihr Modul zusätzliche Must-Support-Regeln definiert.]

