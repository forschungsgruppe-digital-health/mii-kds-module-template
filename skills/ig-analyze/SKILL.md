---
name: ig-analyze
description: >-
  Measures one or more FHIR Implementation Guides (read-only) and produces a
  machine- and human-readable statistics report — for general quality review of
  a module IG and for the objective comparison of several IGs (scope,
  complexity, content hygiene, linguistics, duplication, maturity, risk). It
  builds and changes nothing. Activate when a module IG should be reviewed or
  measured, or when several IGs should be compared side by side.
license: CC-BY-4.0
---

# ig-analyze — read-only IG measurement, QA and comparison

Measures a FHIR IG objectively and reports the numbers as JSON (for machines)
and Markdown (for people). Use it for **general QA of a module IG** (what is in
it, is it clean, how mature is it) and for the **objective comparison of
several IGs**. It is strictly read-only: it never builds, changes, or publishes
anything.

> **Carried over from the FGDH sample IG.** This skill is adapted from the
> `ig-analyze` skill of
> [`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell)
> (CC-BY-4.0). The framing here is general QA and module comparison — not
> migration scoping. See the honesty note at the end about the report wording
> the underlying tool still carries from its origin.

## When to activate

- **Review / QA of a module IG** — get an objective picture of scope,
  complexity, content hygiene (duplicates, unused files, stub pages),
  linguistics, and maturity before a review or a release.
- **Compare several IGs** — measure two or more IGs with the same yardstick
  (for example this module against `kerndatensatz-basis`) to see where they
  differ.
- **Track a module over time** — the JSON output has a fixed schema, so a
  series of runs can be diffed to show how a module grows between releases.

Read-only. It complements the convention check (`wiki-consistency-check`): that
one checks conventions against the wiki and the metadata contract; this one
measures the IG and its content.

## Input and modes (`tools/ig-stats.py`)

**Input = one or more FHIR IGs, given as a path OR a URL.** `run` is the main
entry point and resolves each input itself (local path, git URL → shallow
clone, package `.tgz` → download with reduced analysis):

- `run <input…> [-o OUTDIR] [--label a,b]` — one report per IG **plus, for ≥2
  IGs, an automatic comparison report** (`compare-report.md`).
- `analyze <ig-dir> [-o stats.json]` — single measurement → `ig-stats.json`
  (power users).
- `report <stats.json> [-o report.md]` / `compare <stats.json…> [-o compare.md]`.

**Static vs. full/reduced:** the default is **static** (sushi-config /
package.json, FSH counts, narrative, directives, dependencies, linguistics,
duplication, hygiene) — fast, no build. A pure package source (`.tgz`) yields a
**reduced** analysis (generated resources only). Build metrics (`qa.json`:
errors / warnings / broken links, validation) are marked *Build* in the catalog
and stay empty/`null` in static mode.

## What is measured

A full, **hand-extensible** parameter catalog (groups **A–N**, each metric with
its source and its use V=comparison / A=effort / S=strategy / P=planning /
R=risk): `references/metrics-catalog.md`. Besides scope / complexity it covers
**linguistic** metrics, **duplication** and **unused files** (J), **maturity &
release** (K), **strategy / lock-in / future-proofing** (L), **planning** (M)
and **risk & compliance** (N). Heuristics are marked as such; values that
cannot be derived statically stay `null` (never guessed). The output schema is
`references/ig-stats-schema.json`. Plain-language texts, directive patterns,
glossary and **metric explanations** (self-contained, neutral) live in
`references/report-content.json`.

## Reporting

- **Machine-readable:** `ig-stats.json` per IG (fixed schema) — for
  aggregation, diff over time (CI trending) and comparison.
- **Human-readable:** a Markdown report per IG plus a comparison report,
  **GitHub-centric** (`<div align="center">`), with **coloured Mermaid** charts
  (pie / quadrant, no JavaScript), sorted **descending**. The comparison report
  additionally aggregates a **Σ total** (scope + effort) and shows
  **cross-IG consolidation**, using **normalised** metrics. Every report carries
  a **metric explanation** in its appendix.
- **Neutral & self-contained:** the report references **no** other repo skills
  or files; all recommendations are general IG-Publisher knowledge.

## Binding guardrails

- **Read-only.** Never change the analysed IG; never force a build.
- **Estimates as a range with assumptions**, never a point value. Factors are
  uncalibrated (`TODO:REVIEW`) — the value is mostly **relative** (IG-A vs.
  IG-B).
- **Fair comparison** only via **normalised** metrics (size varies).
- No fact invention; a missing input → field `null`, never a guess.

## Honesty note about the tool's report wording

The **numeric measurements** the tool produces (counts, complexity, hygiene,
linguistics, duplication, maturity, strategy, risk) are general-purpose and
migration-neutral — that is the QA core this skill relies on.

The tool (`tools/ig-stats.py`) is carried over verbatim from the sample IG. Its
**effort-estimation view** and some report section headings are still worded as
a "migration" scoping (they estimate the effort to move an IG onto the HL7 IG
Publisher toolchain) and its report prose is in **German**. Treat that
effort/scoping section as an **optional** view; for general module QA and
comparison, read the measurement sections. A future change may neutralise the
wording — until then this note is the ground truth, so no one mistakes the
inherited framing for the skill's purpose.

## References

- `references/metrics-catalog.md` — the parameter catalog (extensible SSOT).
- `references/ig-stats-schema.json` — JSON schema of `ig-stats.json`.
- `references/report-content.json` — plain-language texts, glossary, directive
  patterns (hand-editable, neutral, self-contained).
- `../../tools/ig-stats.py` — the analysis / report / comparison tool
  (`run` / `analyze` / `report` / `compare`).
