// ─────────────────────────────────────────────────────────────────────────────
// STARTER EXAMPLE — replace this with your module's real profiles.
//
// This is the one worked example the template ships so that a newly created
// module builds a non-empty, rendered IG on the very first run. It is a
// deliberately minimal FHIR profile: it only constrains cardinalities and marks
// a few elements as Must-Support, and it binds to NO external value set, so it
// validates without a terminology server and builds cleanly on the tx.fhir.org
// fallback (spec §2.10). Delete it once your own profiles exist.
//
// Naming: the MII convention is MII_PR_<Module>_<Name> (see input/fsh/README.md
// and the meta-wiki page "Namenskonventionen für FHIR-Ressourcen in der MII").
// This starter uses a neutral `Example…` name on purpose — rename it to the MII
// pattern for a real module (e.g. `MII_PR_Person_Patient`). The template's CI
// self-check does NOT rewrite FSH, so the names here are literal.
//
// Language (spec §3.4): Title and Description are authored in GERMAN, the IG's
// default language. Their English renderings are supplied additively by the
// translation supplement input/translations/en/StructureDefinition-example-patient.po
// (StructureDefinition is in the toolchain's translatable set).
// ─────────────────────────────────────────────────────────────────────────────
Profile: ExamplePatient
Parent: Patient
Id: example-patient
Title: "Beispiel-Patient (Vorlage)"
Description: "Minimales Beispielprofil, das nur mit der Vorlage ausgeliefert wird, damit ein neu erstelltes Modul sofort eine gerenderte IG erzeugt. Kein MII-Artefakt — ersetzen Sie es durch die Profile Ihres Moduls."
// Keep at least one identifying element required + Must-Support so the profile
// is meaningful; add your module's real constraints below.
* name 1..* MS
* name.family 1..1 MS
* birthDate 0..1 MS
* gender 0..1 MS
