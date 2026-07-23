# `input/fsh/` — FHIR Shorthand sources

SUSHI compiles every `.fsh` file in this tree (the subdirectory names are a
convention, not a technical requirement — kerndatensatz-basis uses exactly
this split, and keeping it makes MII modules navigable the same way):

| Subdirectory | Contains (one artifact per file) |
|---|---|
| `profiles/` | `Profile:` definitions — basis naming: `MII_PR_<Module>_<Name>.fsh` |
| `extensions/` | `Extension:` definitions — `MII_EX_<Module>_<Name>.fsh` |
| `valuesets/` | `ValueSet:` definitions — `MII_VS_<Module>_<Name>.fsh` |
| `codesystems/` | `CodeSystem:` definitions (incl. supplements) — `MII_CS_<Module>_<Name>.fsh` |
| `logicals/` | `Logical:` models of the module dataset — `MII_LM_<Module>.fsh` |
| `instances/` | `Instance:` examples (`MII_EXA_...`) and other concrete instances |
| `invariants/` | `Invariant:` definitions, one per file, named after the invariant key |
| `capabilitystatements/` | `Instance:` CapabilityStatements (`MII_CPS_...`) |
| `parameters/` | `Instance:` Parameters resources, e.g. the expansion-parameters manifest |
| `rulesets/` | `RuleSet:` definitions shared across artifacts (versioning, license, translation, CRMI metadata — basis keeps `version.fsh`, `license.fsh`, `crmi.fsh`, `translation.fsh`, … here) |

A root-level `aliases.fsh` (basis idiom) holds `Alias:` definitions shared by
all files.

Naming: follow the MII meta wiki page *Namenskonventionen für FHIR-Ressourcen
in der MII*. Starter content is added by the template's scaffolding step — do
not commit generated `fsh-generated/` output.
