// STARTER EXAMPLE INSTANCE — replace with your module's real examples.
//
// A concrete example of the ExamplePatient profile so the IG's "Examples" page
// and the profile page render a worked instance. Uses an obviously artificial
// synthetic name (never put real or realistic patient data in the repo — see
// the project data rules). `Usage: #example` marks it as an example, not a
// conformance resource.
//
// The three inserts are the MII example idiom (see input/fsh/rulesets/README.md):
//   TestDataLabel     — tags the resource meta.security with
//                       v3-ActReason#HTEST "test health data" so it can never be
//                       mistaken for real patient data. Put it on EVERY example.
//   CRMIPackageSource — records which package/version/canonical the example
//                       shipped in.
//   MetaProfile       — pins meta.profile to the VERSIONED canonical of the
//                       profile the example claims.
//
// Language: Title and Description are authored in ENGLISH (the IG's default
// language); German is added as a de-DE `translation` extension.
Instance: ExamplePatientInstance
InstanceOf: ExamplePatient
Usage: #example
Title: "Example: Max Mustermann-Testpatient"
Description: "Synthetic example for the Example Patient profile. Entirely artificial data."
* insert TestDataLabel
* insert CRMIPackageSource
* insert MetaProfile(https://www.medizininformatik-initiative.de/fhir/modul-{{MODULE_SLUG}}/StructureDefinition/example-patient)
* name.family = "Mustermann-Testpatient"
* name.given = "Max"
* gender = #male
* birthDate = "1990-01-01"
