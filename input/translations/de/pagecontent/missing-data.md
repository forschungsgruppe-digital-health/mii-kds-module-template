<!-- markdownlint-disable MD041 -->
<!-- Deutsche Übersetzung der Standardsprachseite
     input/pagecontent/missing-data.md — beide Dateien müssen dasselbe aussagen.
     Die Fallunterscheidung nach Binding-Stärke ist normativ und folgt wörtlich
     der MII-Regelung (Quelle: MII-Meta-Wiki "Conformance", Abschnitt "Fehlende
     Daten",
     https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance)
     — bitte nicht kürzen. Einordnung, Beispiele und Querverweise stammen aus
     kerndatensatz-basis input/pagecontent/missing-data.md (Branch main).

     HINWEIS ZU DEN KONFORMITÄTS-VERBEN: Das deutsche Wiki formuliert den Fall
     „example / preferred / extensible" mit SOLLTE/SOLL, die englische Fassung
     der MII in kerndatensatz-basis mit SHALL. Jede Sprachfassung übernimmt hier
     die Formulierung ihrer Quelle wörtlich. Eine Vereinheitlichung ist eine
     MII-weite Entscheidung, keine modul-eigene — bitte hier nicht „korrigieren". -->

### Umgang mit fehlenden Daten

Es gibt Situationen, in denen Informationen zu einem Datenelement fehlen und das
Quellsystem den Grund für das Fehlen nicht kennt.

Diese Seite legt fest, wie ein konformes System solche Fälle in den Ressourcen
des Moduls **{{MODULE_TITLE}}** darstellt. Die Regeln stimmen mit der
[FHIR-Kernspezifikation](https://hl7.org/fhir/R4/extensibility.html#Special-Case)
überein und sind konsistent mit der internationalen Praxis, wie sie die
[International Patient Summary (IPS)](https://hl7.org/fhir/uv/ips/Empty-Sections-and-Missing-Data.html)
definiert.

Allgemeine Hinweise zu Must-Support-Elementen stehen auf der Seite
[Must-Support](must-support.html), die Konformitätserwartungen und Regeln für
codierte Elemente auf der Seite
[Allgemeine Anforderungen](general-requirements.html).

#### Elemente mit Mindestkardinalität 0

**Regel:** Liegt dem Quellsystem **keine Dateninstanz** für ein Element mit
Mindestkardinalität `0` vor — einschließlich der mit
[*Must Support*](must-support.html) gekennzeichneten Elemente —, MUSS das
Datenelement in der Ressource **ausgelassen** werden.

Das gilt für codierte wie für nicht-codierte Elemente gleichermaßen. Das Element
wird schlicht nicht in die Ressourceninstanz aufgenommen.

#### Obligatorische Elemente (Mindestkardinalität > 0)

**Regel:** Handelt es sich um ein **obligatorisches Element**
(Mindestkardinalität `1..`), MUSS es **vorhanden sein**, auch wenn das
Quellsystem keine Daten hat oder den Grund für das Fehlen nicht kennt.

Wie der fehlende Wert dargestellt wird, hängt davon ab, ob das Element codiert
ist oder nicht.

##### Nicht-codierte Datenelemente

Bei nicht-codierten Datenelementen (z. B. `string`, `HumanName`, `Address`) MUSS
die Extension
[`Data-Absent-Reason`](http://hl7.org/fhir/R4/extension-data-absent-reason.html)
am Datentyp mit dem Code `unknown` verwendet werden.

**Code:** `unknown` — der Wert wird erwartet, ist aber nicht bekannt.

**Beispiel:** eine Patient-Ressource, deren Familienname nicht verfügbar ist:

```json
{
  "resourceType": "Patient",
  "id": "example-missing-name",
  "name": [
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
          "valueCode": "unknown"
        }
      ]
    }
  ],
  "gender": "unknown",
  "birthDate": "1990-01-01"
}
```

##### Codierte Datenelemente

Bei codierten Datenelementen hängt das Vorgehen von der Binding-Stärke des
Elements ab.

###### Binding-Stärke „example", „preferred" oder „extensible"

Für Elemente mit `example`-, `preferred`- oder `extensible`-Binding (Datentypen
`CodeableConcept` oder `Coding`):

1. **Enthält das Quellsystem nur Freitext**, SOLLTE ausschließlich das
   Textelement (`CodeableConcept.text`) genutzt werden. Bei `Coding`-Datentypen
   werden reine Textdaten im Element `display` dargestellt.
2. **Sind weder Text noch codierte Daten vorhanden:**
   * enthält das ValueSet einen „unbekannt"-Code, SOLL dieser verwendet werden;
   * andernfalls SOLL der Code `unknown` aus dem CodeSystem
     [DataAbsentReason](http://hl7.org/fhir/R4/codesystem-data-absent-reason.html)
     genutzt werden.

**Beispiel:** eine Condition-Ressource, deren obligatorischer Wert
`Condition.code` unbekannt ist:

```json
{
  "resourceType": "Condition",
  "id": "example-unknown-code",
  "clinicalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/data-absent-reason",
        "code": "unknown",
        "display": "Unknown"
      }
    ]
  },
  "subject": {
    "reference": "Patient/example"
  }
}
```

###### Binding-Stärke „required"

Für Elemente mit `required`-Binding (Datentypen `CodeableConcept`, `Coding` oder
`code`):

1. Enthält das ValueSet einen „unbekannt"-Code, MUSS dieser verwendet werden.
2. Andernfalls MUSS ein Konzept aus dem ValueSet verwendet werden — die Instanz
   wäre sonst **nicht konform**.

> [TODO: Nur ergänzen, falls Ihr Modul modul-spezifische Sonderfälle hat — etwa
> ein Element, dessen ValueSet einen eigenen „unbekannt"-Code mitbringt, oder
> eine Datenkategorie, für die das Modul eine abweichende Darstellung vorgibt.
> Löschen Sie diesen Hinweis anschließend.]

#### Siehe auch

* [Must-Support](must-support.html) — die Erwartungen an Server und Clients bei
  Must-Support-Elementen.
* [Allgemeine Anforderungen](general-requirements.html) — Verwendung von Codes
  in den Profilen und Beanspruchen von Konformität.
* [FHIR-R4-Konformitätsregeln](http://hl7.org/fhir/R4/conformance-rules.html#missing)
  — die Vorgaben der Kernspezifikation zu fehlenden Daten.
