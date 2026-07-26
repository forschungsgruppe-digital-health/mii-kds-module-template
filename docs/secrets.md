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

### Recommended: use the helper script

It validates the material **before** uploading anything — that the certificate is
a readable PEM and not expired, that the key decrypts with your password, and
that certificate and key belong together (matching modulus). Those mistakes
otherwise surface as an opaque TLS failure deep inside a CI run.

```sh
tools/set-su-termserv-secrets.sh --cert client-cert.pem --key client-key.pem \
  --repo <owner>/<your-module-repo>
# dry run — validate locally, upload nothing:
tools/set-su-termserv-secrets.sh --cert client-cert.pem --key client-key.pem --check-only
```

The key password is prompted interactively, so it never lands in your shell
history or the process list.

### Or set the three secrets by hand

The two files are **base64-encoded, single-line**; the key must be the
**encrypted** PEM (the workflow decrypts it with
`openssl rsa -passin env:SU_TERMSERV_CLIENT_PASSWORD`).

```sh
R=<owner>/<your-module-repo>
base64 < client-cert.pem | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_CERT     --repo "$R"
base64 < client-key.pem  | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_KEY      --repo "$R"
printf '%s' 'THE_KEY_PASSWORD'         | gh secret set SU_TERMSERV_CLIENT_PASSWORD --repo "$R"
```

> **Why single-line base64:** the workflow runs `echo "$SECRET" | base64 -d`.
> macOS `base64` wraps at 76 characters by default, which breaks that — hence
> `tr -d '\n'` (GNU `base64 -w0` is equivalent).

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

Bot account: `kds-github-bot@mii.zulipchat.com` by default; override it with the
`MII_ZULIP_BOT_EMAIL` variable if your bot differs.

The **public** FHIR Zulip (`chat.fhir.org`, stream `german/mi-initiative`) stays
off unless you set **all three**:

```sh
gh variable set ANNOUNCE_PUBLIC_ZULIP  --body 'true'                       --repo <owner>/<repo>
gh variable set FHIR_ZULIP_BOT_EMAIL   --body 'your-bot@chat.fhir.org'     --repo <owner>/<repo>
printf '%s' 'THE_CHAT_FHIR_ORG_BOT_API_KEY' | gh secret set FHIR_ZULIP_API_KEY --repo <owner>/<repo>
```

If the key or the bot address is missing, the job **skips with a notice** instead
of posting with an invalid sender. **No workflow file has to be edited to enable
either channel.**

## Verifying a gate after you enable it

Both gates are *wired and fall back safely*, but until the credential exists the
"enabled" code path has never executed. Verify each once, right after enabling:

**Gate F (SU-TermServ).** Push any branch (or re-run the IG build) and open the
log of the terminology step. Enabled and working looks like
`SU-TermServ client certificate present — starting a local client-cert nginx proxy`
followed by a green build; not configured looks like
`No SU-TermServ credential — falling back to the public HL7 terminology server`.
If the proxy fails to start, the step fails loudly rather than silently
mis-expanding value sets — re-check that the cert/key are **base64-encoded** and
that the key password is correct.

**Gate G (Zulip).** The announcement runs on a published release. To verify
without waiting for the next one, cut a throw-away pre-release in a scratch repo,
or check the job log of the most recent release run — it prints either the
delivered message or the explicit skip notice naming what is missing.

## CI toggles (variables — all default correctly when unset)

| Variable | Default (unset) | Effect |
| --- | --- | --- |
| `ENABLE_PREVIEW` | on | IG build + preview + cleanup |
| `ENABLE_VALIDATION` | on | MII reusable validation |
| `ENABLE_CONVENTION_CHECK` | on | metadata-contract + wiki-drift check |
| `ENABLE_MODULE_RELEASE` | on | CalVer release workflow |
| `ENABLE_ZULIP_ANNOUNCE` | on | MII Zulip announcement |
| `ANNOUNCE_PUBLIC_ZULIP` | off | public FHIR Zulip announcement |
| `FHIR_ZULIP_BOT_EMAIL` | unset | sender for the public FHIR Zulip; required for that channel |
| `MII_ZULIP_BOT_EMAIL` | `kds-github-bot@mii.zulipchat.com` | sender for the MII Zulip |
| `ENABLE_DEPENDENCY_CHECK` | on | weekly version-drift check |
| `ENABLE_SECURITY_SCAN` | on | OSV + Trivy |
| `PAGES_ACTIONS_ENABLED` | (gh-pages push mode) | switch preview deploy to the Actions Pages path |

Production publication (`go-publish.yml`) always stays a **manual, gated**
`workflow_dispatch` with `publish:false` (dry run) by default — never automatic.
