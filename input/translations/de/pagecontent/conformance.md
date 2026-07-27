<!-- markdownlint-disable MD041 -->
<!-- Deutsche Übersetzung der Standardsprachseite
     input/pagecontent/conformance.md — beide Dateien müssen dasselbe aussagen
     und dieselben Unterseiten aufführen wie die beiden Menü-Dateien.
     Die ERSTEN DREI Unterseiten tragen die Konformitätsthemen der Seite
     "Conformance" des MII-Meta-Wikis,
     https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance;
     Aufbau wie kerndatensatz-basis input/pagecontent/conformance.md.
     "Sicherheit und Datenschutz" ist eine Ergänzung dieser Vorlage gemäß den
     HL7-IG-Best-Practices — siehe docs/ig-best-practices-checklist.md. -->

### Konformität

Dieser Abschnitt definiert die Konformitätsanforderungen für Systeme, die die
Profile des Moduls **{{MODULE_TITLE}}** umsetzen.

* **[Allgemeine Anforderungen](general-requirements.html)** — die
  Konformitäts-Verben (MUSS/SOLLTE/KANN nach RFC-2119), das Beanspruchen von
  Konformität, die Verwendung von Codes in den Profilen und die Erwartungen an
  die FHIR-RESTful-API.
* **[Must-Support](must-support.html)** — was *Must Support* für
  daten-erzeugende und daten-verarbeitende Systeme bedeutet.
* **[Umgang mit fehlenden Daten](missing-data.html)** — wie fehlende oder
  unbekannte Werte kodiert werden.
* **[Sicherheit und Datenschutz](security-and-privacy.html)** — die
  Sicherheits- und Datenschutzbetrachtungen dieses Moduls.

Maßgeblich für die MII-weiten Konformitätsregeln ist die Seite
[Conformance](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance)
des MII-Meta-Wikis. Allgemeine Anforderungen, Must-Support und Umgang mit
fehlenden Daten geben sie für dieses Modul wieder; bei Abweichungen gilt das
Wiki. Sicherheit und Datenschutz ist eine zusätzliche Seite dieses Leitfadens
gemäß den HL7-IG-Best-Practices.

Hinweise zur Umsetzung stehen im Abschnitt [Anleitung](guidance.html), die
technischen Artefakte im Abschnitt [Artefakte](artifacts.html).

> [TODO: Ergänzen Sie modul-spezifische Konformitätsaussagen.
>
> Hinweis zur Erfassung: Konformitätsaussagen werden **nicht** automatisch
> erkannt. Jeder normative Satz der englischen Seiten wird ausdrücklich
> markiert — eine Id, ein Doppelpunkt und der Satz, begrenzt durch
> Paragraphenzeichen — und daraus erzeugt der IG-Publisher die Übersichtstabelle
> am Ende der englischen Fassung dieser Seite. Die Syntax steht im Original in
> `input/pagecontent/general-requirements.md`. Diese deutsche Fassung trägt
> bewusst keine Markierungen.
>
> Halten Sie die Menge **kuratiert** — markieren Sie echte Verpflichtungen,
> nicht jeden Satz mit einem fett gesetzten Verb — und formulieren Sie jeden
> markierten Satz für sich verständlich: die Tabelle zeigt ihn ohne Kontext.]

---

{:.bg-info}
**Hinweis:** Eine Liste der Konformitätsaussagen ist in der englischen Fassung
dieses Implementierungsleitfadens verfügbar. Die Aussagen sind ausschließlich
auf den englischen Originalseiten markiert und werden nur dort erzeugt.
