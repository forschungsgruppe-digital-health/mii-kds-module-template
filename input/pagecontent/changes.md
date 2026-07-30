<!-- markdownlint-disable MD041 -->
<!-- Default-language (English) page. Structure ported from kerndatensatz-basis
     input/pagecontent/changes.md (branch main) — one section per version,
     newest first — and from the MII IG release-notes template
     (kerndatensatz-meta/implementation-guides/MedizininformatikInitiative-ImplementationGuide-Template/
     MII-IG-Modul--Modul/Release-notes.page.md), which prescribes Keep a Changelog.
     German mirror: input/translations/de/pagecontent/changes.md — both files
     must say the same thing.

     Maintenance rule: add a new `#### Version <x>` section on top for every
     release, in BOTH languages, as part of the release pull request. Never edit
     a released section afterwards. -->

### Changelog

This page records the changes between the released versions of the
**{{MODULE_TITLE}}** module, newest version first. It follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the MII calendar
versioning scheme described on the [Versioning](version-history.html) page.

Each version gets its own section with the release date and the changes grouped
by category:

* **Added** — new profiles, extensions, value sets, search parameters, pages.
* **Changed** — modified constraints, bindings, guidance or documentation.
* **Deprecated** — artifacts that still exist but should no longer be used.
* **Removed** — artifacts that were withdrawn.
* **Fixed** — corrections of defects.
* **Security** — changes with a security or data-protection impact.

Leave out the categories with nothing to report. Where a change is driven by an
issue or a pull request, link it.

<div class="mii-highlight mii-highlight-red">
<h5>Breaking changes MUST be reported and explained</h5>
<p>A version section that contains a breaking change is not complete until it
answers, explicitly and in this changelog:</p>
<ul>
<li><b>What exactly changed</b> between the two versions — the artifact, the
element, the old and the new constraint (not just "profile X was revised").</li>
<li><b>What it means for existing data:</b> does data that conformed to the
previous version still validate against the new one? If not, which resources
and elements are affected, and how does the failure show up?</li>
<li><b>What implementers should do:</b> the authors' recommendation for
migrating existing data to the new version — transformation steps, default
values, re-coding guidance — or an explicit statement that no migration path
is provided and why.</li>
</ul>
<p>Mark such entries clearly (for example, prefix them with
<b>BREAKING:</b>) so a reader scanning the section cannot miss them.</p>
</div>

---

#### Version {{CALVER_VERSION}}

**Date:** {{RELEASE_DATE}}

##### Added

* First publication of the **{{MODULE_TITLE}}** module.

> [TODO: Replace this section with the real entries of your first release, and
> add a new section on top for every subsequent version. For a module with
> several sub-domains, `kerndatensatz-basis` groups the entries of a version by
> topic (for example *Documentation*, *Terminology updates*, and one heading per
> sub-module) and prefixes each bullet with **Added:** / **Changed:** /
> **Removed:** — use whichever of the two groupings suits your module, but keep
> it the same across versions and identical in both languages.]
{: .mii-highlight .mii-highlight-grey}
