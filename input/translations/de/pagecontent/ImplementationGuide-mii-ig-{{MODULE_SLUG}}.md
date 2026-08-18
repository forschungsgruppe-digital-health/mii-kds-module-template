<!-- markdownlint-disable MD041 -->
<!-- German mirror of input/pagecontent/ImplementationGuide-mii-ig-{{MODULE_SLUG}}.md —
     both files must say the same thing. The cross-version include uses the
     publisher's TRANSLATED fragment name for the /de/ tree
     (versionsuebergreifende-analyse.html — the kerndatensatz-basis idiom);
     the xhtml fragments are language-selected via {% raw %}{% lang-fragment %}{% endraw %}.
     FILE NAME CARRIES THE IG ID — rename together with the English page and
     the IG-level .po catalogue (docs/recipes/create-a-new-module.md step 4). -->
Diese ImplementationGuide-Ressource definiert die technischen Details dieser
Publikation, einschließlich Abhängigkeiten und Veröffentlichungsparametern.

- [XML](../ImplementationGuide-mii-ig-{{MODULE_SLUG}}.xml)
- [JSON](../ImplementationGuide-mii-ig-{{MODULE_SLUG}}.json)

### Versionsübergreifende Analyse

{% include versionsuebergreifende-analyse.html %}

### IG-Abhängigkeiten

Dieser IG enthält die folgenden Abhängigkeiten von anderen IGs.

{% lang-fragment dependency-table.xhtml %}

> **Woher die Versionen kommen.** Die Tabelle zeigt die in
> [`sushi-config.yaml`](https://github.com/{{GITHUB_ORG}}/{{REPO_NAME}}/blob/main/sushi-config.yaml)
> (`dependencies:`) gepinnten Pakete samt allem, was der IG Publisher mit ihnen
> lädt. `hl7.terminology.r4` (THO) und `hl7.fhir.uv.extensions.r4` sind dort
> bewusst **nicht** gepinnt: Der Publisher
> [lädt beide immer](https://build.fhir.org/ig/FHIR/ig-guidance/versions.html#automatic-packages)
> und injiziert nur dann deren aktuellstes Full Release, wenn der
> Abhängigkeitsbaum sie nicht bereits mitbringt — eine von einer Abhängigkeit
> (in der KDS-Familie: dem MII-Meta-Paket) gepinnte Version hat damit
> automatisch Vorrang. Die von einem konkreten Build verwendeten Versionen
> stehen in dessen `qa-versions.json`.
{: .ig-highlight .ig-highlight-grey}

### Globale Profile

Dieser IG deklariert die folgenden globalen Profile — Profile, die für jede
unter diesem Leitfaden ausgetauschte Instanz ihres Ressourcentyps gelten. Eine
leere Tabelle bedeutet: Dieses Modul deklariert keine.

{% lang-fragment globals-table.xhtml %}

### Urheberrechte

{% lang-fragment ip-statements.xhtml %}

### IG-Parametereinstellungen und Expansionsparameter

Expansionsparameter sind Query-Parameter, die an eine `ValueSet`-
`$expand`-Operation übergeben werden können, um zu steuern, wie das ValueSet
expandiert wird — also wie die vollständige Liste der Codes aus der
ValueSet-Definition erzeugt wird. Die für diesen IG verwendeten
[IG-Parameter](https://hl7.org/fhir/tools/en/CodeSystem-ig-parameters.html)
sind in
[`sushi-config.yaml`](https://github.com/{{GITHUB_ORG}}/{{REPO_NAME}}/blob/main/sushi-config.yaml)
(`parameters:`) deklariert. Ein Modul, das seine Expansionsparameter über ein
CRMI-Manifest pinnt, verlinkt hier zusätzlich die generierte
`Parameters`-Ressource (siehe die auskommentierten Manifest-Blöcke in
`sushi-config.yaml` und die Seite Metadata Overview, sofern das Modul sie
behält).
