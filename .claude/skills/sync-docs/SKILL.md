---
name: sync-docs
description: Compare existing documentation against the actual codebase and fix or flag inaccuracies — stale references, wrong names, outdated architecture descriptions, and missing coverage.
---

# Sync Documentation with Codebase

Audit documentation for accuracy against the actual source code and fix what's wrong.

## Context

If the user provides additional context: $ARGUMENTS

Use that context to focus on specific files, sections, or concerns. If no context is provided, audit all documentation found in the project.

## Steps

### 1. Locate all documentation

Find every documentation source in the project:

- `docs/` directory (MkDocs site, Jekyll site, or plain markdown)
- `README.md` at project root and in subdirectories
- `guides/` directories
- Any other `.md` files that serve as documentation
- Inline documentation referenced by docs (e.g., JSDoc, docstrings)

Read each file to understand what it claims about the codebase.

### 2. Extract verifiable claims

For each documentation file, identify claims that can be checked against code:

- **Class and function names** — Does `FooClass` still exist? Was it renamed?
- **File paths and line numbers** — Does `src/bar.js:42` still contain what the docs say?
- **Code samples** — Does the FIND/REPLACE block match the actual file?
- **Architecture descriptions** — Does "X calls Y which writes to Z" match the actual data flow?
- **Configuration references** — Do the documented settings, column names, or properties exist?
- **Feature descriptions** — Does the code actually do what the docs say it does?
- **Sheet names, URLs, identifiers** — Are hardcoded references current?

### 3. Verify each claim against the source code

For each verifiable claim:

- **Read the actual source file** at the referenced location
- **Search the codebase** if the reference has moved (use Grep/Glob)
- **Compare** what the docs say vs. what the code does

Categorize findings:

#### A. Incorrect — docs say something demonstrably wrong
- Function was renamed but docs use the old name
- Code sample doesn't match the actual file
- Architecture description contradicts the actual data flow
- Line numbers point to wrong code

#### B. Stale — docs describe something that no longer exists
- Class or method was deleted
- Configuration option was removed
- Feature was replaced by a different approach

#### C. Missing — code has something the docs don't cover
- New functions, classes, or modules with no documentation
- New configuration options not mentioned in docs
- Architectural changes (e.g., new centralized constant) not reflected

#### D. Accurate — docs match the code
- Note these too, so the user knows what's verified

### 4. Fix or flag each issue

**For issues you can fix confidently:**

- Update the documentation with correct information from the source code
- Fix class/function names to match current code
- Update code samples to match actual file contents
- Correct line number references
- Update architecture descriptions based on actual code flow

**For issues requiring user judgment:**

- Leave a clear marker: `<!-- NEEDS REVIEW: description -->`
- Examples: feature was deleted but may come back, two valid approaches exist, business context needed

**For missing coverage:**

- Add a note at the end of the relevant doc page listing undocumented items
- Do not write full documentation for new features — that's `/init-docs` or `/gen-readme` territory
- Format: `<!-- UNDOCUMENTED: brief description of what needs docs -->`

### 5. Check cross-document consistency

After fixing individual files, check that documents agree with each other:

- README and docs site describe the same architecture
- Getting started guide matches actual setup requirements
- Implementation guides reference current function names and patterns
- No two documents give contradictory instructions

### 6. Report results

Present a summary organized by severity:

#### Fixes made
List each correction:
```
- docs/architecture.md: Updated class name `PhoneTactic` → `TacticProgram` (lines 42, 67, 89)
- README.md: Corrected file path `src/old_file.js` → `src/new_file.js`
```

#### Issues flagged for review
List items marked with `<!-- NEEDS REVIEW -->`:
```
- docs/configuration.md line 23: Setting `FOO_BAR` — not found in code, may be deprecated
```

#### Undocumented items found
List items marked with `<!-- UNDOCUMENTED -->`:
```
- TACTIC_BUDGET_MAP constant in budget_trigger_functions.js — no documentation exists
```

#### Verified accurate
Summarize what was checked and found correct:
```
- docs/getting-started.md: All setup steps verified against current configs
- README.md: Project structure section matches actual directory layout
```

#### Statistics
```
Files audited: X
Claims verified: X
Fixes made: X
Issues flagged: X
Undocumented items: X
```

## Important rules

- Always read the source file before changing a doc — never assume the doc is wrong without checking
- Fix only what you can verify — if you're unsure, flag it for review instead of guessing
- Preserve the document's tone, structure, and formatting — you're correcting content, not rewriting
- When fixing code samples, make sure the replacement is an exact match for the current source
- Do not add new documentation sections — only correct existing content and flag gaps
- Do not delete documentation — strike through or flag obsolete content so the user can decide
- If a document references another document, verify that the cross-reference is still valid
