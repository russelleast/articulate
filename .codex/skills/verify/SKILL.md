---
name: verify
description: Sceptically verify an Articulate implementation against its plan and repository engineering standards. Use after implementation, before completion or human review, and whenever evidence is needed for tests, contracts, generated artefacts, architecture, or documentation.
---

# Verify

Produce evidence that the implementation satisfies the plan and repository engineering standards. Do not assume the implementation is correct.

## Workflow

1. Read the original plan and applicable `AGENTS.md` files.
2. Inspect the resulting diff and map each change to planned behaviour.
3. Determine which verification suites apply.
4. Invoke deterministic repository commands, using `./scripts/verify` as the full-suite entry point when applicable.
5. Inspect added or changed tests and confirm that they exercise intended behaviour rather than merely execute code.
6. Check architectural, capability, API, protobuf, compatibility, and generated-artefact boundaries.
7. Check whether documentation and ADR or DCL implications were handled.
8. Report every failure, concern, skipped check, and assumption that could not be verified.

Never claim success without evidence.

## Report format

```text
Verification

Planned behaviour satisfied:
- Yes / No / Partially

Automated verification:
- commands executed
- result

Tests:
- added/changed tests
- behaviour demonstrated

Contracts:
- protobuf/API compatibility
- generated artefacts current

Architecture:
- relevant boundaries preserved
- DCL/ADR implications

Documentation:
- updated / not required / outstanding

Unverified assumptions:
- ...

Failures or concerns:
- ...
```
