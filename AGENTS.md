<!-- MPE:SCOPE-CHANGE-CONTROL:START -->
## Mandatory first read — MPE Scope & Change Control

Before planning, coding, refactoring, dependency changes, testing strategy, deployment, or checkpoint execution, read:

- `docs/governance/SCOPE-CHANGE-CONTROL.md`

Read it before project-specific source-of-truth documents. Then follow this repository's local rules and the current checkpoint/spec.

The scope policy governs minimal change, reuse, checkpoint boundaries, deep-change, testing, evidence, merge/deploy authority, and stopping conditions.

If a local rule appears to conflict with the scope policy, apply the documented source-of-truth priority. Do not silently weaken either rule; surface a deep-change conflict when required.
<!-- MPE:SCOPE-CHANGE-CONTROL:END -->

# Agent Rules

## Mandatory first step: Simplicity First
Before planning or implementing any new project, major feature, integration, infrastructure or architecture change, read and apply:

`skills/simplicity-first/SKILL.md`

Create or update `SIMPLICITY_REVIEW.md` before producing a PRD, architecture, schema, file tree, implementation phases, Codex instructions, deployment plan, new service or repository.

The review must contain the business result, non-goals, researched simple approaches, several simplification passes, final minimal workflow, kept/postponed/rejected components, simplicity score, manual fallback and evidence required before adding complexity.

Default MVP budget: one repository, one application, one database, zero or one worker, zero or one queue, one deployment target and one external provider per function.

For existing code, prefer deletion, consolidation, disabling and reuse before adding components. Complexity is allowed only for measured load, a real failure, a legal requirement or confirmed user demand.
