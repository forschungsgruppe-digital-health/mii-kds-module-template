# Recipe: information models — Logical Models vs profiles

**Goal.** Decide which artifact expresses your module's data model, and put it in
the right place.

## The distinction

| | **Logical Model** | **Profile (StructureDefinition on a resource)** |
| --- | --- | --- |
| Expresses | the *domain* data set — what the clinical/technical content is | how that content is represented in a FHIR resource |
| Independent of FHIR resources? | yes | no — it constrains a specific resource |
| Validates instances? | no | yes |
| Typical MII use | the module's data set as agreed with the domain experts | the binding of that data set to `Patient`, `Condition`, … |

A module usually needs **both**: the logical model is what domain experts review
and sign off, the profiles are what implementers build against.

## Steps

1. Put logical models in `input/fsh/logicals/`, named per the MII convention
   (`MII_LM_<Module>`):

   ```fsh
   Logical: MII_LM_{{MODULE_NAME}}
   Title: "MII LM {{MODULE_TITLE}}"
   Description: "Logisches Modell des Moduls …"
   * element 1..1 string "Kurzbeschreibung"
   ```

2. Describe the elements in prose on
   [`datasets-and-descriptions.md`](../../input/pagecontent/datasets-and-descriptions.md) —
   that page exists for exactly this and is where reviewers look.
3. Link model to profiles: say on the logical-models page which profile realises
   which part of the model, so a reader can cross over.
4. If you draw the model, see [add UML diagrams](add-uml-diagrams.md).

## When NOT to add a logical model

If your module is a thin binding of an existing, already-agreed data set, a
logical model duplicating the profiles adds maintenance without adding meaning.
The best practices warn explicitly that every artifact must be maintained for
years — ship one only if it is reviewed and used.

## Expected result

`logical-models.md` lists the module's models, `datasets-and-descriptions.md`
explains the elements in domain language, and profiles are traceable to the model.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| The logical model does not appear | Wrong folder, or missing `Logical:` keyword | Put it in `input/fsh/logicals/` and check the FSH keyword |
| Model and profiles drift apart | They are maintained separately with no cross-links | State the mapping on the logical-models page and review both together at release |
| Reviewers cannot follow the model | Only the generated table exists | Write the domain description on `datasets-and-descriptions.md` |
