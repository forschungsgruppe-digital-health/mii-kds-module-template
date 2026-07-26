#!/usr/bin/env bash
# set-su-termserv-secrets.sh — install the SU-TermServ client certificate as
# repository secrets (Gate F), with validation before anything is uploaded.
#
# WHY THIS EXISTS
#   The build routes terminology to the MII terminology server (SU-TermServ) when
#   a client certificate is configured, and otherwise falls back to the public
#   HL7 server. Getting the encoding or the key password wrong fails deep inside
#   a CI run, so this script checks the material locally FIRST and only then
#   uploads it.
#
#   The certificate never leaves your machine except as a GitHub secret: it is
#   base64-encoded and sent straight to the GitHub secrets API by `gh`.
#
# USAGE
#   tools/set-su-termserv-secrets.sh --cert <cert.pem> --key <key.pem> [--repo <owner>/<your-module-repo>]
#   tools/set-su-termserv-secrets.sh --cert … --key … --check-only
#
#   The key password is read interactively (never passed as an argument, so it
#   does not land in your shell history or the process list).
#
# WHAT IT SETS
#   SU_TERMSERV_CLIENT_CERT      base64 of the client certificate (PEM)
#   SU_TERMSERV_CLIENT_KEY       base64 of the ENCRYPTED private key (PEM)
#   SU_TERMSERV_CLIENT_PASSWORD  the key password, in plain text
set -euo pipefail

CERT=""; KEY=""; REPO=""; CHECK_ONLY="false"
while [ $# -gt 0 ]; do
  case "$1" in
    --cert) CERT="${2:?--cert needs a file}"; shift 2 ;;
    --key)  KEY="${2:?--key needs a file}";   shift 2 ;;
    --repo) REPO="${2:?--repo needs owner/repo}"; shift 2 ;;
    --check-only) CHECK_ONLY="true"; shift ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

[ -n "${CERT}" ] && [ -n "${KEY}" ] || { echo "ERROR: --cert and --key are required. See --help." >&2; exit 2; }
[ -r "${CERT}" ] || { echo "ERROR: cannot read certificate file: ${CERT}" >&2; exit 1; }
[ -r "${KEY}"  ] || { echo "ERROR: cannot read key file: ${KEY}" >&2; exit 1; }

command -v openssl >/dev/null || { echo "ERROR: openssl not found." >&2; exit 1; }

echo "== 1. Checking the certificate =="
openssl x509 -in "${CERT}" -noout -subject -issuer -dates \
  || { echo "ERROR: not a readable PEM certificate: ${CERT}" >&2; exit 1; }
# Expiry check — an expired cert fails the TLS handshake with an unhelpful error.
if ! openssl x509 -in "${CERT}" -noout -checkend 0 >/dev/null; then
  echo "ERROR: this certificate has EXPIRED." >&2; exit 1
fi
openssl x509 -in "${CERT}" -noout -checkend 2592000 >/dev/null \
  || echo "WARNING: the certificate expires within 30 days."

echo
echo "== 2. Checking the private key (password prompt) =="
# Read the password interactively; keep it out of argv and history.
printf 'SU-TermServ key password: ' >&2
read -rs KEYPASS; echo >&2
export KEYPASS
if ! openssl rsa -in "${KEY}" -passin env:KEYPASS -noout 2>/dev/null; then
  echo "ERROR: the key could not be decrypted — wrong password, or the key is not an encrypted PEM RSA key." >&2
  echo "       The workflow runs exactly: openssl rsa -in <key> -passin env:SU_TERMSERV_CLIENT_PASSWORD" >&2
  unset KEYPASS; exit 1
fi
echo "Key decrypts successfully."

echo
echo "== 3. Checking that the certificate and key belong together =="
cert_mod="$(openssl x509 -in "${CERT}" -noout -modulus | openssl md5)"
key_mod="$(openssl rsa -in "${KEY}" -passin env:KEYPASS -noout -modulus 2>/dev/null | openssl md5)"
if [ "${cert_mod}" != "${key_mod}" ]; then
  echo "ERROR: certificate and key do NOT match (different modulus)." >&2
  unset KEYPASS; exit 1
fi
echo "Certificate and key match."

if [ "${CHECK_ONLY}" = "true" ]; then
  echo; echo "All checks passed. Re-run without --check-only to upload the secrets."
  unset KEYPASS; exit 0
fi

command -v gh >/dev/null || { echo "ERROR: the GitHub CLI (gh) is required to set secrets." >&2; unset KEYPASS; exit 1; }
REPO_ARGS=()
[ -n "${REPO}" ] && REPO_ARGS=(--repo "${REPO}")

echo
echo "== 4. Uploading the secrets${REPO:+ to ${REPO}} =="
# NOTE: base64 must be single-line; the workflow does `echo "$SECRET" | base64 -d`.
base64 < "${CERT}" | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_CERT "${REPO_ARGS[@]}"
base64 < "${KEY}"  | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_KEY  "${REPO_ARGS[@]}"
printf '%s' "${KEYPASS}" | gh secret set SU_TERMSERV_CLIENT_PASSWORD "${REPO_ARGS[@]}"
unset KEYPASS

echo
echo "Done. Gate F is now configured."
echo "Verify it: push any branch (or re-run the IG build) and check the terminology step's log."
echo "  enabled  -> 'SU-TermServ client certificate present — starting a local client-cert nginx proxy'"
echo "  fallback -> 'No SU-TermServ credential — falling back to the public HL7 terminology server'"
