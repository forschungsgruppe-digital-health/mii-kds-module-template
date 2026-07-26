# Must Support - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* [**Conformance**](conformance.md)
* **Must Support**

## Must Support

 Diese Seite enthält Übersetzungen aus der Originalsprache, in der der Leitfaden verfasst wurde. Informationen zu diesen Übersetzungen und Anweisungen zum Abgeben von Feedback zu den Übersetzungen finden Sie [hier](translationinfo.html). 

### Must-Support

Beim Abfragen und Lesen der Profile dieses Moduls MUSS **Must Support** für jedes Profil-Datenelement so ausgelegt werden, wie auf dieser Seite beschrieben.

#### Definition

Elemente einer FHIR-Ressource können in einem Profil als **obligatorisch** oder als [**Must Support**](http://hl7.org/fhir/R4/profiling.html#mustsupport) gekennzeichnet werden.

* **Obligatorische Elemente** sind Elemente mit Mindestkardinalität `1` (z. B. `1..1`, `1..*`). Diese MÜSSEN grundsätzlich vorhanden sein. In Ausnahmefällen können die Werte fehlen — in diesem Fall MUSS die Abwesenheit dokumentiert werden, etwa über die `Data-Absent-Reason`-Extension (siehe [Umgang mit fehlenden Daten](missing-data.md)).
* **Must Support (MS)** bedeutet, dass Systeme dieses Element unterstützen MÜSSEN, auch wenn die Kardinalität `0..*` lautet. **Unterstützen** heißt: Systeme MÜSSEN in der Lage sein, das Element zu befüllen, zu speichern, anzuzeigen und korrekt zu verarbeiten.

Must-Support ist damit **nicht** dasselbe wie Kardinalität: ein Element kann `0..1` sein und trotzdem Must-Support — die Daten dürfen fehlen, die Fähigkeit, sie zu verarbeiten, darf nicht.

Unterschieden werden daten-erzeugende Systeme (Sender/Server) und daten-verarbeitende Systeme (Empfänger/Clients). In der MII-Infrastruktur ist die FHIR-API eines Datenintegrationszentrums (DIZ) das daten-erzeugende System, das Anfragen beantwortet.

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

#### Must-Support und fehlende Daten

* Liegt zu einem Datenelement keine Information vor und ist der Grund für das Fehlen unbekannt, DÜRFEN Server das Element in der zurückgegebenen Ressourceninstanz NICHT aufführen.
* Clients MÜSSEN ein fehlendes Datenelement in einer Ressourceninstanz so interpretieren, dass die Daten im System des Servers nicht vorhanden sind.
* Kennt der Server den genauen Grund für das Fehlen, SOLLTE er ihn gemäß [Umgang mit fehlenden Daten](missing-data.md) mitteilen.

#### Darstellung in den gerenderten Tabellen

Auf jeder Profilseite werden mehrere formale Ansichten des Profilinhalts als Baum dargestellt, unter den Reitern **Differential Table**, **Key Elements Table** und **Snapshot Table**.

In diesen Ansichten gilt:

* Elemente, deren Kardinalität in der Spalte „Card." mit `1` beginnt (z. B. `1..1`), sind **obligatorisch**;
* als Must Support gekennzeichnete Elemente tragen ein rotes S.

Die folgenden Abschnitte beschreiben, was die Kennzeichnung für die verschiedenen Element-Arten bedeutet.

#### Must-Support — primitive Elemente

Primitive Elemente sind einzelne Elemente mit einem primitiven Wert. Bei einem primitiven Must-Support-Element MUSS der Server den Elementwert bereitstellen können und der Client ihn verarbeiten können.

Ist beispielsweise `Patient.birthDate` als Must Support gekennzeichnet:

* MÜSSEN Server einen Wert in `Patient.birthDate` bereitstellen können,
* MÜSSEN Clients den Wert in `Patient.birthDate` verarbeiten können.

#### Must-Support — komplexe Elemente

Komplexe Elemente bestehen aus primitiven und weiteren komplexen Elementen. Bei einem als Must Support gekennzeichneten komplexen Element MUSS der Server diejenigen Unterelement-Werte bereitstellen können, die selbst als Must Support gekennzeichnet sind; ist kein Unterelement gekennzeichnet, MUSS der Server mindestens einen Unterelement-Wert bereitstellen können. Der Client MUSS die Must-Support-Unterelement-Werte verarbeiten können. Sind Unterelemente eines komplexen Elements als Must Support gekennzeichnet, so wird die Erwartung an das übergeordnete Element durch die Unterstützung dieser Unterelemente erfüllt.

Ist beispielsweise `Patient.name` als Must Support gekennzeichnet und sind es seine Unterelemente `family` und `given` ebenfalls:

* MÜSSEN Server Werte in `Patient.name.family` und `Patient.name.given` bereitstellen können,
* MÜSSEN Clients diese Werte verarbeiten können.

Ist umgekehrt ein Unterelement als Must Support gekennzeichnet, das übergeordnete Element aber nicht, besteht **keine** Erwartung, das übergeordnete Element als solches zu unterstützen. Ist das übergeordnete Element in der Struktur vorhanden, ohne selbst gekennzeichnet zu sein, MÜSSEN Server dennoch die gekennzeichneten Unterelemente unterstützen.

#### Must-Support — Referenzen

Hat ein Must-Support-Referenzelement genau ein Zielprofil, MUSS dieses Zielprofil unterstützt werden.

Referenziert beispielsweise `Condition.subject` das Patient-Profil dieses Moduls und ist als Must Support gekennzeichnet:

* MÜSSEN Server ein `Condition.subject` mit einer gültigen Referenz auf dieses Profil bereitstellen können,
* MÜSSEN Clients eine solche Referenz verarbeiten können.

Hat ein Must-Support-Referenzelement mehrere Zielprofile und ist keines davon als Must Support gekennzeichnet, MUSS **mindestens ein** Zielprofil unterstützt werden.

#### Must-Support — Auswahl von Datentypen

Bei Must-Support-Auswahlelementen (`value[x]` und ähnliche) MUSS der Server die als Must Support gekennzeichneten Datentypen unterstützen, und der Client MUSS alle als Must Support gekennzeichneten Datentypen verarbeiten können.

Hat beispielsweise `Observation.value[x]` mehrere Must-Support-Datentypen:

* MÜSSEN Server die gekennzeichneten Datentypen befüllen können (z. B. `valueQuantity`, `valueCodeableConcept`, `valueString`),
* MÜSSEN Clients alle gekennzeichneten Datentypen verarbeiten können,
* KÖNNEN Systeme weitere Auswahlmöglichkeiten unterstützen, ohne dass dies gefordert ist.

#### Must-Support — Slices

FHIR-Profile nutzen [Slicing](http://hl7.org/fhir/R4/profiling.html#slicing), um wiederholbare Elemente einzuschränken. Das Element mit dem Slicing-Diskriminator (der „Slicer") kann als Must Support gekennzeichnet sein; damit die Must-Support-Erwartung für einen Slice gilt, MUSS dieser Slice jedoch ausdrücklich gekennzeichnet sein. Bei Must-Support-Slices MUSS der Server Daten bereitstellen können, die den ausdrücklich gekennzeichneten Slices entsprechen, und der Client MUSS solche Daten verarbeiten können.

Ist beispielsweise `identifier` ein Must-Support-Slicer mit Slices für mehrere Identifier-Arten, sind nur die ausdrücklich gekennzeichneten Slices gefordert:

* MÜSSEN Server Identifier bereitstellen können, die den Must-Support-Slices entsprechen,
* MÜSSEN Clients diese verarbeiten können,
* KÖNNEN Systeme weitere Slices unterstützen, ohne dass dies gefordert ist.

> [TODO: Nur ergänzen, falls Ihr Modul zusätzliche oder abweichende Must-Support-Regeln definiert — und die Abweichung begründen. Löschen Sie diesen Hinweis anschließend.]

#### Siehe auch

* [Allgemeine Anforderungen](general-requirements.md) — die für alle Akteure und Profile geltenden Anforderungen.
* [Umgang mit fehlenden Daten](missing-data.md) — Darstellung fehlender Werte.
* [Konformität](conformance.md) — Überblick über die Konformitätsanforderungen.

