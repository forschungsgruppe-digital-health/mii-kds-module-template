# Must Support - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Conformance**](conformance.md)
* **Must Support**

## Must Support

### Must-Support

#### Definition

Elemente einer FHIR-Ressource können in einem Profil als **obligatorisch** oder als [**Must Support**](http://hl7.org/fhir/R4/profiling.html#mustsupport) gekennzeichnet werden.

* **Obligatorische Elemente** sind Elemente mit Mindestkardinalität `1` (z. B. `1..1`, `1..*`). Diese MÜSSEN grundsätzlich vorhanden sein. In Ausnahmefällen können die Werte fehlen — in diesem Fall MUSS die Abwesenheit dokumentiert werden, etwa über die `Data-Absent-Reason`-Extension (siehe [Umgang mit fehlenden Daten](missing-data.md)).
* **Must Support (MS)** bedeutet, dass Systeme dieses Element unterstützen MÜSSEN, auch wenn die Kardinalität `0..*` lautet. **Unterstützen** heißt: Systeme MÜSSEN in der Lage sein, das Element zu befüllen, zu speichern, anzuzeigen und korrekt zu verarbeiten.

Must-Support ist damit **nicht** dasselbe wie Kardinalität: ein Element kann `0..1` sein und trotzdem Must-Support — die Daten dürfen fehlen, die Fähigkeit, sie zu verarbeiten, darf nicht.

#### Anforderungen an daten-erzeugende Systeme

**(z. B. die FHIR-API eines Datenintegrationszentrums)**

Ein konformes daten-erzeugendes System MUSS:

* ein MS-Element mit Daten füllen, sofern diese lokal verfügbar sind (z. B. über ETL aus dem Primärsystem),
* das MS-Element in der Ressource speichern können,
* das MS-Element auf Anfrage (z. B. bei einer Feasibility-Query) bereitstellen.

#### Anforderungen an daten-verarbeitende Systeme

**(z. B. anfragende Anwendungen)**

Ein konformes daten-verarbeitendes System MUSS:

* MS-Elemente dem Benutzer korrekt anzeigen,
* die Werte für Berechnungen oder Weiterverarbeitung berücksichtigen können,
* Ressourceninstanzen mit MS-Elementen fehlerfrei verarbeiten, ohne dass Fehler oder Abbrüche entstehen.

> [TODO: Nur ergänzen, falls Ihr Modul zusätzliche oder abweichende Must-Support-Regeln definiert — und die Abweichung begründen.]

