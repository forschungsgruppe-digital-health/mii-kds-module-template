# Terminology - MII Implementation Guide Module Template v2026.0.0

* [**Table of Contents**](toc.md)
* **Terminology**

## Terminology

This page describes the ValueSets and CodeSystems used in the **Module Template** module. For general guidance on using codes, see [FHIR Terminology](http://hl7.org/fhir/R4/terminologies.html).

**Important:** CodeSystem resources of external terminologies (e.g. ICD-10-GM, OPS, SNOMED CT) are **not** published in this module; they are obtained from the MII terminology service (SU-TermServ): [https://mii-termserv.de/](https://mii-termserv.de/).

**Expansions:** ValueSet expansions MUST be created via a FHIR terminology server for validation purposes. This build uses SU-TermServ if the client certificate is configured, otherwise the public HL7 server `tx.fhir.org` (in which case some MII-specific ValueSets may not expand completely).

> [TODO: If your module uses SNOMED CT, state the edition/version used. List the module's own ValueSets/CodeSystems, or refer to the automatically generated artifact list.]

