# General Requirements - MII Implementation Guide Module Template v2026.0.0

* [**Inhaltsverzeichnis**](toc.md)
* [**Conformance**](conformance.md)
* **General Requirements**

## General Requirements

 Diese Seite enthält Übersetzungen aus der Originalsprache, in der der Leitfaden verfasst wurde. Informationen zu diesen Übersetzungen und Anweisungen zum Abgeben von Feedback zu den Übersetzungen finden Sie [hier](translationinfo.md). 

### Allgemeine Anforderungen

Diese Seite beschreibt die Anforderungen, die für das gesamte Modul **Module Template** und für alle es umsetzenden MII-Akteure gelten.

#### Anforderungsdokumentation

Anforderungen in dieser Spezifikation werden durch folgende in Großbuchstaben geschriebene Schlüsselworte (Conformance verbs) auf Basis von [RFC-2119](https://datatracker.ietf.org/doc/html/rfc2119) und der [FHIR-Konformitätssprache](http://hl7.org/fhir/R4/conformance-rules.html#conflang) gekennzeichnet:

| | |
| :--- | :--- |
| MUSS / MÜSSEN | MUST / SHALL |
| DARF NICHT / DÜRFEN NICHT | MUST NOT / SHALL NOT |
| VERPFLICHTEND | REQUIRED |
| SOLLTE / SOLLTEN | SHOULD |
| SOLLTE NICHT / SOLLTEN NICHT | SHOULD NOT |
| EMPFOHLEN | RECOMMENDED |
| KANN / OPTIONAL | MAY |

Die deutsche Spalte ist die Formulierung dieser Fassung des Leitfadens, die englische Spalte das zugehörige RFC-2119-Schlüsselwort. Beide sind gleichwertig — eine Anforderung ändert ihre Verbindlichkeit nicht dadurch, dass sie in der anderen Sprache gelesen wird.

#### MII-Konformitätsartefakte

* Die Seite [Profile und Extensions](profiles-and-extensions.md) listet die Profile dieses Moduls. Ihre [StructureDefinitions](http://hl7.org/fhir/R4/structuredefinition.html) legen die **minimal** erforderlichen Elemente, Extensions, Vokabulare und ValueSets fest, die vorhanden sein MÜSSEN, und schränken deren Verwendung ein.
* Profil-Elemente tragen **obligatorische** und **Must-Support**-Anforderungen. Obligatorische Elemente haben eine Mindestkardinalität von 1 (min=1). Die Seite [Must-Support](must-support.md) beschreibt, was von Servern und Clients erwartet wird und wie die Kennzeichnungen dargestellt werden.
* Die Seite [CapabilityStatements](capability-statements.md) benennt die RESTful-Interaktionen, unterstützten Profile und Suchparameter, die von einem konformen Server erwartet werden. Die Profile tragen die strukturellen Einschränkungen, Terminologie-Bindings und Invarianten, die CapabilityStatements die Interaktionserwartungen. Implementierende brauchen beides.

#### Standards und Abstimmung

Die MII-Kerndatensatz-Spezifikationen bauen, wo immer möglich, auf internationalen Standards und Terminologien auf. Modulübergreifend sind insbesondere relevant:

* **[International Patient Summary (IPS)](http://hl7.org/fhir/uv/ips/)** — internationaler Standard für Patientenkurzakten.
* **[Deutsche Basisprofile (Basisprofil DE R4)](https://ig.fhir.de/basisprofile-de/)** — Anpassung an die Rahmenbedingungen des deutschen Gesundheitswesens.
* **[KBV-FHIR-Spezifikationen](https://simplifier.net/organization/kassenrztlichebundesvereinigungkbv)** — Kompatibilität mit den Spezifikationen der Kassenärztlichen Bundesvereinigung.
* **[gematik-FHIR-Spezifikationen](https://simplifier.net/organization/gematik)** — Kompatibilität mit den gematik-Spezifikationen.
* **[ISiK (Informationssysteme im Krankenhaus)](https://fachportal.gematik.de/informationen-fuer/isik)** — Referenzspezifikation für Krankenhausinformationssysteme.

Wo dieses Modul ein Profil von einer dieser Spezifikationen abweichend anpasst, wird die Notwendigkeit auf der jeweiligen Profilseite in Textform begründet.

> [TODO: Nennen Sie die Standards und Spezifikationen, an denen sich IHR Modul tatsächlich ausrichtet (sie sollten zu den `dependencies` in `sushi-config.yaml` passen), und löschen Sie die oben nicht zutreffenden Einträge.]

#### Beanspruchen von Konformität

Ein System beansprucht Konformität zu diesem Modul, indem es dessen Profile erfüllt. Dabei werden zwei Stufen unterschieden.

##### Profil-Unterstützung

Systeme können eines oder mehrere Profile dieses Moduls zur Darstellung klinischer Informationen einsetzen und dabei nur das Inhaltsmodell nutzen, ohne die zugehörigen Interaktionen umzusetzen.

* Server MÜSSEN alle Profil-Datenelemente befüllen können, die in der StructureDefinition des Profils obligatorisch oder als **Must Support** gekennzeichnet sind.
* Server SOLLTEN die Unterstützung eines Profils deklarieren, indem sie dessen offizielle URL in `CapabilityStatement.rest.resource.supportedProfile` angeben. Die offizielle („kanonische") URL steht auf der jeweiligen Profilseite.

##### Profil- und Interaktions-Unterstützung

Systeme können eines oder mehrere Profile **und** die für die entsprechenden Ressourcen definierten RESTful-Interaktionen unterstützen.

* Ein konformer Server MUSS alle Profil-Datenelemente befüllen können, die obligatorisch und/oder als **Must Support** gekennzeichnet sind.
* Ein konformer Server SOLLTE die Konformität zum einschlägigen CapabilityStatement deklarieren, indem er dessen offizielle URL in `CapabilityStatement.instantiates` angibt.
* Ein konformer Server MUSS die vollständigen Capability-Angaben des CapabilityStatements benennen, dessen Umsetzung er beansprucht.
* Ein konformer Server, der Interaktions-Unterstützung beansprucht, MUSS die Unterstützung des Profils durch dessen offizielle URL in `CapabilityStatement.rest.resource.supportedProfile` deklarieren.
* Ein konformer Server, der Interaktions-Unterstützung beansprucht, MUSS die FHIR-RESTful-Interaktionen dieses Profils deklarieren.

#### Verwendung von Codes in den Profilen

Die folgenden Regeln fassen zusammen, was die [FHIR-Terminologie](http://hl7.org/fhir/R4/terminologies.html) für codierte Elemente (Datentypen `CodeableConcept`, `Coding` und `code`) verlangt.

##### Required-Bindings

Ein [Required-Binding](http://hl7.org/fhir/R4/terminologies.html#required) an ein ValueSet bedeutet, dass einer der Codes dieses ValueSets verwendet werden MUSS. Bei `CodeableConcept`, das mehrere Codings und ein Textelement zulässt, gilt dies für **mindestens eines** der Codings — nur Text ist **nicht** zulässig.

* Server MÜSSEN mindestens einen Code aus dem gebundenen ValueSet liefern; zusätzliche Codes aus anderen Systemen KÖNNEN ergänzt werden.
* Clients MÜSSEN die Codes des gebundenen ValueSets verarbeiten können.

##### Extensible-Bindings

Ein [Extensible-Binding](http://hl7.org/fhir/R4/terminologies.html#extensible) bedeutet, dass einer der Codes des ValueSets verwendet werden MUSS, sofern dort ein passendes Konzept existiert. Existiert keines, können alternative Codes angegeben werden. Bei `CodeableConcept` gilt dies wieder für **mindestens eines** der Codings; liegt nur Text vor, der sich inhaltlich nicht mit den gebundenen Konzepten überschneidet, darf allein Text verwendet werden.

* Server MÜSSEN einen Code aus dem gebundenen ValueSet liefern, **sofern das Konzept dort existiert**, andernfalls einen alternativen Code, oder Text, wenn nur Text vorliegt.
* Clients MÜSSEN Codes des gebundenen ValueSets, alternative Codes und Text verarbeiten können.

##### Mehrere Codings in einem CodeableConcept

Zusätzlich zu den Codes eines Required- oder Extensible-ValueSets können alternative Codes angegeben werden („additional codings"). Sie können dem Standardkonzept entsprechen oder enger gefasst sein.

Das folgende Beispiel zeigt eine Diagnose mit einem ICD-10-GM- und einem SNOMED-CT-Code für internationale Interoperabilität:

```
"code": {
  "coding": [
    {
      "system": "http://fhir.de/CodeSystem/bfarm/icd-10-gm",
      "code": "E11.90",
      "display": "Diabetes mellitus, Typ 2, ohne Komplikationen"
    },
    {
      "system": "http://snomed.info/sct",
      "code": "44054006",
      "display": "Diabetes mellitus type 2"
    }
  ]
}

```

#### Fehlende Daten

Es gibt Situationen, in denen zu einem Datenelement keine Information vorliegt und das Quellsystem den Grund dafür nicht kennt. Die Seite [Umgang mit fehlenden Daten](missing-data.md) legt fest, wie das dargestellt wird.

#### FHIR-RESTful-Such-API

Für alle von diesem Leitfaden unterstützten Such-Interaktionen gilt:

* Server MÜSSEN die `POST`-basierte Suche unterstützen.
* Server MÜSSEN die `GET`-basierte Suche unterstützen.

Für die einzelnen Suchparameter-Typen gilt:

* **Token** — [Suche per Token](http://hl7.org/fhir/R4/search.html#token) 
* Clients MÜSSEN mindestens einen Code-Wert angeben und KÖNNEN System und Code angeben.
* Server MÜSSEN sowohl die Suche nur mit Code als auch mit System+Code unterstützen.
 
* **Reference** — [Suche per Referenz](http://hl7.org/fhir/R4/search.html#reference) 
* Clients MÜSSEN mindestens einen id-Wert angeben und KÖNNEN Typ und id angeben.
* Server MÜSSEN sowohl die Suche nur mit id als auch mit Typ+id unterstützen.
 
* **Date** — [Suche per Datum](http://hl7.org/fhir/R4/search.html#date) 
* Clients MÜSSEN Werte tagesgenau für Elemente vom Typ `date` und sekundengenau inklusive Zeitzonen-Offset für Elemente vom Typ `dateTime` angeben.
* Server MÜSSEN Werte dieser Genauigkeit unterstützen.
 

#### Modifier-Elemente

Ein [Modifier-Element](http://hl7.org/fhir/R4/conformance-rules.html#isModifier) verändert die Bedeutung des Elements, das es enthält. Nicht jedes Modifier-Element ist obligatorisch oder **Must Support**, und es gibt keine generelle Pflicht, sie zu unterstützen. Für Modifier-Elemente, die obligatorisch oder **Must Support** sind, MÜSSEN Server und Clients sie verarbeiten können.

Clients müssen mit **unerwarteten** Modifier-Elementen in empfangenen Daten rechnen: Sie können die Bedeutung der Daten verändern und bei falscher Behandlung zu Fehlern oder sogar Sicherheitsproblemen führen. Solange ein Client nicht sicherstellen kann, dass er ein solches Element sicher verarbeitet, ist die Zurückweisung der Instanz in der Regel die einzige sichere Reaktion.

Häufig **nicht** als Must Support gekennzeichnete Modifier-Elemente sind beispielsweise:

* das in jedem Profil vorhandene Element `modifierExtension`,
* `Observation.valueQuantity.comparator`,
* `Patient.active`.

Implementierende SOLLTEN die Profilseiten aufmerksam lesen, um zu erkennen, welche Elemente Modifier sind und wie sie die Interpretation einer Ressource beeinflussen.

> [TODO: Ergänzen Sie die allgemeinen Anforderungen, die für IHR Modul spezifisch sind — etwa zusätzliche Erwartungen an die FHIR-RESTful-API, an Suchparameter oder an die Verwendung von Codes in Ihren Profilen. Löschen Sie diesen Hinweis anschließend.]

#### Siehe auch

* [Must-Support](must-support.md) — die Must-Support-Erwartungen im Detail.
* [Umgang mit fehlenden Daten](missing-data.md) — Darstellung fehlender Werte.
* [CapabilityStatements](capability-statements.md) — Capability-Anforderungen an Server und Clients.
* [Sicherheit und Datenschutz](security-and-privacy.md) — modul-spezifische Sicherheits- und Datenschutzbetrachtungen.

