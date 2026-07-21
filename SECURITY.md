# Security Policy

## Reporting a vulnerability

Please report vulnerabilities **privately** via GitHub's private vulnerability
reporting: on this repository, go to the **Security** tab → **Report a
vulnerability**, or use this direct link:

<https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/security/advisories/new>

Do **not** open a public issue for a security problem.

> **Why private reporting:** a public issue discloses the problem before a fix
> exists. GitHub's private vulnerability reporting keeps the report between
> you and the maintainers until a fix is released, and is enabled for this
> repository.

If you cannot use GitHub, email <marcel.susky@tu-dresden.de> with a
description, reproduction steps, and the affected files/workflows.

## Scope

This is a template repository for FHIR Implementation Guide tooling. It
processes **no patient data**. In scope are, in particular:

- the CI/CD workflows in `.github/workflows/` (planned) — e.g. injection via
  untrusted inputs, excessive token permissions, unpinned actions;
- the scripts in `scripts/` (planned);
- the dev container definition in `.devcontainer/` (planned);
- supply-chain issues in pinned dependencies (SUSHI, IG Publisher, actions).

Vulnerabilities in a **module created from this template** should be reported
to that module's own repository; report them here as well if the root cause is
in the template.

## What to expect

- Acknowledgement of your report within 14 days.
- Coordinated disclosure: we ask you to keep the report private until a fix or
  mitigation is available.
