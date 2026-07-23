# Recipe: add a profile

**Goal.** Write your first FHIR profile in FSH, build it, and read the QA report.

**Prerequisites.** A module created from this template that already builds (see
[create-a-new-module.md](create-a-new-module.md)).

## Steps

1. Look at the shipped example `input/fsh/profiles/ExamplePatient.fsh` and its
   instance `input/fsh/instances/ExamplePatientInstance.fsh` — copy their shape.
2. Create your profile file under `input/fsh/profiles/`, named per the MII
   convention `MII_PR_<Module>_<Name>.fsh` (e.g. `MII_PR_Person_Patient.fsh`).
   A minimal profile:
   ```fsh
   Profile: MyPatient
   Parent: Patient
   Id: my-patient
   Title: "Mein Patient"
   Description: "…"
   * name 1..* MS
   * birthDate 1..1 MS
   ```
   > **Why start terminology-light:** a profile that binds to external code systems
   > needs a terminology server to validate. Cardinality + Must-Support constraints
   > build cleanly on the `tx.fhir.org` fallback — add coded bindings once your
   > terminology is set up.
3. Add at least one example `Instance:` (use an obviously **synthetic** name, e.g.
   `Max Mustermann-Testpatient` — never real or realistic patient data).
4. Add the profile's page to the nav if you want it prominent (the `Profiles and
   Extensions` page auto-lists artifacts).
5. Build: `sushi .` (fast — catches FSH errors), then the IG Publisher for the full
   QA. Or push a `feature/*` branch for the CI preview.
6. **Read the QA report:** open `output/qa.html`. It lists errors (must fix),
   warnings (review), and information. Aim for **0 errors**.

## Expected result

Your profile appears on the IG's "Profiles and Extensions" page with a rendered
structure, and your example validates against it; `qa.html` shows 0 errors.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| SUSHI error "unknown parent" | Misspelled `Parent:` or a missing dependency | Check the resource/profile name and `sushi-config.yaml` dependencies |
| "Unable to resolve code system" | A coded binding needs a terminology server | Configure SU-TermServ, or drop the binding while prototyping |
| Example fails validation | The instance violates your own constraints | Fix the instance or relax the constraint |
| Profile not shown | Not compiled (wrong folder/extension) | It must be a `.fsh` file under `input/fsh/` |
