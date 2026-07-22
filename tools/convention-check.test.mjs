// Unit tests for the convention checker. Run with: node --test tools/
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, readTopLevel, readDependencies, readIgIniTemplate } from "./convention-check.mjs";

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
