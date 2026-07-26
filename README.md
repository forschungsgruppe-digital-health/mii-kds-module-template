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
> with. Forgot? Run `bash tools/first-run-bootstrap.sh --apply` — it creates
> `dev`, protects both branches, and removes files that belong to the template
> but not to your module.

## Quickstart

1. **Create your repo** — *Use this template*, tick *Include all branches*.
2. **Open it in the dev container** (VS Code → *Reopen in Container*). It brings
   Java, Node, SUSHI, Jekyll and Graphviz.
   → [details](docs/recipes/first-build-in-devcontainer.md)
3. **Fill in your module's values** — replace every `{{PLACEHOLDER}}` in
   `sushi-config.yaml`; each one is explained in a comment right there.
4. **Write a profile** in `input/fsh/` (an example is included to copy) and
   replace the German starter pages in `input/pagecontent/`.
   → [add a profile](docs/recipes/add-a-profile.md)
5. **Build it**: `sushi .`, then run the IG Publisher, then read `output/qa.html`.
   Or just push a branch — CI builds it and comments the preview URL on your PR.
6. **Release** with CalVer via the MII Module Release Workflow.
   → [cut a release](docs/recipes/cut-a-release.md)

The full walkthrough is [create a new module](docs/recipes/create-a-new-module.md).
Unfamiliar terms are in the [glossary](docs/glossary.md).

## Where things live

| Path | What it is |
| --- | --- |
| `sushi-config.yaml` | Your module's metadata — the file you edit first |
| `input/fsh/` | Profiles, extensions, value sets (FHIR Shorthand) |
| `input/pagecontent/` | The narrative pages, German by default |
| `input/translations/en/` | English translations of pages, menu and resources |
| `input/includes/menu.xml` | The navigation menu (one file per language) |
| `ig-template/` | The MII IG template, mirrored automatically — don't edit |
| `docs/` | Guides and step-by-step recipes |
| `tools/`, `scripts/` | Helper scripts (first-run bootstrap, template sync, …) |
| `.github/workflows/` | CI: build, preview, validation, release |

## Documentation

- [Recipes](docs/recipes/) — step-by-step for the common tasks
- [Glossary](docs/glossary.md) · [Concepts](docs/concepts.md) — the vocabulary and the ideas behind it
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
