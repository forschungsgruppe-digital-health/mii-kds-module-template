// ─────────────────────────────────────────────────────────────────────────────
// Ported from kerndatensatz-basis (main): input/fsh/rulesets/version.fsh
//
// One place to switch the version of every conformance resource in the module.
// basis's literals are replaced by this repository's placeholders:
//   2026.0.1                                    → {{CALVER_VERSION}}
//   de.medizininformatikinitiative.kerndatensatz.base → …kerndatensatz.{{MODULE_SLUG}}
//   …/fhir/modul-base                           → …/fhir/modul-{{MODULE_SLUG}}
//   "2026" (effectivePeriod.start)              → {{CALVER_YEAR}}
// Keep the values identical to `version:` / `packageId:` / `canonical:` in
// sushi-config.yaml — the IG Publisher does not reconcile them for you.
// ─────────────────────────────────────────────────────────────────────────────

// Instance-path flavour (Instance: … InstanceOf: …, e.g. CapabilityStatement).
RuleSet: Version
* version = "{{CALVER_VERSION}}"
* extension[+].url = $artifact-versionAlgorithm
* extension[=].valueCoding = $version-algorithm#semver "SemVer"

// Caret-path flavour (Profile:, Extension:, Logical:, ValueSet:, CodeSystem:).
RuleSet: PR_CS_VS_Version
* ^version = "{{CALVER_VERSION}}"
* ^extension[+].url = $artifact-versionAlgorithm
* ^extension[=].valueCoding = $version-algorithm#semver "SemVer"

// basis records `semver` here even though MII module versions are CalVer
// YYYY.n.n. Kept as in basis — do not "correct" it without an MII-wide decision
// (the same note is on the IG-level extension in sushi-config.yaml).
Alias: $artifact-versionAlgorithm = http://hl7.org/fhir/StructureDefinition/artifact-versionAlgorithm
Alias: $version-algorithm = http://hl7.org/fhir/version-algorithm

// Package provenance (meta.extension) — repeats packageId, version and canonical
// so a resource lifted out of the package still says where it came from.
RuleSet: CRMIPackageSource
* meta.extension[+].url = "http://hl7.org/fhir/StructureDefinition/package-source"
* meta.extension[=].extension[+].url = "packageId"
* meta.extension[=].extension[=].valueId = "de.medizininformatikinitiative.kerndatensatz.{{MODULE_SLUG}}"
* meta.extension[=].extension[+].url = "version"
* meta.extension[=].extension[=].valueString = "{{CALVER_VERSION}}"
* meta.extension[=].extension[+].url = "uri"
* meta.extension[=].extension[=].valueUri = "https://www.medizininformatik-initiative.de/fhir/modul-{{MODULE_SLUG}}"

RuleSet: CRMIPackageSourceDefinitionalResource
* ^meta.extension[+].url = "http://hl7.org/fhir/StructureDefinition/package-source"
* ^meta.extension[=].extension[+].url = "packageId"
* ^meta.extension[=].extension[=].valueId = "de.medizininformatikinitiative.kerndatensatz.{{MODULE_SLUG}}"
* ^meta.extension[=].extension[+].url = "version"
* ^meta.extension[=].extension[=].valueString = "{{CALVER_VERSION}}"
* ^meta.extension[=].extension[+].url = "uri"
* ^meta.extension[=].extension[=].valueUri = "https://www.medizininformatik-initiative.de/fhir/modul-{{MODULE_SLUG}}"

// Resource-independent effective period (StructureDefinition,
// CapabilityStatement, ImplementationGuide). A release stays the valid
// implemented version until a later release replaces it, so basis expresses only
// the applicability START — do not add an end date.
RuleSet: CRMIResourceEffectivePeriod
* ^extension[+].url = "http://hl7.org/fhir/StructureDefinition/resource-effectivePeriod"
* ^extension[=].valuePeriod.start = "{{CALVER_YEAR}}"

RuleSet: CRMIResourceEffectivePeriodInstance
* extension[+].url = "http://hl7.org/fhir/StructureDefinition/resource-effectivePeriod"
* extension[=].valuePeriod.start = "{{CALVER_YEAR}}"
