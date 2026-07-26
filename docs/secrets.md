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

### What kind of certificate is required

SU-TermServ authenticates clients with **mutual TLS**. Verified against the live
server on 2026-07-26 (`openssl s_client` to `ontoserver.mii-termserv.de:443`):

- The server **requests** a client certificate and advertises the CAs it accepts.
- That list includes the **German academic PKI** — DFN-Verein (Global Issuing CA,
  Community Issuing/Root CA 2022), **GÉANT** (OV/EV/Personal, and
  `GEANT S/MIME RSA 1` / `GEANT TLS RSA 1` via HARICA), Sectigo/USERTrust,
  T-TeleSec — **and SU-TermServ's own CA** (`ca.mii-termserv.de`,
  `intermediate.ca.mii-termserv.de`).
- The certificate needs the **`TLS Web Client Authentication`** extended key
  usage.
- Without a client certificate the endpoint answers **HTTP 400**.

So a DFN/GÉANT institutional or function certificate works, as does one issued by
the SU-TermServ itself. Being issued by an accepted CA is necessary but not
automatically sufficient — the SU-TermServ still governs access; request it from
them (access is granted to entities in Germany).

> **Prefer a function/service certificate over a personal one.** A personal
> certificate identifies an individual and can usually also sign or encrypt their
> mail; its private key in CI secrets is an identity risk, and access breaks when
> that person leaves. Use a certificate issued for the service.

### Recommended: use the helper script

`tools/set-su-termserv-secrets.sh` validates everything **before** uploading, and
can prove the certificate against the live server first.

```sh
D=/path/to/certificate
R=<owner>/<your-module-repo>

# 1. Prove it works — validates locally AND does a real mTLS call. Uploads nothing.
tools/set-su-termserv-secrets.sh --p12 "$D/cert.p12" --password-file "$D/pw.txt" \
  --test --check-only

# 2. Upload
tools/set-su-termserv-secrets.sh --p12 "$D/cert.p12" --password-file "$D/pw.txt" \
  --repo "$R"
```

It accepts either a **PKCS#12 bundle** (`--p12`, the usual delivery format) or
separate PEM files (`--cert` + `--key`, key encrypted). Omit `--password-file` to
be prompted instead, so the password never reaches your shell history. It checks:
certificate readable and not expired (warning under 30 days), `clientAuth` EKU
present, key decrypts, and **certificate and key match** — then, with `--test`,
that the live server returns HTTP 200.

A successful run looks like:

```text
== 1. Certificate ==   subject=… issuer=… notAfter=…
   Extended Key Usage: includes TLS Web Client Authentication (required for mTLS)
== 2. Private key ==   Key decrypts with the given password.
== 3. Certificate and key belong together ==   Modulus matches.
== 4. Live check ==    HTTP 200 — the server accepted the certificate …
```

### Or set the three secrets by hand

The two files are **base64-encoded, single-line**; the key must be the
**encrypted** PEM (the workflow decrypts it with
`openssl rsa -passin env:SU_TERMSERV_CLIENT_PASSWORD`).

From a PKCS#12 bundle:

```sh
export PWV="$(tr -d '\r\n' < pw.txt)"          # never echoed
openssl pkcs12 -in cert.p12 -clcerts -nokeys -passin env:PWV | openssl x509 -out cert.pem
openssl pkcs12 -in cert.p12 -nocerts -passin env:PWV -passout env:PWV -out key-enc.pem

R=<owner>/<your-module-repo>
base64 < cert.pem    | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_CERT     --repo "$R"
base64 < key-enc.pem | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_KEY      --repo "$R"
printf '%s' "$PWV"                 | gh secret set SU_TERMSERV_CLIENT_PASSWORD --repo "$R"
rm -f cert.pem key-enc.pem; unset PWV
```

Three traps that each cost a failed CI run — all handled by the helper script:

| Trap | Symptom | Fix |
| --- | --- | --- |
| Multi-line base64 | The workflow's `echo "$SECRET" \| base64 -d` produces garbage | `tr -d '\n'` (GNU: `base64 -w0`) — macOS wraps at 76 chars |
| `-passin file:` **and** `-passout file:` on the same one-line file | `Error reading password from BIO` | Use `env:` for both — OpenSSL reads the *next* line for the second `file:` |
| A PKCS#12 with several key bags | Handshake fails with a key/cert mismatch | Extract the key whose **modulus matches the certificate** |

### Rotating or revoking

Re-run the helper with the new certificate — `gh secret set` overwrites. To turn
the integration off again, delete the three secrets; the build falls back to
`tx.fhir.org` on the next run with a `::notice`. Note the expiry date: an expired
certificate fails the handshake, so rotate before `notAfter`.

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
