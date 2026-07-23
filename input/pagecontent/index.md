<!-- markdownlint-disable MD041 -->
<!--
  HOME PAGE — this follows the standard MII module IG structure (derived from the
  MII IG template and kerndatensatz-basis). Replace the {{...}} placeholders and
  the bracketed [TODO ...] prompts with your module's real content, then delete
  these HTML comments. Keep the section headings — a reviewer expects them.
  The English rendering of this page lives at
  input/translations/en/pagecontent/index.md (see docs/recipes/add-translation.md).
-->

### Einleitung

Diese Spezifikation beschreibt die FHIR-Repräsentation des
Kerndatensatz-(KDS-)Moduls **{{MODULE_TITLE}}** der Medizininformatik-Initiative
(MII). Sie beschreibt die Anwendungsfälle des Moduls sowie die zugehörigen
FHIR-Profile, Extensions und Terminologie-Ressourcen in ihrer verbindlichen
Form. Der MII-Kerndatensatz dient der standardisierten Nutzung klinischer
Routinedaten für die medizinische Forschung.

> [TODO: Beschreiben Sie in ein bis zwei Sätzen den fachlichen Gegenstand Ihres
> Moduls — welche Daten es abdeckt und wofür sie genutzt werden.]

| Veröffentlichung |               |
|------------------|---------------|
| Datum            | {{RELEASE_DATE}} |
| Version          | {{CALVER_VERSION}} (CalVer `JJJJ.n.n`) |
| Status           | active        |
| Realm            | DE            |

### Zielgruppe

Dieser Implementierungsleitfaden richtet sich an:

<div class="mii-highlight mii-highlight-blue">
<h5>Implementierende</h5>
<p>Datenintegrationszentren (DIZ), Software-Entwickelnde und System-Architekt:innen, die FHIR-basierte Lösungen umsetzen.<br/>
→ siehe <a href="profiles-and-extensions.html">Profile und Extensions</a> und <a href="logical-models.html">Logische Modelle</a>.</p>
</div>

<div class="mii-highlight mii-highlight-green">
<h5>Forschende</h5>
<p>Wissenschaftler:innen, die MII-Daten für die medizinische Forschung nutzen.<br/>
→ siehe <a href="researcher-guidance.html">Anleitung für Forschende</a>.</p>
</div>

### Inhalt dieses Leitfadens

- **[Anleitung](guidance.html)** — Einstieg und fachliche Hinweise.
- **[Konformität](conformance.html)** — verbindliche Anforderungen, Must-Support
  und der Umgang mit fehlenden Daten.
- **[Profile und Extensions](profiles-and-extensions.html)** und
  **[Terminologie](terminology.html)** — die technischen Artefakte.
- **[Beispiele](examples.html)** — Beispielinstanzen.

### Impressum

Dieser Leitfaden ist im Rahmen der Medizininformatik-Initiative erstellt worden
und unterliegt per Governance-Prozess dem Abstimmungsverfahren des
Interoperabilitätsforums und der Technischen Komitees von HL7 Deutschland e. V.

### Ansprechpartner

Fragen zu dieser Publikation können im HL7-FHIR-Zulip
[chat.fhir.org](https://chat.fhir.org) im Stream `german/mi-initiative` gestellt
werden. Anmerkungen und Kritik werden als *Issues* auf
[GitHub](https://github.com/{{GITHUB_ORG}}/{{REPO_NAME}}/issues) entgegengenommen.

> [TODO: Nennen Sie die fachlichen Ansprechpartner:innen Ihres Moduls.]

### Autor:innen (in alphabetischer Reihenfolge)

> [TODO: Listen Sie die Autor:innen des Moduls mit Institution auf.]

### Copyright-Hinweis / Nutzungshinweise

© {{COPYRIGHT_START_YEAR}}+ — dieses Werk ist lizenziert unter der
[Creative Commons Namensnennung 4.0 International Lizenz (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
