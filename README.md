# mii-kds-module-template

A **GitHub template repository** for building an **MII Kerndatensatz (KDS) module
Implementation Guide**. Click *Use this template* and you get a working IG project
— FHIR tooling, CI, bilingual previews and the MII release process already wired
up — so you can start with profiles and content instead of setup.

The MII look comes from the separate IG template
[`ig-template-mii-kds`](https://github.com/medizininformatik-initiative/ig-template-mii-kds),
which this scaffold references (and keeps up to date automatically).

> **Status: prototype.** Usable and released, but pending discussion in the MII
> Taskforce Kerndatensatz — see [docs/project-status.md](docs/project-status.md).

> **⚠️ When you click *Use this template*, tick “Include all branches”.**
> Otherwise you get `main` only, without the `dev` branch this scaffold works
> with. The first-run bootstrap in step 2 creates `dev` for you if you forgot.

## Quickstart

1. **Create your repo** — *Use this template*, tick *Include all branches*.
2. **Run the first-run bootstrap** — `bash tools/first-run-bootstrap.sh` (dry
   run), then `--apply`. It protects both branches and removes the template's
   own SemVer release automation, which a CalVer module must not carry. Run it
   even if you ticked *Include all branches*.
3. **Open it in the dev container** (VS Code → *Reopen in Container*). It brings
   Java, Node, SUSHI, Jekyll and Graphviz.
   → [details](docs/recipes/first-build-in-devcontainer.md)
4. **Fill in your module's values** — start in `sushi-config.yaml`, whose header
   lists all 19 placeholders and the files each one occurs in, then work through
   `ig.ini`, `publication-request.json`, `.github/workflows/go-publish.yml`,
   `qc/custom.rules.yaml`, `tests/`, the pages and the FSH sources.
   [Create a new module](docs/recipes/create-a-new-module.md) step 3 ends with
   the `grep` that proves you missed none.
5. **Write a profile** in `input/fsh/` (an example is included to copy) and
   replace the English starter pages in `input/pagecontent/` (and their German
   counterparts in `input/translations/de/pagecontent/`).
   → [add a profile](docs/recipes/add-a-profile.md)
6. **Build it**: `sushi .`, then run the IG Publisher, then read `output/qa.html`.
   Or just push a branch — CI builds it and comments the preview URL on your PR.
7. **Release** with CalVer via the MII Module Release Workflow.
   → [cut a release](docs/recipes/cut-a-release.md)

The full walkthrough is [create a new module](docs/recipes/create-a-new-module.md).
Unfamiliar terms are in the [glossary](docs/glossary.md).

## Where things live

| Path | What it is |
| --- | --- |
| `sushi-config.yaml` | Your module's metadata — the file you edit first |
| `input/fsh/` | Profiles, extensions, value sets (FHIR Shorthand) |
| `input/pagecontent/` | The narrative pages — English, the IG's default language |
| `input/translations/de/` | German translations of pages, menu and resources |
| `input/includes/menu.xml` | The navigation menu (one file per language) |
| `qc/custom.rules.yaml`, `advisor.json` | What the MII reusable validation reads: naming-convention rules and tolerated validator messages |
| `ig-template/` | The MII IG template, mirrored automatically — don't edit |
| `docs/` | Guides and step-by-step recipes |
| `tools/`, `scripts/` | Helper scripts (first-run bootstrap, template sync, …) |
| `.github/workflows/` | CI: build, preview, validation, release |

## Documentation

- [Recipes](docs/recipes/) — step-by-step for the common tasks, including authoring guidance:
  [render profiles](docs/recipes/render-profiles.md) ·
  [describe examples](docs/recipes/describe-examples.md) ·
  [UML diagrams](docs/recipes/add-uml-diagrams.md) ·
  [information models](docs/recipes/model-information-models.md)
- [Glossary](docs/glossary.md) · [Concepts](docs/concepts.md) — the vocabulary and the ideas behind it
- [Page structure](docs/page-structure.md) — who owns the page set and the menu (your module, not the IG template)
- [Workflows](docs/workflows.md) — what the CI does, and how releases work
- [IG best-practices checklist](docs/ig-best-practices-checklist.md) — the official HL7 practices, and what you still need to fill in
- [Secrets](docs/secrets.md) — optional: MII terminology server, release announcements

## Getting help

- **FHIR and profiling questions** — HL7 FHIR Zulip <https://chat.fhir.org>,
  stream `german/mi-initiative`. Free to join; this is where the MII KDS IGs
  point their readers.
- **MII coordination** — MII Zulip <https://mii.zulipchat.com/>, stream
  `MII-Kerndatensatz`. Access via the MII Geschäftsstelle
  (<office@medizininformatik-initiative.de>).
- **Problems with this template** — open an [issue](../../issues).

## Licence

[CC-BY-4.0](LICENSE), matching MII IG content.
