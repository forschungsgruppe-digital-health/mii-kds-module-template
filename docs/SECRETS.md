# Secrets & variables — enabling the gated features (F + G)

A module built from this template builds and previews **without any secrets** (it
uses the public HL7 terminology server; announcements skip cleanly). This page
lists the optional secrets that turn on the human-gated features, with the exact
commands. The workflows are already wired — adding the secret is the only step.
Replace `<owner>/<module-repo>` with your module repository.

```sh
gh secret set NAME --repo <owner>/<module-repo> < value.txt
gh variable set NAME --repo <owner>/<module-repo> --body "value"
```

## Gate F — SU-TermServ terminology server (optional)

The IG build/preview and `go-publish` resolve terminology against the public HL7
server `tx.fhir.org` by default. To use the **MII SU-TermServ**
(`ontoserver.mii-termserv.de`), which fully expands MII value sets (SNOMED CT,
ICD-10-GM, OPS, …), supply the client certificate. It is client-certificate-gated
and granted only to entities in Germany.

The certificate is used by **two independent consumers**, which read it under
**different secret names** — set the SAME certificate under BOTH sets of names:

**1. The IG build / preview / go-publish** (this template's workflows) read
`SU_TERMSERV_CLIENT_*`. Values are **base64-encoded** (decoded with `base64 -d`):

```sh
base64 -i client-cert.pem          | gh secret set SU_TERMSERV_CLIENT_CERT     --repo <owner>/<module-repo>
base64 -i client-key-encrypted.key | gh secret set SU_TERMSERV_CLIENT_KEY      --repo <owner>/<module-repo>
printf '%s' 'THE_KEY_PASSWORD'     | gh secret set SU_TERMSERV_CLIENT_PASSWORD --repo <owner>/<module-repo>
```

**2. The MII reusable validation workflow** (`validation.yml`, the Java validator)
declares the secret names `CDS_DEV_CLIENT_CERT` / `_KEY` / `_CERT_PASSWORD` (the
`kerndatensatz-basis` convention). **You do not need to set those** — this repo
maps its own `SU_TERMSERV_CLIENT_*` secrets onto them at the call site in
`validation.yml`, so the certificate above is the only copy you store.

> **Why the mapping instead of two copies:** the same SU-TermServ client
> certificate is needed by this repo's own build (`ig-publisher.yml`,
> `go-publish.yml`, spec §2.10) and by the external, pinned MII reusable
> workflow, which hard-codes different names. Mapping them at the call site keeps
> **one certificate under one secret name** for the whole repository. If your
> organisation already provisions `CDS_DEV_CLIENT_*` centrally, replace that
> block in `validation.yml` with `secrets: inherit` instead.
> The certificate is optional either way: without it the build uses the
> `tx.fhir.org` fallback and validation runs without SU-TermServ.

The `.NET` Simplifier QC job (also part of `validation.yml`) additionally reads:

```sh
printf '%s' 'SIMPLIFIER_USER' | gh secret set SIMPLIFIER_USERNAME --repo <owner>/<module-repo>
printf '%s' 'SIMPLIFIER_PASS' | gh secret set SIMPLIFIER_PASSWORD --repo <owner>/<module-repo>
```

## Gate G — Zulip release announcement (optional)

On a **CalVer** module release, `module-release.yml` announces to the **MII Zulip**
(`mii.zulipchat.com`, stream `MII-Kerndatensatz`, topic *Releases* — distinct from
the template repos' *Template Releases*). It skips with a `::notice` if absent.

```sh
printf '%s' 'THE_MII_ZULIP_BOT_API_KEY' | gh secret set ZULIP_API_KEY --repo <owner>/<module-repo>
```

Bot account: `kds-github-bot@mii.zulipchat.com`. The public FHIR Zulip stays off
unless you set `ANNOUNCE_PUBLIC_ZULIP=true` **and** `FHIR_ZULIP_API_KEY` (a
`chat.fhir.org` bot).

## CI toggles (variables — all default correctly when unset)

| Variable | Default (unset) | Effect |
| --- | --- | --- |
| `ENABLE_PREVIEW` | on | IG build + preview + cleanup |
| `ENABLE_VALIDATION` | on | MII reusable validation |
| `ENABLE_CONVENTION_CHECK` | on | metadata-contract + wiki-drift check |
| `ENABLE_MODULE_RELEASE` | on | CalVer release workflow |
| `ENABLE_ZULIP_ANNOUNCE` | on | MII Zulip announcement |
| `ANNOUNCE_PUBLIC_ZULIP` | off | public FHIR Zulip announcement |
| `ENABLE_DEPENDENCY_CHECK` | on | weekly version-drift check |
| `ENABLE_SECURITY_SCAN` | on | OSV + Trivy |
| `PAGES_ACTIONS_ENABLED` | (gh-pages push mode) | switch preview deploy to the Actions Pages path |

Production publication (`go-publish.yml`) always stays a **manual, gated**
`workflow_dispatch` with `publish:false` (dry run) by default — never automatic.
