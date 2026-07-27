---
name: docs-steward
description: >-
  Audits, repairs and trims the documentation of the repository it is invoked
  in. Verifies every link, path and factual claim against the repository itself;
  removes the decision narration an AI assistant leaves behind; reduces the docs
  to what someone actually needs to create, modify and maintain the repo; checks
  the language is followable by someone new to the subject; and walks the
  documented path as both a first-time and an experienced user.
  Writes a dated report to docs/reports/ and, in apply mode, fixes what is
  safely fixable. Activate after a refactor, before a release, before opening a
  repository to outside readers, or when the docs have been AI-assisted.
license: CC-BY-4.0
---

# docs-steward — check, fix and trim a repository's documentation

Documentation rots in specific, recognisable ways: a path that moved, a number
that was true once, a decision explained in five places, a rule that outlived
the thing it governed. This skill finds those, fixes what can be fixed
mechanically, and reports the rest as tasks a person can act on.

It works on **the repository it is invoked in**. It needs no arguments.

## Modes

| Mode | What it does | When |
| --- | --- | --- |
| **report** (default) | Changes nothing. Writes the report only. | First run; any repo you do not own |
| **apply** | Also fixes what is verifiably safe (see *What may be fixed automatically*) | Once you trust the report |

Always run **report** first on a repository you have not stewarded before.

## Non-negotiable limits

Violating any of these is a failure of the run, not a judgement call.

1. **Never rewrite git history.** Not to remove an address, not to reword a
   commit. Report it; a human decides.
2. **Never edit an existing file in `docs/reports/`.** They are dated,
   immutable snapshots. A later run writes a *new* report. If an old report
   contradicts today's repo, that is expected — say so in the new report.
3. **Never hand-edit a vendored or generated tree** (a mirror kept in sync by a
   script, `fsh-generated/`, `output/`, `node_modules/`). Fix the source, or
   report that the mirror needs re-syncing.
4. **Never weaken a statement of mechanism.** If CI genuinely fails the build,
   the docs must keep saying so. Softening "the check fails" into "the check
   suggests" is a regression, not a de-escalation. See step 6.
5. **Never invent a fact to fill a gap.** If something cannot be verified, the
   report says it could not be verified.

## Step 0 — Scope, and what has already been decided

Before looking for problems, find out which ones are already known and settled.
A finding that a previous run recorded as a deliberate decision is **not a
finding**; re-raising it every run is how a report becomes noise.

- Read `README.md` and state, in one sentence, what this repository is *for*.
  Every later judgement about "does this earn its place" is measured against
  that sentence.
- Read `docs/open-tasks.md` (or equivalent) and the **most recent** file in
  `docs/reports/`. List what is already recorded as decided, deferred or a
  known limit.
- Identify the no-touch zones for this repo: vendored mirrors, generated
  output, dated reports, anything a script owns.

## Step 1 — Inventory

Produce the numbers before the opinions.

- Every documentation file, its size in lines, and its **inbound link count**
  (how many other files link to it). A file with zero inbound links is either
  orphaned or is an entry point — decide which.
- Whether `docs/` has an index. A bare GitHub file listing is the single most
  common cause of "I could not find it".
- Where the same topic is covered by more than one file.

## Step 2 — References: links, paths, filenames, anchors

Resolve every reference against the repository. **The most common mistake here
is checking one namespace and reporting the others as broken.** Separate them:

| Kind | Resolves against | Trap |
| --- | --- | --- |
| Relative file link in a doc | the filesystem | — |
| Anchor (`file.md#heading`) | the target file's headings | Heading text changes; the anchor does not |
| GitHub-relative (`../../issues`) | the repo on github.com, by URL depth | Depth differs between a root file and a `docs/` file |
| Link inside published site content | the **built** site, not the filesystem | A `.html` link in page source is correct and will look broken to a naive checker |
| Link to another repository | that repository actually existing | A repo that does not exist *yet* returns 404 today |

For each: fix if the target is unambiguous, otherwise report with the candidates
you found. Verify anchors by extracting the target's real headings and slugging
them — do not assume.

Where the repository **builds** something, check the built output too, not just
the sources. A link can be valid on disk and dead in the published artefact.

## Step 3 — Claims: re-derive every number

Prose that counts things goes stale silently, and a stale number is worse than
no number because it is quoted onward into commit messages, tests and reviews.

For every claim of the form *"N files"*, *"all X are Y"*, *"every Z does W"*,
*"the only place that…"*, **re-derive it now** and correct or delete it.

Pay attention to the *shape* of the claim: "all generated tables carry a class"
is a universal, and a single counter-example falsifies it. Look for the
counter-example rather than confirming the rule.

Also verify:

- **Version and dependency pins** quoted in prose against the file that holds
  them.
- **Commands quoted in docs** — run the safe ones. A command that cannot work as
  written is a broken doc, however well it reads.
- **External citations** — that the source says what the doc claims, and that
  the URL resolves. Prefer a primary source; cite it with its version and date.

## Step 4 — Remove the assistant's residue

An AI working across a repository leaves explanation where it happened to be
working, not where a reader needs it. Remove:

- **Decision narration** — "we chose X because Y", "this was changed to…",
  "previously this did…". A repository documents *what is*; the reasoning that
  is still load-bearing belongs in one place (a decision record or a single
  "why" note), not scattered.
- **Self-referential justification** — a block explaining why the page it is on
  exists, or why it is as long as it is.
- **Progress and status residue** — "not yet available", "landing in a separate
  PR", "(planned)", "TODO(agent)", "CONFIRMED on <date>" banners. Check each
  against reality: most describe something that has since shipped.
- **Attribution to an AI** — any mention of an assistant as author, co-author or
  reviewer, in files, commit-message templates or PR templates.
- **Duplicated rationale** — the same "why" restated in each file that touches
  the topic.

Keep rationale that a maintainer would otherwise re-litigate: why a pin exists,
why an apparently redundant thing is deliberate, what a non-obvious constraint
protects. Delete rationale that only records that a decision once happened.

## Step 5 — Authority and personal data

Two failure modes, both of which misrepresent someone:

- **Overclaimed authority.** A repository may state its own rules. It may not
  present them as an organisation's standard unless that organisation published
  them. Check what is actually published — by the owning organisation, in its
  governance documents, in its other repositories, in an organisation-level
  `.github` repository — and cite it. Where nothing is published, say the rule
  is the repository's own choice. Where something is published, cite it with
  version and date, and check it is the *current* version.
- **Personal identification.** No individual should be named as a contact,
  owner or example unless they have agreed to represent the project. Sweep for
  names, usernames, institutional email addresses and handles — in file
  content, `CODEOWNERS`, issue templates, code comments and example data.
  Report git-history occurrences; never rewrite history to fix them.

## Step 6 — DRY and separation of concerns

- **One fact, one home.** Where a fact appears in several files, choose the home
  and reduce the others to a link. Two tables that answer the same question will
  drift, and usually already have — check whether they still agree, and say so.
- **Deliberate duplication is allowed, but must be deliberate.** Some repetition
  earns its place: a warning on the page where the mistake is made. Keep one
  sentence and a link, not a second copy of the explanation.
- **Content in the wrong file.** A concern explained under an unrelated heading
  is invisible to the person who needs it.

**The exception that matters:** in a *template* repository, a file that is
copied into every generated project must stay self-contained. Do not replace it
with a link back to the template.

## Step 7 — Just barely enough

For each page ask: *does this help someone create, modify or maintain what this
repository is for?* If not, it goes — regardless of how well written it is.

Common failures: reference material duplicating upstream documentation that is
better maintained elsewhere (link it instead); options the repository forbids,
documented at length; history nobody acts on; explanation of things the reader
can see in the code.

Prefer deleting to trimming, and trimming to rewriting.

## Step 8 — Language a stranger can follow

Correct documentation can still be unusable. This step is about the words, not
the facts: someone who does not know this repository's subject, tooling or
history must be able to read it without stopping.

Work from a **term list**. Extract the domain terms, acronyms and tool names the
docs use, then for each ask: *where is this first used, and is it explained or
linked there?* An acronym expanded only in the glossary is not expanded for
someone who arrived on a recipe page from a search engine.

Flag and fix:

- **Undefined on first use** — a term, acronym or file format used before it is
  introduced, on the page where the reader meets it. Either explain it in a
  clause, or link the glossary entry. Do not expand it four times on one page.
- **Assumed knowledge** — "just run the build", "the usual place", "as expected".
  If the reader has to already know the answer to understand the sentence, it
  fails.
- **`simply`, `just`, `obviously`, `of course`** — these tell a stuck reader the
  problem is them. Delete the word; the sentence is almost always better.
- **Synonym drift** — the same thing called three names (*module* / *IG* /
  *guide*; *pin* / *lock* / *fix a version*). An expert reads through it; a
  newcomer cannot tell whether two words mean two things. Pick one term per
  concept and use it everywhere.
- **Sentences carrying too much** — measure. Anything much past ~30 words, or a
  paragraph introducing more than two new terms, gets split.
- **Hidden actors** — "the file is generated", "it is validated". By what, and
  when? Name the thing that acts, so the reader knows where to look.
- **Untranslated fragments** — a word left in another language than the page.
- **Instructions that are not instructions** — "the configuration should be
  correct" tells nobody what to type.

Two things this step must *not* do: it does not simplify a precise technical
term into a vague one, and it does not remove a caveat because the caveat is
hard. Accuracy wins; the fix for a hard truth is to explain it, not to soften
it.

**Check the glossary is real.** Every term you flagged should be findable. If
the repository has a glossary, the terms a newcomer meets in the first ten
minutes belong in it.

## Step 9 — Walk the documented path, twice

Reading documentation is not testing it. Follow it.

**As a first-time user**, from the README's first line: can you get from nothing
to a working result using only what is written? Record the exact point where
you would have had to ask someone. That point is the finding.

**As an experienced user new to this repository**: can you find how to make a
change, what the conventions are, what CI will do to you, and how to release?

For both: note where you had to open a file the documentation never mentioned.

## Step 10 — Public-repository hygiene

Check for the community files a public repository is expected to have:
`README`, `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`,
`CODEOWNERS`, issue and pull-request templates, `CHANGELOG`, `CITATION.cff`,
`SUPPORT`. GitHub reports several of these under its community profile.

**Before writing a missing one, check whether the owning organisation already
publishes it** — including in an organisation-level `.github` repository, whose
defaults apply to every repo that lacks its own. Adopting an existing policy is
better than authoring a competing one; and if nothing is published, say so
explicitly in the file, so nobody mistakes a local choice for an official
policy.

Cite every source you rely on, with a link.

## Step 11 — The report

Write `docs/reports/docs-steward-<YYYY-MM-DD>.md`. Never overwrite an existing
report; if one exists for today, append a run suffix.

Structure:

1. **What was checked**, and what was deliberately not.
2. **Fixed** — one line each, with the file. Only in apply mode.
3. **Needs a decision** — findings a person must resolve, each with: the
   evidence (file and quoted text), why it matters, and **a concrete task**
   phrased so it can be handed to a person or an assistant.
4. **Declined** — things that look like problems and are not, with the reason.
   This section is what stops the next run re-reporting them.
5. **Could not verify** — with what was tried.

Every finding cites file and line. Quantitative claims in the report are subject
to the same rule as step 3: re-derive, do not repeat.

## What may be fixed automatically

In apply mode, fix only what is verifiable and reversible: broken relative links
and anchors where the target is unambiguous; stale paths after a rename;
provably wrong numbers; removal of assistant residue and self-referential
justification; stale "not yet available" notes where the thing exists.

Everything else is a reported task — in particular: deleting or merging whole
files, changing what a rule *means*, rewriting anything in a vendored tree, and
anything touching git history, licensing or a named contact.

After applying, re-run the repository's own gates (tests, linters, link checks,
build) and report the results. **A documentation change that breaks a build is a
failed run**, even if every sentence is now correct.

## Traps that have actually occurred

Not hypothetical — each of these shipped at least once in a repository this
skill was written for:

- A comment block inserted into a `.po` translation catalogue **broke the whole
  site build**. Editing generated or vendored formats has consequences beyond
  the text.
- A link checker reported **106 broken links** that were all correct: page
  source referencing the built site, not the filesystem.
- A published page linked an issue tracker at an organisation the repository had
  **not moved to yet** — a 404 for every reader, invisible to CI, which gated
  on build errors and not on the link count it also reported.
- A claim of "all N generated tables carry a class" was **measured wrongly**,
  and the resulting CSS selector broke unrelated rendering. The test written to
  protect it asserted the selector's *spelling*, so it passed.
- A rule change left **six files** asserting the opposite, including a checklist
  item that could no longer be true.
- A test file existed and was **never run by CI** because the workflow listed
  test files by name.
