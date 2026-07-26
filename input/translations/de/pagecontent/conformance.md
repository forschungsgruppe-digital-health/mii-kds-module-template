<!-- markdownlint-disable MD041 -->
<!-- Deutsche Übersetzung der Standardsprachseite
     input/pagecontent/conformance.md — beide Dateien müssen dasselbe aussagen
     und dieselben Unterseiten aufführen wie die beiden Menü-Dateien.
     Die Unterseiten sind der MII-Standardsatz (Quelle: MII-Meta-Wiki
     "Conformance",
     https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance;
     Aufbau wie kerndatensatz-basis input/pagecontent/conformance.md). -->

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

Verbindlich sind die Festlegungen des
[MII-Meta-Wikis](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance);
die Seiten dieses Abschnitts geben sie wieder.

Hinweise zur Umsetzung stehen im Abschnitt [Anleitung](guidance.html), die
technischen Artefakte im Abschnitt [Artefakte](artifacts.html).

> [TODO: Ergänzen Sie modul-spezifische Konformitätsaussagen.
>
> Hinweis zur Erfassung: Konformitätsaussagen werden **nicht** automatisch
> erkannt. Der IG-Publisher sammelt nur Sätze, die ausdrücklich markiert sind —
> `§<seite>-<n>:Server MÜSSEN …§` — und erzeugt daraus eine Übersichtstabelle
> an der Stelle eines Absatzes, der ausschließlich `§§§` enthält. Solange keine
> Sätze markiert sind, gibt es keine Übersicht. `kerndatensatz-basis` nutzt
> dieses Verfahren; ob diese Vorlage es übernimmt, ist noch offen, weil die
> Spalte „Expectation" aus den englischen Schlüsselworten SHALL/SHOULD/MAY
> abgeleitet wird, die deutsche Fassung einer Seite aber MUSS/SOLLTE/KANN
> verwendet — siehe die offenen Entscheidungen in
> `docs/ig-best-practices-checklist.md`. Prüfen Sie das vor der
> Veröffentlichung mit einem echten IG-Publisher-Build.]

---

{:.bg-info}
**Hinweis:** Eine Liste der Konformitätsaussagen ist in der englischen Fassung
dieses Implementierungsleitfadens verfügbar. Die Aussagen werden aus den
englischen Originalseiten erzeugt, weil der IG-Publisher die Erwartungsstufe aus
den englischen Schlüsselworten (SHALL/SHOULD/MAY) ableitet.
