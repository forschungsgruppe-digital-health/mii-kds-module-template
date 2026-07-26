# Page structure ownership — Option A (structure lives in the module template)

**Decision (Option A).** The MII module IG **page structure** — which pages exist
and the navigation `menu` — lives **here, in the module template**, alongside the
page content. The IG template (`ig-template-mii-kds`) is **presentation-only**
(header, footer, CSS, logo); it does not define or own the page set.

> **Why:** this is standard FHIR practice — a template provides *presentation*, an
> IG provides *content and structure*. It is also the simplest: everything a
> module needs is in one place, there is nothing to sync against another repo, and
> a module author edits the menu and pages directly. The module template already
> gives every new module the same starting structure, so consistency is preserved
> without cross-repo coupling.

**What this means in practice:**

- The `pages:` block in `sushi-config.yaml` and the menu files are owned and
  edited by the module. Add, remove, or rename pages freely for your module.
- The **menu** is maintained as `input/includes/menu.xml` (German, the default
  language) plus a translation at `input/translations/de/includes/menu.xml` (German) —
  not via the `menu:` property, which cannot be translated. Update both files
  and the `pages:` tree together.
- The IG template carries no `structure/` folder and no page set.
- There is no structure-sync step.

*(The alternative considered was Option B — the IG template owns a canonical
`structure/` that modules mirror + re-sync. It was set aside because the IG
Publisher cannot inject a template menu automatically, so Option B would add a
cross-repo sync burden for no rendered difference.)*
