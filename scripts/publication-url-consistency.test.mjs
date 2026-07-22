// Template-contract test, adapted from kerndatensatz-basis's
// publication-url-consistency.test.mjs. The basis version asserts that repo's
// concrete URLs; this version asserts that the TEMPLATE's placeholder
// metadata contract stays internally consistent across sushi-config.yaml,
// ig.ini, publication-request.json, and go-publish.yml, so that replacing the
// {{...}} placeholders yields a coherent module. Runs offline via
// `node --test scripts/*.test.mjs`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repository = fileURLToPath(new URL("../", import.meta.url));

// The canonical placeholder pattern (MII convention, basis: .../modul-base)
// and the publication website placeholder (GitHub Pages under the creating
// org — deliberately different from the canonical).
const canonical =
  "https://www.medizininformatik-initiative.de/fhir/modul-{{MODULE_SLUG}}";
const publicationBase = "https://{{GITHUB_ORG}}.github.io/{{REPO_NAME}}";
const packageId =
  "de.medizininformatikinitiative.kerndatensatz.{{MODULE_SLUG}}";

function read(relativePath) {
  return readFileSync(new URL(relativePath, `file://${repository}/`), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("keeps the metadata contract consistent across the template files", () => {
  const sushiConfig = read("sushi-config.yaml");
  const publicationRequest = readJson("publication-request.json");

  assert.match(
    sushiConfig,
    new RegExp(`^canonical: ${escapeRegExp(canonical)}$`, "m"),
  );
  assert.match(
    sushiConfig,
    new RegExp(`^packageId: ${escapeRegExp(packageId)}$`, "m"),
  );
  assert.match(sushiConfig, /^id: mii-ig-\{\{MODULE_SLUG\}\}$/m);
  assert.match(sushiConfig, /^name: MII_IG_\{\{MODULE_NAME\}\}$/m);
  assert.match(sushiConfig, /^license: CC-BY-4\.0/m);
  assert.match(sushiConfig, /^\s+pin-canonicals: pin-all$/m);

  assert.equal(publicationRequest["package-id"], packageId);
  assert.equal(
    publicationRequest.path,
    `${publicationBase}/${publicationRequest.version}`,
  );
  assert.ok(
    publicationRequest["ci-build"].startsWith(`${publicationBase}/branches/`),
  );
  assert.ok(publicationRequest["ci-build"].endsWith("/"));
  // A fresh module's first formal publication bootstraps its own history.
  assert.equal(publicationRequest.first, true);
});

test("is German-default with English translation supplements", () => {
  const sushiConfig = read("sushi-config.yaml");

  // Deliberate deviation from basis (en-default with de translations).
  assert.match(sushiConfig, /^\s+i18n-default-lang: de\b/m);
  assert.match(sushiConfig, /^\s+i18n-lang:\n\s+- en\b/m);
  assert.match(
    sushiConfig,
    /^\s+translation-sources:\n\s+- input\/translations\/en\b/m,
  );
});

test("does not copy the basis special-url list", () => {
  const sushiConfig = read("sushi-config.yaml");

  // The basis list is basis-specific; the template documents a placeholder
  // and the regeneration recipe instead. No concrete special-url entries may
  // appear (the basis entries all live under .../fhir/core/...).
  assert.doesNotMatch(
    sushiConfig,
    /- https:\/\/www\.medizininformatik-initiative\.de\/fhir\/core\//,
  );
  assert.match(sushiConfig, /^\s+# special-url:$/m);
  assert.match(sushiConfig, /docs\/recipes\/regenerate-special-url\.md/);
});

test("points ig.ini at the SUSHI-generated IG with a TODO template reference", () => {
  const igIni = read("ig.ini");

  assert.match(
    igIni,
    /^ig = fsh-generated\/resources\/ImplementationGuide-mii-ig-\{\{MODULE_SLUG\}\}\.json$/m,
  );
  // Wired by the template-reference task; publication rejects the TODO.
  assert.match(igIni, /^template = TODO/m);
});

test("keeps publication locations separate from the FHIR canonical in go-publish", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.match(
    workflow,
    new RegExp(`EXPECTED_CANONICAL: "${escapeRegExp(canonical)}"`),
  );
  assert.match(
    workflow,
    new RegExp(
      `EXPECTED_PUBLICATION_BASE: "${escapeRegExp(publicationBase)}"`,
    ),
  );
  assert.match(
    workflow,
    new RegExp(`EXPECTED_PACKAGE_ID: "${escapeRegExp(packageId)}"`),
  );
  assert.doesNotMatch(workflow, /canonical_mapping_confirmed/);
  assert.doesNotMatch(workflow, /canonical mapping/i);
});

test("pins the publication toolchain (deviation from basis's runtime resolution)", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.match(workflow, /PUBLISHER_VERSION: "\d+\.\d+\.\d+"/);
  assert.match(workflow, /PUBLISHER_SHA256: "[0-9a-f]{64}"/);
  assert.match(workflow, /SUSHI_VERSION: "\d+\.\d+\.\d+"/);
  assert.match(workflow, /JEKYLL_VERSION: "\d+\.\d+\.\d+"/);
  assert.match(workflow, /JEKYLL_GEM_SHA256: "[0-9a-f]{64}"/);
  assert.doesNotMatch(workflow, /releases\/latest\/download\/publisher\.jar/);
  assert.doesNotMatch(workflow, /fsh-sushi@latest/);
  // Support repos are pinned; only the live FHIR IG registry floats.
  const registryCheckout = workflow.indexOf("repository: FHIR/ig-registry");
  assert.ok(registryCheckout >= 0);
  for (const pinned of [
    "repository: HL7/fhir-ig-history-template",
    "repository: HL7/fhir-web-templates",
    "repository: medizininformatik-initiative/kerndatensatz-meta",
  ]) {
    const index = workflow.indexOf(pinned);
    assert.ok(index >= 0, `${pinned} missing`);
    const block = workflow.slice(index, index + 200);
    assert.match(block, /ref: [0-9a-f]{40}/, `${pinned} is not SHA-pinned`);
  }
  // Every action is pinned to a commit SHA.
  for (const uses of workflow.matchAll(/uses:\s*([^\s]+)/g)) {
    assert.match(
      uses[1],
      /@[0-9a-f]{40}$/,
      `${uses[1]} is not pinned to a commit SHA`,
    );
  }
});

test("prefers SU-TermServ and falls back to tx.fhir.org with a notice", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.match(workflow, /SU_TERMSERV_CLIENT_CERT/);
  assert.match(workflow, /SU_TERMSERV_CLIENT_KEY/);
  assert.match(workflow, /SU_TERMSERV_CLIENT_CERT_PASSWORD/);
  assert.match(workflow, /::notice::.*tx\.fhir\.org/);
  assert.match(workflow, /tx_url=https:\/\/tx\.fhir\.org/);
  // The build must not hard-fail without the certificate.
  assert.doesNotMatch(
    workflow,
    /client certificate secrets are required/,
  );
});

test("stays a manually dispatched dry run by default", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.match(workflow, /^on:\n  workflow_dispatch:$/m);
  assert.doesNotMatch(workflow, /^\s+(push|pull_request|schedule):/m);
  // The publish input (6-space indent below workflow_dispatch.inputs)
  // defaults to false = complete dry run.
  const publishInput = workflow.indexOf("\n      publish:");
  assert.ok(publishInput >= 0);
  assert.match(
    workflow.slice(publishInput, publishInput + 300),
    /default: false/,
  );
});

test("corrects and validates the generated FHIR IG Registry handoff", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.match(
    workflow,
    /node automation\/scripts\/fix-ig-registry-entry\.mjs/,
  );
  assert.match(workflow, /source\/publication-request\.json/);
  // Package metadata comes from the built package, not a duplicated root
  // package.json (deviation from basis).
  assert.match(
    workflow,
    /tar -xOzf source\/output\/package\.tgz package\/package\.json/,
  );
  assert.match(workflow, /"\$\{PUBLICATION_BASE\}\/history\.html"/);
  assert.match(workflow, /diff --check -- fhir-ig-list\.json/);
  assert.match(workflow, /test -s "\$\{RUNNER_TEMP\}\/ig-registry\.patch"/);
});

test("restores localized table backgrounds after go-publish", () => {
  const workflow = read(".github/workflows/go-publish.yml");
  const goPublish = workflow.indexOf("- name: Run Publisher -go-publish");
  const stagedRestore = workflow.indexOf(
    "Restore and verify localized table backgrounds in the staged publication",
  );

  assert.ok(goPublish >= 0);
  assert.ok(stagedRestore > goPublish);

  const stagedRestoreBlock = workflow.slice(
    stagedRestore,
    workflow.indexOf("- name:", stagedRestore),
  );
  assert.match(
    stagedRestoreBlock,
    /for publication_directory in site "site\/\$\{LABEL\}"/,
  );
  assert.match(
    stagedRestoreBlock,
    /"\$\{publication_directory\}"\n\s+bash[\s\S]*"\$\{publication_directory\}" \\\n\s+--check/,
  );
});

test("does not pass publication URLs through cross-job outputs", () => {
  const workflow = read(".github/workflows/go-publish.yml");

  assert.doesNotMatch(
    workflow,
    /needs\.prepare\.outputs\.publication_(?:base|path)/,
  );
  assert.doesNotMatch(workflow, /^\s{6}publication_(?:base|path):/m);
  assert.match(workflow, /publication_base="\$\{EXPECTED_PUBLICATION_BASE%\/\}"/);
  assert.match(
    workflow,
    /publication_path="\$\{publication_base\}\/\$\{LABEL\}"/,
  );
});
