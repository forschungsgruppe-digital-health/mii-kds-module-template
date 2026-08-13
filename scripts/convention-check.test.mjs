// Unit tests for the convention checker. Run with: node --test scripts/
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  evaluate, readTopLevel, readDependencies, readIgIniTemplate, scanOptionalPages,
  scanOptionalMenuLabels, scanHeadingDuplicates,
  parsePageTitles, parsePoTitles, extractHeadings, findHeadingDefects,
} from "./convention-check.mjs";

// A parameterized scaffold sushi-config, as this repo ships it.
const SCAFFOLD = `id: mii-ig-{{MODULE_SLUG}}
canonical: https://www.medizininformatik-initiative.de/fhir/modul-{{MODULE_SLUG}}
name: MII_IG_{{MODULE_NAME}}
title: MII Implementation Guide {{MODULE_TITLE}}
version: "{{CALVER_VERSION}}"
packageId: de.medizininformatikinitiative.kerndatensatz.{{MODULE_SLUG}}
dependencies:
  de.basisprofil.r4: 1.5.4
  hl7.fhir.uv.crmi: 2.0.0
`;

// A fully-resolved, valid module.
const CONCRETE = `id: mii-ig-base
canonical: https://www.medizininformatik-initiative.de/fhir/modul-base
name: MII_IG_Base
title: MII Implementation Guide Core Dataset Base
version: "2026.0.1"
packageId: de.medizininformatikinitiative.kerndatensatz.base
dependencies:
  de.basisprofil.r4: 1.5.4
`;
const CONCRETE_IGINI = "[IG]\ntemplate = de.medizininformatikinitiative.template#0.1.0\n";

function ids(findings, status) {
  return findings.filter((f) => f.status === status).map((f) => f.id);
}

test("extractors read values, strip quotes and comments", () => {
  assert.equal(readTopLevel(SCAFFOLD, "id"), "mii-ig-{{MODULE_SLUG}}");
  assert.equal(readTopLevel(CONCRETE, "version"), "2026.0.1");
  assert.equal(readTopLevel("status: active # a comment\n", "status"), "active");
  assert.equal(readDependencies(SCAFFOLD).length, 2);
  assert.equal(readIgIniTemplate(CONCRETE_IGINI), "de.medizininformatikinitiative.template#0.1.0");
});

test("scaffold passes in development mode (placeholders are parameterized)", () => {
  const { findings, ok } = evaluate({ sushiConfig: SCAFFOLD, igIni: "template = TODO-TEMPLATE-REFERENCE", release: false });
  assert.equal(ok, true, "scaffold must be green on non-release branches");
  // M1..M6 are all parameterized on the scaffold.
  assert.deepEqual(
    ids(findings, "parameterized").sort(),
    ["M1 packageId", "M2 id", "M3 name", "M4 title", "M5 canonical", "M6 version"].sort()
  );
  // No template package manifest → 1b is skipped.
  assert.ok(ids(findings, "skip").includes("Section 1b"));
});

test("scaffold FAILS on a release branch (placeholders unresolved)", () => {
  const { findings, ok } = evaluate({ sushiConfig: SCAFFOLD, igIni: "template = TODO-X", release: true });
  assert.equal(ok, false, "unresolved placeholders must fail a release");
  const failed = ids(findings, "fail");
  assert.ok(failed.includes("M1 packageId"));
  assert.ok(failed.includes("M6 version"));
  // The bring-up TODO template is rejected for a release too.
  assert.ok(failed.includes("M7 template pinned"));
});

test("a fully-resolved valid module passes in both modes", () => {
  for (const release of [false, true]) {
    const { ok, findings } = evaluate({ sushiConfig: CONCRETE, igIni: CONCRETE_IGINI, release });
    assert.equal(ok, true, `concrete module must pass (release=${release})`);
    assert.ok(ids(findings, "pass").includes("M1 packageId"));
  }
});

test("malformed concrete values fail", () => {
  const bad = CONCRETE.replace("packageId: de.medizininformatikinitiative.kerndatensatz.base",
    "packageId: com.example.wrong.base")
    .replace("id: mii-ig-base", "id: wrong-base")
    .replace('version: "2026.0.1"', 'version: "1.2.3"'); // SemVer, not CalVer
  const { ok, findings } = evaluate({ sushiConfig: bad, igIni: CONCRETE_IGINI, release: false });
  assert.equal(ok, false);
  const failed = ids(findings, "fail");
  assert.ok(failed.includes("M1 packageId"));
  assert.ok(failed.includes("M2 id"));
  assert.ok(failed.includes("M6 version"));
});

test("a floating dependency pin fails M7 on every branch", () => {
  const floating = CONCRETE.replace("de.basisprofil.r4: 1.5.4", "de.basisprofil.r4: current");
  const { ok, findings } = evaluate({ sushiConfig: floating, igIni: CONCRETE_IGINI, release: false });
  assert.equal(ok, false);
  assert.ok(ids(findings, "fail").includes("M7 no floating pins"));
});

test("a floating ig.ini template fails M7", () => {
  const igIni = "template = fhir2.base.template#current\n";
  const { ok, findings } = evaluate({ sushiConfig: CONCRETE, igIni, release: false });
  assert.equal(ok, false);
  assert.ok(ids(findings, "fail").includes("M7 no floating pins"));
});

// The publication gate in go-publish.yml refuses #cibuild; M7 must refuse it
// too, or a CI-build pin passes every PR and only aborts a formal publication.
test("a #cibuild ig.ini template fails M7", () => {
  const igIni = "template = fhir2.base.template#cibuild\n";
  const { ok, findings } = evaluate({ sushiConfig: CONCRETE, igIni, release: false });
  assert.equal(ok, false);
  assert.ok(ids(findings, "fail").includes("M7 no floating pins"));
});

test("a pinned package reference and the vendored local folder both pass M7", () => {
  for (const tmpl of ["de.medizininformatikinitiative.template#1.0.0", "#ig-template"]) {
    const { findings } = evaluate({ sushiConfig: CONCRETE, igIni: `template = ${tmpl}\n`, release: false });
    assert.ok(ids(findings, "pass").includes("M7 no floating pins"), tmpl);
  }
});

test("template package manifest (Section 1b) is validated when present", () => {
  const good = { name: "de.medizininformatikinitiative.template", type: "fhir.template", version: "0.1.0", dependencies: { "fhir2.base.template": "0.1.0" } };
  const r1 = evaluate({ sushiConfig: null, packageJson: good });
  assert.ok(ids(r1.findings, "pass").includes("T4 base template pinned"));

  const bad = { name: "wrong", type: "fhir.ig", version: "current", dependencies: { "fhir2.base.template": "current" } };
  const r2 = evaluate({ sushiConfig: null, packageJson: bad });
  assert.equal(r2.ok, false);
  assert.ok(ids(r2.findings, "fail").includes("T4 base template pinned"));
});

test("missing sushi-config yields a skip, not a crash", () => {
  const { findings } = evaluate({ sushiConfig: null });
  assert.ok(ids(findings, "skip").includes("Section 1a"));
});

test("M8 — the demonstration page blocks a release, but not development", () => {
  // Shipped so an author can see the mechanisms working; it renders the
  // scaffold's starter artefacts, so publishing it in a real module would ship
  // someone else's example profile as content. Deleting it at creation would
  // mean nobody reads it, so the gate is at release, not at creation.
  const dev = evaluate({ demoPagePresent: true, release: false });
  const rel = evaluate({ demoPagePresent: true, release: true });
  const gone = evaluate({ demoPagePresent: false, release: true });

  assert.equal(dev.findings.find((f) => f.id === "M8")?.status, "pass");
  assert.equal(rel.findings.find((f) => f.id === "M8")?.status, "fail");
  assert.equal(rel.ok, false, "a release with the demo page still present must fail");
  assert.equal(gone.findings.find((f) => f.id === "M8"), undefined);

  // The message must name every file, or the author fixes one and re-runs.
  const msg = rel.findings.find((f) => f.id === "M8").message;
  for (const f of [
    "input/pagecontent/rendering-artifacts.md",
    "input/translations/de/pagecontent/rendering-artifacts.md",
    "sushi-config.yaml",
    "input/includes/menu.xml",
    "input/translations/de/includes/menu.xml",
  ]) {
    assert.ok(msg.includes(f), `the failure message should name ${f}`);
  }
});

test("M9 — undecided optional pages block a release, but not development", () => {
  // The approved MII module menu marks some entries OPTIONAL (0..1). Each
  // ships with an OPTIONAL-PAGE marker + banner; the gate is at release so the
  // scaffold can present the choice without failing every PR.
  const undecided = [
    { page: "extensions.md", en: "marked", de: "marked" },
    { page: "operations.md", en: "marked", de: "marked" },
  ];
  const dev = evaluate({ optionalPages: undecided, release: false });
  const rel = evaluate({ optionalPages: undecided, release: true });

  assert.equal(dev.findings.find((f) => f.id === "M9 optional pages")?.status, "pass");
  assert.equal(dev.ok, true, "undecided optional pages must be green in development");
  assert.equal(rel.findings.find((f) => f.id === "M9 optional pages")?.status, "fail");
  assert.equal(rel.ok, false, "a release with undecided optional pages must fail");

  // The failure message must teach both exits: keep (delete banner in both
  // languages) and remove (the documented per-entry procedure).
  const msg = rel.findings.find((f) => f.id === "M9 optional pages").message;
  for (const s of ["docs/optional-pages.md", "input/translations/de/pagecontent", "menu.xml", ".po"]) {
    assert.ok(msg.includes(s), `the failure message should mention ${s}`);
  }
});

test("M9 — a half-applied decision (marker asymmetry) fails on every branch", () => {
  for (const release of [false, true]) {
    const { ok, findings } = evaluate({
      optionalPages: [{ page: "value-sets.md", en: "unmarked", de: "marked" }],
      release,
    });
    assert.equal(ok, false, `asymmetry must fail (release=${release})`);
    const f = findings.find((x) => x.id === "M9 optional pages");
    assert.equal(f.status, "fail");
    assert.ok(f.message.includes("BOTH languages"));
  }
  // A page removed in one language only is asymmetric too.
  const half = evaluate({
    optionalPages: [{ page: "code-systems.md", en: "absent", de: "marked" }],
    release: false,
  });
  assert.equal(half.ok, false);
});

test("M9 — decided everywhere (or no scan) yields pass / no finding", () => {
  const decided = evaluate({ optionalPages: [], release: true });
  assert.equal(decided.findings.find((f) => f.id === "M9 optional pages")?.status, "pass");
  assert.equal(decided.ok, true);

  // Unit-test callers that pass no tree scan get no M9 finding at all.
  const noScan = evaluate({ release: true });
  assert.equal(noScan.findings.find((f) => f.id === "M9 optional pages"), undefined);
});

test("M9 (menu labels) — an undecided \"(optional)\" label blocks a release, but not development", () => {
  const undecided = [
    { href: "extensions.html", en: "marked", de: "marked" },
    { href: "metadata.html", en: "marked", de: "marked" },
  ];
  const dev = evaluate({ optionalMenuLabels: undecided, release: false });
  const rel = evaluate({ optionalMenuLabels: undecided, release: true });

  assert.equal(dev.findings.find((f) => f.id === "M9 optional menu labels")?.status, "pass");
  assert.equal(dev.ok, true, "undecided menu labels must be green in development");
  assert.equal(rel.findings.find((f) => f.id === "M9 optional menu labels")?.status, "fail");
  assert.equal(rel.ok, false, 'a release with "(optional)" still in a menu label must fail');

  // The failure message must teach both exits.
  const msg = rel.findings.find((f) => f.id === "M9 optional menu labels").message;
  for (const s of ["BOTH menu.xml files", "docs/recipes/remove-an-optional-page.md"]) {
    assert.ok(msg.includes(s), `the failure message should mention ${s}`);
  }
});

test("M9 (menu labels) — a suffix present in only one language's menu fails on every branch", () => {
  for (const release of [false, true]) {
    const { ok, findings } = evaluate({
      optionalMenuLabels: [{ href: "operations.html", en: "marked", de: "unmarked" }],
      release,
    });
    assert.equal(ok, false, `menu-label asymmetry must fail (release=${release})`);
    const f = findings.find((x) => x.id === "M9 optional menu labels");
    assert.equal(f.status, "fail");
    assert.ok(f.message.includes("BOTH menus"));
  }
  // Decided everywhere (or no scan) → pass / no finding.
  const decided = evaluate({ optionalMenuLabels: [], release: true });
  assert.equal(decided.findings.find((f) => f.id === "M9 optional menu labels")?.status, "pass");
  assert.equal(evaluate({ release: true }).findings.find((f) => f.id === "M9 optional menu labels"), undefined);
});

test("scanOptionalMenuLabels finds the scaffold's seven tagged entries in BOTH menus", () => {
  const entries = scanOptionalMenuLabels(new URL("..", import.meta.url).pathname);
  const hrefs = entries.map((e) => e.href);
  for (const h of ["researcher-guidance.html", "extensions.html", "search-parameters.html",
    "operations.html", "value-sets.html", "code-systems.html", "metadata.html"]) {
    assert.ok(hrefs.includes(h), `${h} should carry the "(optional)" label suffix`);
  }
  assert.equal(entries.length, 7, "exactly the seven optional entries are tagged");
  for (const e of entries) {
    assert.equal(e.en, "marked", `${e.href} must be tagged in the English menu`);
    assert.equal(e.de, "marked", `${e.href} must be tagged in the German menu`);
  }
});

// ── M10 — duplicated headings ────────────────────────────────────────────────

test("parsePageTitles reads the pages: tree (nested entries and comments included)", () => {
  const yaml = `id: x
pages:
  index.md:
    title: Home

  guidance.md:
    title: Guidance
    researcher-guidance.md: # OPTIONAL (0..1)
      title: Guidance for Researchers

  security-and-privacy.md:
    title: Security and Privacy
parameters:
  path-resource: x
`;
  const titles = parsePageTitles(yaml);
  assert.equal(titles.get("index.md"), "Home");
  assert.equal(titles.get("guidance.md"), "Guidance");
  assert.equal(titles.get("researcher-guidance.md"), "Guidance for Researchers");
  assert.equal(titles.get("security-and-privacy.md"), "Security and Privacy");
  assert.equal(titles.has("parameters"), false);
});

test("parsePoTitles maps msgid to msgstr", () => {
  const po = `# comment
msgid "Security and Privacy"
msgstr "Sicherheit und Datenschutz"

msgid "Home"
msgstr "Startseite"
`;
  const map = parsePoTitles(po);
  assert.equal(map.get("Security and Privacy"), "Sicherheit und Datenschutz");
  assert.equal(map.get("Home"), "Startseite");
});

test("extractHeadings skips fenced code blocks and HTML comments", () => {
  const md = `<!-- markdownlint-disable MD041 -->
<!-- a header comment
### Not a heading (inside a comment)
-->
Intro prose.

### Real Section

\`\`\`markdown
### Not a heading (inside a fence)
\`\`\`

#### Child
`;
  const headings = extractHeadings(md);
  assert.deepEqual(headings.map((h) => [h.level, h.text]), [[3, "Real Section"], [4, "Child"]]);
});

test("findHeadingDefects flags the title-dup shape (defect a)", () => {
  // The rendered page would show "3. Security and Privacy" immediately
  // followed by "3.1 Security and Privacy" — the shape this rule ends.
  const headings = extractHeadings("### Security and Privacy\n\nProse.\n\n#### 1. Concept\n");
  const defects = findHeadingDefects(headings, "Security and Privacy");
  assert.equal(defects.length, 1);
  assert.equal(defects[0].type, "title-dup");
  // Prose-first pages with distinct sections are clean.
  assert.deepEqual(findHeadingDefects(extractHeadings("Prose.\n\n### Version scheme\n"), "Versioning"), []);
  // A later (non-first) heading equal to the title is not this shape.
  assert.deepEqual(
    findHeadingDefects(extractHeadings("### Intro\n\n### Downloads\n"), "Downloads"), []);
});

test("findHeadingDefects flags a heading equal to its immediate parent (defect b)", () => {
  const md = "### Downloads\n\n#### Downloads\n\nProse.\n\n#### Package file\n";
  const defects = findHeadingDefects(extractHeadings(md), null);
  assert.equal(defects.length, 1);
  assert.equal(defects[0].type, "parent-dup");
  assert.equal(defects[0].text, "Downloads");
  // Siblings of the same text are not parent/child; uncles do not count either.
  const clean = "### A\n\n#### B\n\n#### B2\n\n### C\n\n#### A\n";
  assert.deepEqual(findHeadingDefects(extractHeadings(clean), null), []);
});

test("M10 — any duplicated heading fails on every branch", () => {
  const dup = [{ file: "input/pagecontent/security-and-privacy.md", type: "title-dup", line: 10, text: "Security and Privacy", ref: "Security and Privacy" }];
  for (const release of [false, true]) {
    const { ok, findings } = evaluate({ headingDuplicates: dup, release });
    assert.equal(ok, false, `a duplicated heading must fail (release=${release})`);
    const f = findings.find((x) => x.id === "M10 no duplicated headings");
    assert.equal(f.status, "fail");
    assert.ok(f.message.includes("BOTH languages"));
  }
  const clean = evaluate({ headingDuplicates: [] });
  assert.equal(clean.findings.find((f) => f.id === "M10 no duplicated headings")?.status, "pass");
  assert.equal(evaluate({}).findings.find((f) => f.id === "M10 no duplicated headings"), undefined);
});

test("scanHeadingDuplicates — the committed tree is clean, a seeded duplicate is caught", () => {
  const root = new URL("..", import.meta.url).pathname;
  // The scaffold itself must be free of both defect shapes, in both languages.
  assert.deepEqual(scanHeadingDuplicates(root), []);

  // Negative control: seed a throwaway tree with the S&P defect in both
  // languages (title via pages: in English, via the .po catalogue in German)
  // and a parent-dup, and the scan must report all three.
  const tmp = mkdtempSync(join(tmpdir(), "convention-check-m10-"));
  try {
    mkdirSync(join(tmp, "input", "pagecontent"), { recursive: true });
    mkdirSync(join(tmp, "input", "translations", "de", "pagecontent"), { recursive: true });
    writeFileSync(join(tmp, "sushi-config.yaml"),
      "pages:\n  security-and-privacy.md:\n    title: Security and Privacy\n");
    writeFileSync(join(tmp, "input", "translations", "de", "ImplementationGuide-mii-ig-x.po"),
      'msgid "Security and Privacy"\nmsgstr "Sicherheit und Datenschutz"\n');
    writeFileSync(join(tmp, "input", "pagecontent", "security-and-privacy.md"),
      "### Security and Privacy\n\nProse.\n\n#### Concept\n\n##### Concept\n");
    writeFileSync(join(tmp, "input", "translations", "de", "pagecontent", "security-and-privacy.md"),
      "### Sicherheit und Datenschutz\n\nProsa.\n");
    const defects = scanHeadingDuplicates(tmp);
    assert.deepEqual(
      defects.map((d) => [d.file, d.type]).sort(),
      [
        ["input/pagecontent/security-and-privacy.md", "parent-dup"],
        ["input/pagecontent/security-and-privacy.md", "title-dup"],
        ["input/translations/de/pagecontent/security-and-privacy.md", "title-dup"],
      ],
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("scanOptionalPages pairs the languages of this repository's scaffold", () => {
  // Run against the real tree: every optional page the scaffold ships must be
  // marked in BOTH languages (the state the template itself is committed in).
  const entries = scanOptionalPages(new URL("..", import.meta.url).pathname);
  assert.ok(entries.length >= 7, "the scaffold ships at least 7 optional pages");
  for (const e of entries) {
    assert.equal(e.en, "marked", `${e.page} must carry the marker in English`);
    assert.equal(e.de, "marked", `${e.page} must carry the marker in German`);
  }
  const names = entries.map((e) => e.page);
  for (const p of ["researcher-guidance.md", "extensions.md", "search-parameters.md",
    "operations.md", "value-sets.md", "code-systems.md", "metadata.md"]) {
    assert.ok(names.includes(p), `${p} should be scanned as optional`);
  }
});
