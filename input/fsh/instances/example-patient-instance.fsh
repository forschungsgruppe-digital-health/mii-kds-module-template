// STARTER EXAMPLE INSTANCE — replace with your module's real examples.
//
// A concrete example of the ExamplePatient profile so the IG's "Examples" page
// and the profile page render a worked instance. Uses an obviously artificial
// synthetic name (never put real or realistic patient data in the repo — see
// the project data rules). `Usage: #example` marks it as an example, not a
// conformance resource.
Instance: ExamplePatientInstance
InstanceOf: ExamplePatient
Usage: #example
Title: "Beispiel: Max Mustermann-Testpatient"
Description: "Synthetisches Beispiel für das Beispiel-Patient-Profil. Rein künstliche Daten."
* name.family = "Mustermann-Testpatient"
* name.given = "Max"
* gender = #male
* birthDate = "1990-01-01"
