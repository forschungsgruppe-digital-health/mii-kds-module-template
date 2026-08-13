#!/usr/bin/env node
// convention-check — the mechanical, placeholder-aware implementation of the
// HARD module-metadata contract (Section 1 of
// skills/wiki-consistency-check/references/check-matrix.md). This is THE single
// metadata checker for the project — do NOT add a second linter beside it.
//
// It checks the fixed metadata contract only. The advisory repo ↔ MII-wiki
// drift findings (Section 2 of the check matrix) are a manual review; they are
// never failed here.
//
// Usage:
//   node scripts/convention-check.mjs [--release] [--root <dir>]
//     --release   strict mode: an unresolved {{PLACEHOLDER}} is a FAILURE
//                 (a module must not release with placeholders). The CI
//                 workflow sets this automatically on release/** branches.
//     --root      repository root to read (default: current directory).
//
// Exit code: 0 if no hard violation, 1 otherwise. Zero runtime dependencies
// (Node >= 18). The pure logic lives in `evaluate()` so it can be unit-tested
// (see convention-check.test.mjs) without touching the file system.

import { readFileSync, existsSync, appendFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// The machine-readable marker an OPTIONAL (0..1) page carries until the module
// decides to keep or remove it — see docs/optional-pages.md. Deleting the
// banner + marker comment from a page removes every occurrence of this string.
export const OPTIONAL_MARKER = "OPTIONAL-PAGE";

// ── value extraction (no YAML dependency; line-oriented, comment/quote aware) ──

/** Read a top-level `key: value` from a YAML string. Returns the trimmed value
 * with surrounding quotes and a trailing ` # comment` removed, or null. */
export function readTopLevel(yaml, key) {
  const re = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:[ \\t]*(.*)$`, "m");
  const m = yaml.match(re);
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  const c = v.search(/\s+#/);
  if (c >= 0) v = v.slice(0, c).trim();
  return v;
}

/** Read the `dependencies:` block as an array of { name, version }. */
export function readDependencies(yaml) {
  const lines = yaml.split(/\r?\n/);
  const out = [];
  let inBlock = false;
  for (const line of lines) {
    if (/^dependencies:\s*(#.*)?$/.test(line)) { inBlock = true; continue; }
    if (!inBlock) continue;
    if (/^\S/.test(line)) break; // dedent → block ended
    const m = line.match(/^\s+([A-Za-z0-9._-]+):\s*(.*?)\s*(#.*)?$/);
    if (!m) continue;
    let ver = m[2].trim().replace(/^["']|["']$/g, "");
    out.push({ name: m[1], version: ver });
  }
  return out;
}

/** Read `template = ...` from ig.ini. */
export function readIgIniTemplate(igIni) {
  if (!igIni) return null;
  const m = igIni.match(/^template\s*=\s*(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

const PLACEHOLDER = /\{\{[^}]+\}\}/;
// The floating labels. Keep this set identical to the publication gate's ERE in
// .github/workflows/go-publish.yml ("Formal publication requires a pinned IG
// template") — the two are deliberate defence in depth, so they must move
// together.
const FLOATING = /(^|#)(current|latest|dev|cibuild)$/i;

function isPlaceholder(value) {
  return PLACEHOLDER.test(value);
}

/** Check a value shaped `<prefix><variable>`. charClass is the RegExp source of
 * the character class allowed in the variable part. */
function checkPrefixed(value, prefix, charClass) {
  if (!value.startsWith(prefix)) return { ok: false, reason: `must start with "${prefix}"` };
  const rest = value.slice(prefix.length);
  if (isPlaceholder(rest)) {
    const ok = new RegExp(`^${charClass}*\\{\\{[^}]+\\}\\}${charClass}*$`).test(rest);
    return { ok, parameterized: true, reason: ok ? null : `parameterized part "${rest}" is malformed` };
  }
  const ok = new RegExp(`^${charClass}+$`).test(rest);
  return { ok, parameterized: false, reason: ok ? null : `"${rest}" does not match ${charClass}+` };
}

// ── the pure evaluation ───────────────────────────────────────────────────────

/**
 * @param {object} inputs
 * @param {string|null} inputs.sushiConfig  raw sushi-config.yaml (or null)
 * @param {string|null} inputs.igIni        raw ig.ini (or null)
 * @param {object|null} inputs.packageJson  parsed package/package.json (or null)
 * @param {boolean}     inputs.release      strict mode (placeholders fail)
 * @param {boolean}     inputs.demoPagePresent  whether the scaffold's
 *        demonstration page is still in the tree (release-mode failure)
 * @param {Array<{page: string, en: string, de: string}>|null} inputs.optionalPages
 *        one entry per page name that carries the OPTIONAL-PAGE marker in at
 *        least one language; `en`/`de` are "marked" | "unmarked" | "absent"
 *        (null = the scan did not run, e.g. in unit tests without a tree)
 * @returns {{ findings: Array, ok: boolean }}
 */
export function evaluate({ sushiConfig = null, igIni = null, packageJson = null, release = false, demoPagePresent = false, optionalPages = null } = {}) {
  const findings = [];
  const add = (id, applies, status, observed, message) =>
    findings.push({ id, applies, status, observed, message });

  // A field is a hard failure when it is malformed, when it is missing, or —
  // in release mode — when it is still parameterized.
  const field = (id, value, checkFn) => {
    if (value === null || value === undefined) {
      add(id, "module", "fail", null, "field not found in sushi-config.yaml");
      return;
    }
    const r = checkFn(value);
    if (!r.ok) {
      add(id, "module", "fail", value, r.reason);
    } else if (r.parameterized) {
      if (release) add(id, "module", "fail", value, "unresolved placeholder on a release branch");
      else add(id, "module", "parameterized", value, "parameterized (template) — pattern OK");
    } else {
      add(id, "module", "pass", value, "OK");
    }
  };

  // ── Section 1a — module metadata contract ──
  if (sushiConfig !== null) {
    field("M1 packageId", readTopLevel(sushiConfig, "packageId"), (v) =>
      checkPrefixed(v, "de.medizininformatikinitiative.kerndatensatz.", "[a-z0-9-]"));

    field("M2 id", readTopLevel(sushiConfig, "id"), (v) => {
      const r = checkPrefixed(v, "mii-ig-", "[a-z0-9-]");
      if (r.ok && v.length > 64) return { ok: false, reason: "id exceeds 64 characters" };
      return r;
    });

    field("M3 name", readTopLevel(sushiConfig, "name"), (v) =>
      checkPrefixed(v, "MII_IG_", "[A-Za-z0-9_]"));

    field("M4 title", readTopLevel(sushiConfig, "title"), (v) => {
      if (!/^MII .+/.test(v)) return { ok: false, reason: 'title must start with "MII " and name the module' };
      return { ok: true, parameterized: isPlaceholder(v) };
    });

    field("M5 canonical", readTopLevel(sushiConfig, "canonical"), (v) =>
      checkPrefixed(v, "https://www.medizininformatik-initiative.de/fhir/", "[a-z0-9-]"));

    field("M6 version", readTopLevel(sushiConfig, "version"), (v) => {
      if (isPlaceholder(v)) return { ok: true, parameterized: true };
      return { ok: /^\d{4}\.\d+\.\d+$/.test(v), parameterized: false, reason: "version must be CalVer YYYY.n.n (modules never use SemVer)" };
    });

    // M7 — no floating label anywhere (always hard, both branches).
    const floats = [];
    for (const d of readDependencies(sushiConfig)) {
      if (FLOATING.test(d.version)) floats.push(`dependency ${d.name}: ${d.version}`);
    }
    const tmpl = readIgIniTemplate(igIni);
    if (tmpl && FLOATING.test(tmpl)) floats.push(`ig.ini template = ${tmpl}`);
    if (floats.length > 0) {
      add("M7 no floating pins", "module", "fail", floats.join("; "),
        "no dependency or template may pin to current/latest/dev/cibuild");
    } else {
      add("M7 no floating pins", "module", "pass", tmpl ? `template = ${tmpl}` : "n/a", "OK");
    }

    // In release mode the ig.ini template must be a real pinned reference, not
    // the bring-up TODO placeholder (mirrors go-publish.yml).
    if (release && tmpl && /todo/i.test(tmpl)) {
      add("M7 template pinned", "module", "fail", `template = ${tmpl}`,
        "a release must reference a pinned IG template, not the TODO placeholder");
    }
  } else {
    add("Section 1a", "module", "skip", null, "no sushi-config.yaml found");
  }


  // M8 — the scaffold's demonstration page must not reach a release. It is
  // shipped so an author can see the artifact-rendering mechanisms working,
  // and it renders THIS scaffold's starter artefacts, so publishing it in a
  // real module ships someone else's example profile as if it were content.
  // Development builds keep it: deleting it at creation would mean nobody
  // ever reads it. Release is the moment it must be gone.
  if (demoPagePresent) {
    add(
      "M8", "module", release ? "fail" : "pass",
      "input/pagecontent/rendering-artifacts.md present",
      release
        ? "the demonstration page is still present on a release branch — remove all of: " +
          "input/pagecontent/rendering-artifacts.md, " +
          "input/translations/de/pagecontent/rendering-artifacts.md, " +
          "the rendering-artifacts.md entry in sushi-config.yaml pages:, " +
          "the menu entry in input/includes/menu.xml and " +
          "input/translations/de/includes/menu.xml, " +
          "the demo/ directory (its Liquid template), and the generator " +
          "scripts/gen-rendering-demo.py with its demo-en.md, demo-de.md and " +
          "rendering-demo-codes.json inputs"
        : "demonstration page present — fine in development; it must be removed before a release",
    );
  }

  // M9 — OPTIONAL (0..1) menu entries must be DECIDED before a release. The
  // approved MII module menu marks some pages optional (docs/optional-pages.md);
  // each ships with an OPTIONAL-PAGE marker + a visible banner. Keeping the
  // page = deleting the marker in BOTH languages; dropping it = removing the
  // page per the documented procedure. Development builds tolerate undecided
  // markers (that is what makes them visible to reviewers); a release must not
  // ship a page that says "decide me" to its readers.
  if (optionalPages !== null) {
    // Symmetry first (both modes): a marker present in one language but not
    // the other means the decision was executed halfway — the rendered
    // languages would disagree about whether the page is settled.
    const asymmetric = optionalPages.filter((p) => p.en !== p.de);
    for (const p of asymmetric) {
      add("M9 optional pages", "module", "fail",
        `${p.page}: en=${p.en}, de=${p.de}`,
        `the OPTIONAL-PAGE marker of ${p.page} differs between the English page and the German mirror — ` +
        "apply the keep/remove decision to BOTH languages (see docs/optional-pages.md)");
    }
    const undecided = optionalPages.filter((p) => p.en === "marked" && p.de === "marked");
    if (undecided.length > 0) {
      add("M9 optional pages", "module", release ? "fail" : "pass",
        undecided.map((p) => p.page).join(", "),
        release
          ? "optional pages still carry their OPTIONAL-PAGE marker on a release branch — decide each one: " +
            "KEEP it (delete the banner + marker comment in input/pagecontent/<page> AND " +
            "input/translations/de/pagecontent/<page>) or REMOVE it (follow the per-entry procedure in " +
            "docs/optional-pages.md: delete both page files, the menu entry in both menu.xml files, " +
            "the sushi-config.yaml pages: entry and the page's unit in the IG-level .po catalogue)"
          : "optional pages awaiting a keep/remove decision — fine in development; decide each before a release (docs/optional-pages.md)");
    } else if (asymmetric.length === 0) {
      add("M9 optional pages", "module", "pass", "none undecided", "OK");
    }
  }

  // ── Section 1b — template PACKAGE manifest (only when present) ──
  if (packageJson !== null) {
    const t1 = packageJson.name === "de.medizininformatikinitiative.template";
    add("T1 package name", "template", t1 ? "pass" : "fail", packageJson.name || null,
      t1 ? "OK" : "expected de.medizininformatikinitiative.template");
    const t2 = packageJson.type === "fhir.template";
    add("T2 package type", "template", t2 ? "pass" : "fail", packageJson.type || null,
      t2 ? "OK" : "expected fhir.template");
    const t3 = typeof packageJson.version === "string" && /^\d+\.\d+\.\d+$/.test(packageJson.version);
    add("T3 SemVer version", "template", t3 ? "pass" : "fail", packageJson.version || null,
      t3 ? "OK" : "template packages use SemVer x.y.z");
    const base = packageJson.dependencies && packageJson.dependencies["fhir2.base.template"];
    const t4 = typeof base === "string" && /^\d+\.\d+\.\d+$/.test(base) && !FLOATING.test(base);
    add("T4 base template pinned", "template", t4 ? "pass" : "fail", base || null,
      t4 ? "OK" : 'fhir2.base.template must be a fixed version (never #current)');
  } else {
    add("Section 1b", "template", "skip", null, "no package/package.json (not a template package repo)");
  }

  const ok = !findings.some((f) => f.status === "fail");
  return { findings, ok };
}

// ── CLI ───────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { release: false, root: process.cwd() };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--release") args.release = true;
    else if (argv[i] === "--root") args.root = argv[++i];
    else { console.error(`Unknown argument: ${argv[i]}`); process.exit(2); }
  }
  return args;
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

/** Scan the two pagecontent trees for OPTIONAL-PAGE markers and pair the
 * languages per page name. Exported for the unit test. */
export function scanOptionalPages(root) {
  const dirs = {
    en: join(root, "input", "pagecontent"),
    de: join(root, "input", "translations", "de", "pagecontent"),
  };
  const state = {}; // page name → { en, de }
  for (const [lang, dir] of Object.entries(dirs)) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const marked = readFileSync(join(dir, name), "utf8").includes(OPTIONAL_MARKER);
      state[name] = state[name] || {};
      state[name][lang] = marked ? "marked" : "unmarked";
    }
  }
  // Only pages that carry a marker in at least one language concern M9; a page
  // missing on one side counts as "absent" there.
  return Object.entries(state)
    .filter(([, s]) => s.en === "marked" || s.de === "marked")
    .map(([page, s]) => ({ page, en: s.en || "absent", de: s.de || "absent" }))
    .sort((a, b) => a.page.localeCompare(b.page));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sushiConfig = readIfExists(join(args.root, "sushi-config.yaml"));
  const igIni = readIfExists(join(args.root, "ig.ini"));
  const packageJsonRaw = readIfExists(join(args.root, "package", "package.json"));
  const packageJson = packageJsonRaw ? JSON.parse(packageJsonRaw) : null;
  const demoPagePresent = existsSync(
    join(args.root, "input", "pagecontent", "rendering-artifacts.md"),
  );
  const optionalPages = scanOptionalPages(args.root);

  const { findings, ok } = evaluate({
    sushiConfig, igIni, packageJson, release: args.release, demoPagePresent, optionalPages,
  });

  const mode = args.release ? "release (strict)" : "development (placeholder-tolerant)";
  const lines = [];
  lines.push(`# Convention check — module-metadata contract (${mode})`);
  lines.push("");
  lines.push("| Assertion | Applies | Status | Observed |");
  lines.push("| --- | --- | --- | --- |");
  const icon = { pass: "PASS", parameterized: "PARAM", fail: "FAIL", skip: "skip" };
  for (const f of findings) {
    const obs = f.observed === null || f.observed === undefined ? "" : String(f.observed).replace(/\|/g, "\\|");
    lines.push(`| ${f.id} | ${f.applies} | ${icon[f.status] || f.status} | ${obs} |`);
  }
  lines.push("");
  lines.push(ok ? "Result: PASS — no hard violation." : "Result: FAIL — hard violation(s) above.");
  lines.push("");
  lines.push("Advisory repo/wiki drift findings (Section 2 of the check matrix) are not evaluated here; they are reviewed by hand.");
  const report = lines.join("\n");

  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    try { appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n"); } catch { /* summary is best-effort */ }
  }
  for (const f of findings) {
    if (f.status === "fail") console.error(`::error::${f.id}: ${f.message} (observed: ${f.observed ?? "none"})`);
  }
  process.exit(ok ? 0 : 1);
}

// Run as CLI only when invoked directly (not when imported by the test).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
