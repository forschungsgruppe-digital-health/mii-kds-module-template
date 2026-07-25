# `translations/` — German UI-string catalogs (vendored)

These are the **base template's own** German UI-string catalogs, vendored here
from [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) `main`
(CC0-1.0, the same licence as this template).

> **Why vendored:** this template pins `fhir2.base.template` to the fixed release
> **0.1.0** for reproducibility, and that release ships catalogs for
> `ar`/`es`/`fr`/`nl`/`pt`/`ru` — **but not `de`**. German was added upstream only
> *after* 0.1.0 was cut. Without a German catalog, every base-provided UI string
> (`site.data.stringsBase['de'][…]`) renders **blank** on the German default
> pages — visibly: the footer loses its copyright, package and generated-date
> lines, and other base chrome loses its labels.
>
> Adding the files here is additive: template files are layered base-then-child,
> so these new filenames supplement the base catalogs rather than replacing them.

**Upkeep:** when the pinned base is bumped to a release that ships `de` itself,
delete this folder — the base's own catalogs then apply. The scheduled dependency
checker watches `fhir2.base.template`, so that bump arrives as a reviewable PR.

Source files (unmodified copies):

- `stringsBase-de.po`
- `stringsArtifacts-de.po`
