# Project status — PROTOTYPE (not yet an MII-endorsed artifact)

**Status as of 2026-07-26: PROTOTYPE.** This repository and its companion IG template
[`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
are prototypes, to be discussed in the **MII Taskforce Kerndatensatz (TF KDS)**.
They are fully functional and released (`v0.2.0`), but their governance is not
settled yet.

## What this means in practice

| Question | Current answer |
| --- | --- |
| Is the template registered in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)? | **No — and it must not be**, until the maintainer explicitly says so. |
| Is the package published to a FHIR package registry? | **No.** Modules consume the template as a vendored folder (`ig-template/`, kept current automatically — see `tools/sync-ig-template.sh` in this repo). |
| Will these repos move to another GitHub organisation? | **Not without an explicit decision.** Do not move or transfer them. |
| Who owns the template after 2026? | **The MII**, for now. Revisit with the TF KDS. |

> **Why registration is deliberately deferred:** an `ig-registry` entry and a
> package-registry release are *public, hard-to-retract commitments* that imply
> an owner and a support promise. While the approach is still a proposal to the
> TF KDS, keeping it unregistered lets the design change freely without stranding
> consumers or squatting an identifier.

## What is NOT blocked by this

Everything about developing and reviewing the templates works today: builds,
bilingual previews, releases (SemVer here, CalVer in modules), the vendored
template flow, and creating a module from the module template.

## When the status changes

Only on an explicit decision by the maintainer. At that point:

1. Register the template in `FHIR/ig-registry` (`templates.json`) and name the
   owner (project Gate D).
2. Publish the package so modules can switch from the vendored folder to a
   pinned package reference (see
   `docs/recipes/switch-template-to-published.md`).
3. Update this file.
