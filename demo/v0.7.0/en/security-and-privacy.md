# Security and Privacy - MII Implementation Guide Module Template v2027.0.0-template.0.7.0

* [**Table of Contents**](toc.md)
* **Security and Privacy**

## Security and Privacy

### Security and Privacy

This section addresses security and privacy experts. General requirements are in the FHIR core specification — [Security & Privacy Module](https://build.fhir.org/secpriv-module.html) and the [security checklist](https://build.fhir.org/security.html). This page does not repeat them; it links the MII-wide data protection framework and states what is **specific to this module**.

#### 1. The MII data protection concept

The [overarching data protection concept of the Medical Informatics Initiative](https://www.medizininformatik-initiative.de/en/data-protection-concept) governs how patient data may be processed for research across the MII: it covers the legal basis (the MII Broad Consent), the roles of the Data Integration Centers and Use & Access Committees, and the cross-site application scenarios (feasibility queries, distributed analyses, data and biosample provision). Everything this module specifies operates inside that framework — this guide adds no processing purpose of its own.

#### 2. De-identification, minimisation and pseudonymisation (DIMP)

How data leaving a Data Integration Center is de-identified in practice is specified by [DIMP (De-Identification — Minimisation — Pseudonymisation)](https://medizininformatik-initiative.github.io/dataportal/data-node/DIMP.html) in the MII data portal documentation: direct identifiers are removed, data elements not needed by the approved project are dropped, and identifying values are replaced by project-specific pseudonyms (FHIR Pseudonymizer configuration). The profiles of this module describe data **before** DIMP is applied; which elements survive a concrete data release is decided per project by the DIMP configuration, not by this guide.

#### 3. Module-specific aspects

This is the module's own contribution: the security and privacy properties that follow from the **kind of data this module carries**. Examples from other KDS modules of what belongs here:

* **Document** module — documents are embedded Base64-encoded (`DocumentReference.content.attachment.data`); an embedded document can contain arbitrary identifying information (letterheads, free text, scanned signatures) that profile-level pseudonymisation does not reach, so document content needs its own de-identification step before provision.
* **Person** module — the patient identifiers are pseudonyms from the trusted third party; systems must not let record linkage re-identify a person, and the pseudonym's scope (site-wide vs project-specific) must be respected when data is combined.

> [TODO: State your module's specific aspects — the data categories it carries and their sensitivity, risks that profile-level pseudonymisation does not cover, and any security- or privacy-related SHALL/SHOULD/MAY requirements this module places on implementers, each with the risk it addresses. Name residual risks that must be handled in system design, deployment or policy.]

