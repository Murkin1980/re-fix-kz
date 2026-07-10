---
name: simplicity-first
description: Mandatory pre-planning filter for every new project, major feature, integration, infrastructure or architecture decision. Research the simplest viable approaches, simplify repeatedly, and only then prepare implementation instructions.
---

# Simplicity First

## Core rule
Build the smallest system that can safely prove the business result. Do not design the most complete system.

## Run this skill before
- a new project or repository;
- a major feature or integration;
- choosing architecture, framework, database, queue, worker, service or deployment;
- writing a PRD, technical plan, file tree or Codex instructions.

## Mandatory workflow
1. **Define the result without technology.** State the user, exact action, measurable proof, non-goals and what can be manual.
2. **Research current simple options.** Compare at least: manual/semi-manual, simplest existing-tool approach, and a more automated alternative. Record setup, moving parts, maintenance, cost, risks and what assumption each validates.
3. **Simplification pass 1 — remove scope.** Delete anything not required for the first business proof.
4. **Simplification pass 2 — combine components.** Prefer one repo, one application, one database, zero or one worker, one deployment path and one provider per function.
5. **Simplification pass 3 — remove dependencies.** Keep a dependency only when the current stack cannot reasonably do the job and it materially reduces risk or time.
6. **Simplification pass 4 — operational reality.** Confirm how a non-specialist starts, stops, configures, diagnoses, backs up and restores the system.
7. **Score simplicity.** Score 0–2 for: clear outcome, few services, few dependencies, one deployment, easy local start, rollback, manual fallback, no speculative scope, understandable by one developer, end-to-end testability. Proceed only at 16/20 or higher.

## Default MVP budget
- repositories: 1;
- main applications: 1;
- databases: 1;
- workers: 0 or 1;
- queues: 0 or 1;
- deployment targets: 1;
- external providers per function: 1;
- monitoring: logs plus health endpoint first.

Any exception requires written evidence from measured load, a real failure, confirmed demand or a legal requirement.

## Stop and simplify again when
- a second repository, database, queue technology or deployment platform appears;
- more than one worker is proposed without measured load;
- infrastructure is built for hypothetical scale;
- automation is proposed before a manual flow works;
- normal local launch needs more than five runtime containers;
- the infrastructure takes longer to build than the user workflow.

## Required output before coding
Create or update `SIMPLICITY_REVIEW.md` with:
1. Business result.
2. Non-goals.
3. Approaches researched.
4. Simplification passes.
5. Final minimal workflow.
6. Components kept, postponed and rejected.
7. Simplicity score.
8. Risks and manual fallback.
9. Evidence required before adding complexity.

Only after this review passes may the agent create architecture, schemas, file structures, deployment configuration or coder instructions.

## Coder-instruction rules
Instructions must state the MVP outcome and non-goals first, reuse the current repo and stack, request the fewest files, include an end-to-end smoke test, identify legacy code to remove, include rollback steps, and forbid claiming completion without a working user flow.

## Completion rule
The skill is complete only when the final proposal is simpler than the initial proposal and removed or postponed complexity is explicitly documented.
