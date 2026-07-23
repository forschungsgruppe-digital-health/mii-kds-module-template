# Recipe: cut a release (module — CalVer)

**Goal.** Release a version of your **module** using the MII **CalVer** Module
Release Workflow. This is **not** Release Please — modules never use Release Please.

**Prerequisites.** Your module builds green on `main`. See [RELEASE.md](../RELEASE.md)
for the step-by-step mapping to the MII wiki's Module Release Workflow.

## Steps

1. **Pick the CalVer version** `YYYY.n.n` per the MII scheme (e.g. `2026.0.0`; the
   first number is the release-sequence year). Confirm against the
   [Module Release Workflow wiki page](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow).
2. **Bump the version** in `sushi-config.yaml` (`version:`) and the dates
   (`date:`, and the `{{RELEASE_DATE}}`/approval fields), plus
   `publication-request.json`. Do this on a `feature/*` branch → PR → `dev`.
3. **Promote `dev → main`** with a merge commit.
4. **Tag** the release on `main`: `git tag v2026.0.0 && git push origin v2026.0.0`
   (the tag pattern the `module-release.yml` workflow listens for).
5. `module-release.yml` then **builds**, creates the **GitHub Release**, announces it
   to the MII Zulip (topic *Releases*), and **hands off to the gated `go-publish`**.
6. **Production publication is a separate, human step (Gate E):** run `go-publish.yml`
   manually via *workflow_dispatch*. It defaults to `publish:false` (a full dry run);
   only a human sets `publish:true` for the real publication.

## Expected result

A `v2026.0.0` tag + GitHub Release, a Zulip announcement (if the key is set), and a
dry-run publication ready for a human to promote. **No SemVer tag, no Release Please.**

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Workflow did not trigger | Tag does not match `vYYYY.n.n` | Use the CalVer tag pattern |
| A SemVer release PR appeared | Release Please was not removed | Run the first-run bootstrap; `grep -ri release-please` must be clean |
| `go-publish` published for real unexpectedly | `publish:true` was set | Keep it `false`; only a human sets it true, once, deliberately |
| Zulip not posted | `ZULIP_API_KEY` absent | Expected — the job skips with a notice; add the secret to enable |

> **Why CalVer and not SemVer here:** the module and the template tooling have
> different release authorities. The MII CalVer process is the module's single source
> of release truth; adding Release Please would produce conflicting tags. See
> [WORKFLOWS.md](../WORKFLOWS.md) and [RELEASE.md](../RELEASE.md).
