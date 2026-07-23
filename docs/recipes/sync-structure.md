# Recipe: sync the module structure with the IG template (Option B)

**Goal.** Keep this module's menu + page set aligned with the **canonical MII
module page structure** owned by the IG template
[`ig-template-mii-kds`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds)
(the `structure/` folder there).

> **Why this recipe exists:** under Option B the IG template is the single source
> of truth for *which pages an MII module has and how they are navigated*. The IG
> Publisher cannot inject a template menu automatically (it reads the menu only
> from this module's own `sushi-config.yaml` `menu:` / `input/includes/menu.xml`),
> so this module carries a **mirror** of the canonical structure and re-syncs it
> when the template's structure changes.

## When to run

- When you create the module (the mirror is already in `sushi-config.yaml`).
- When the IG template releases a new `structure/` (the dependency checker / a
  template-sync notice will flag it).

## Steps

1. Open the template's canonical structure:
   [`structure/menu.yaml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/structure/menu.yaml)
   and [`structure/pages.yaml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/structure/pages.yaml).
2. Compare them with the `menu:` and `pages:` blocks in this module's
   `sushi-config.yaml` (both are marked with a `# CANONICAL STRUCTURE (mirror …)`
   comment).
3. Apply any additions/removals/renames from the canonical structure to your
   `menu:` and `pages:` blocks.
4. For every page **added** to the structure, create a matching
   `input/pagecontent/<name>.md` (content is yours to write); for every page
   **removed**, delete the corresponding `.md`.
5. Rebuild (`sushi .` + the preview) and confirm the nav matches.

## Expected result

Your module's navigation and page set match the canonical MII module structure;
only the page **content** differs (that is yours).

> **Content vs structure:** you own the page *content* (the `.md` text). The
> *structure* (which pages, the menu) is the template's — mirror it, don't
> diverge, so all MII modules stay consistent.
