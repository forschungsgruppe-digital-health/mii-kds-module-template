# Reports

Each file here is a **dated, immutable snapshot** of one audit or verification
run: what was true on that date, checked how, with what result.

## The convention

- **Named `<what>-<YYYY-MM-DD>.md`.** The date is part of the identity.
- **Never edited after the fact.** If a later run finds something different,
  that is a new report, not a correction of an old one. A report that gets
  quietly updated stops being evidence of anything.
- **Therefore expect them to go stale**, and read them as history. Where a
  report describes behaviour that has since changed, the current behaviour is in
  the documentation and in the code — not here.

> **Why immutability is worth the staleness:** these reports exist so a claim
> can be traced to the run that produced it. "The build had 0 QA errors on
> 2026-07-23" is only useful if nobody has since edited it to say something
> else. The cost is that an old report can contradict today's repository; the
> alternative — evidence you cannot trust — is worse.

If you want to know what is true *now*, start at [../README.md](../README.md).
If you want to know what is still open, see
[../open-tasks.md](../open-tasks.md).
