# Versioning - MII Implementation Guide Module Template v2027.0.0-draft.1

* [**Table of Contents**](toc.md)
* **Versioning**

## Versioning

 Diese Seite enthält Übersetzungen aus der Originalsprache, in der der Leitfaden verfasst wurde. Informationen zu diesen Übersetzungen und Anweisungen zum Abgeben von Feedback zu den Übersetzungen finden Sie [hier](translationinfo.md). 

### Versionierung

#### Versionsschema

Das Modul **Module Template** folgt dem MII-Schema der Kalender-Versionierung (CalVer) in einer SemVer-kompatiblen numerischen Form:

* Format **`JJJJ.MINOR.PATCH[-label]`** — die aktuelle Version ist `2027.0.0-draft.1`;
* **`JJJJ`** — das Jahr, in dem der Leitfaden gilt und genutzt werden soll; es tritt an die Stelle der Major-Version;
* **`MINOR`** — wird für nicht brechende Ergänzungen und Präzisierungen erhöht;
* **`PATCH`** — wird für Korrekturen und Fehlerbehebungen erhöht;
* **`label`** — optionales Vorab- oder Build-Label, z. B. `draft`, `ballot` oder `cibuild`.

#### Versionen vergleichen

Stabile Releases lassen sich vergleichen, indem die numerischen Bestandteile als SemVer-artiges `<major>.<minor>.<patch>` gelesen werden, mit dem Kalenderjahr als Major-Komponente: `2026.1.0` ist neuer als `2026.0.3`. Labels kennzeichnen den Vorab- oder Build-Status; zwischen Labels wird keine Reihenfolge abgeleitet.

#### Artefakt-Versionen

Alle veröffentlichten FHIR-Artefakte im Paket tragen dieselbe Version wie der Leitfaden und sein Paket. Ein Artefakt kann daher beim Release eine neue Version erhalten, obwohl es selbst unverändert geblieben ist. Die maschinenlesbaren Metadaten, die Versionsalgorithmus, Versionierungs-Politik, Paketquelle und Manifest-Parameter deklarieren, beschreibt die Seite [Metadaten-Übersicht](metadata.md).

#### Release-Prozess

Releases folgen dem [MII Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow): Die Version wird im Release-Branch angehoben, der Changelog-Eintrag geschrieben, die Validierungs-Workflows laufen auf dem Release-Pull-Request, und nach dem Merge wird das Release getaggt.

#### Versionshistorie und Änderungen

* **[Änderungshistorie](changes.md)** — die Änderungen jeder veröffentlichten Version.

Ab dem zweiten Release veröffentlicht dieser Leitfaden zusätzlich einen **maschinell erzeugten Versionsvergleich**: Der IG Publisher vergleicht jedes Profil, ValueSet und CodeSystem mit dem vorherigen Release und rendert das Delta unter `comparison-v<Vorversion>/index.html`, verlinkt aus dem QA-Bericht. Aktiviert wird er über den Parameter `version-comparison` in der `sushi-config.yaml` (der auskommentierte Block dort erklärt die Einrichtung). Er ergänzt die Änderungshistorie: Die Änderungshistorie erklärt **warum** und **was zu tun ist**, der Vergleich zeigt, **was sich genau geändert hat**.

> [TODO: Falls Ihr Modul über das MII-Schema hinaus eine eigene Versionierungs-Politik hat — etwa einen Unterstützungszeitraum für ältere Versionen oder eine Abkündigungs-Politik für Profile —, beschreiben Sie sie hier. Löschen Sie diesen Hinweis anschließend.]

