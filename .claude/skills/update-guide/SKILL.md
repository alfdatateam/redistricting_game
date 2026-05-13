---
name: update-guide
description: Sync an implementation guide with the actual codebase — fix outdated instructions, correct mismatched code samples, update line numbers, and flag architectural changes that invalidate guide steps.
---

# Update Implementation Guide Content

Compare an implementation guide against the actual code and other guides, then update it so its instructions match reality.

## Context

If the user provides additional context: $ARGUMENTS

Use that context to identify the specific guide file, section, or concern. If no context is provided, search for implementation guide files in `guides/` directories or files matching `*guide*`, `*implementation*`.

## Steps

### 1. Locate the guide and related guides

- Find the target guide file
- Find any companion guides it references (e.g., email design guide, column mapping guide)
- Read all of them to understand how they relate to each other

### 2. Read the actual source code

For each step in the guide that includes code snippets (FIND/REPLACE blocks, function replacements, new code to add):

- Read the corresponding source file at the lines referenced
- Compare the guide's "current code" or "FIND" block against what actually exists in the file
- Compare the guide's "REPLACE" or "ADD" block against what the code should become
- Note the actual current line numbers for referenced code

### 3. Identify mismatches

Look for these categories of problems:

#### A. Stale code samples
- Guide shows "current broken code" that has already been partially or fully fixed
- Guide's FIND block doesn't match the actual file contents (code was changed since the guide was written)
- Line number references are wrong because code was added or removed above them

#### B. Architectural drift
- Guide assumes a function signature, class structure, or variable name that has since changed
- Guide references a constant, config object, or utility that was renamed, moved, or restructured
- Guide tells you to create something that already exists (or modify something that was deleted)

#### C. Cross-guide conflicts
- Two guides give contradictory instructions for the same code
- One guide assumes a change from another guide that hasn't been applied yet, without noting the dependency
- A companion guide references patterns or structures that the main guide doesn't account for

#### D. Missing steps
- Code changes that were made outside the guide introduced new requirements the guide doesn't cover
- A guide step depends on prior work that isn't documented in any guide

### 4. Update the guide

For each mismatch found:

- **Update code samples** — Replace stale FIND blocks with the actual current code from the source file
- **Update line numbers** — Correct line references to match the current file
- **Update instructions** — If the approach changed (e.g., a local variable was replaced by a centralized constant), rewrite the step to reflect the current architecture
- **Add dependency notes** — If a step now depends on work done outside the guide, add a note like "**Prerequisite**: Step X must be completed first" or "**Note**: This was already done in commit `abc1234`"
- **Remove obsolete steps** — If a step is fully obsolete (the problem it solves no longer exists), strike it through and explain why
- **Flag unresolvable conflicts** — If you find a conflict you cannot resolve without the user's input, leave a clearly marked note: `<!-- NEEDS REVIEW: description of the conflict -->`

### 5. Report changes

Present a summary to the user:

- List each update you made, grouped by category (stale code, architectural drift, cross-guide conflict, missing step)
- For each update, briefly explain what was wrong and what you changed
- Call out any items marked `NEEDS REVIEW` that require the user's decision

## Important rules

- Always read the actual source file before updating a guide's code sample — never assume the guide is correct
- Preserve the guide's instructional tone and structure — you are updating content, not rewriting the guide
- Do not change steps that are still accurate — only touch what needs fixing
- When updating FIND/REPLACE blocks, make sure the new FIND block is an exact match for the current source code
- If a step references a function that was renamed, update all references to the new name throughout the step
- When line numbers shift, update them throughout the step, not just in one place

## Docstring style

Code samples in the guide must use **concise JSDoc docstrings**. Keep them short — one description line, typed `@param`/`@returns` tags, and **two `@example` lines**: one working case and one edge case, each showing the full return value. Do not pad docstrings with verbose explanations or restated context that the surrounding guide prose already covers.

**Good:**
```javascript
/**
 * Resolve an org name to its VAN committee ID via exact, normalized, or contains match.
 * @param {string} orgName - Organization name from the field plan form
 * @returns {{found: boolean, committeeId: string|null, committeeName: string|null, matchType: string}}
 * @example resolveVanId('NAACP') // { found: true, committeeId: '12345', committeeName: 'NAACP', matchType: 'exact' }
 * @example resolveVanId('')      // { found: false, committeeId: null, committeeName: null, matchType: 'none' }
 */
```

**Bad — too verbose, no examples:**
```javascript
/**
 * Resolve an org name to its VAN committee ID.
 *
 * This function looks up the organization name in the van_id_lookup sheet
 * tab, normalizes the name for fuzzy matching, and returns the committee
 * ID string that will be used downstream by the query builder to construct
 * BigQuery SQL. If no match is found it returns null so the caller can
 * decide how to handle missing orgs.
 *
 * @param {string} orgName - The full organization name exactly as it
 *   appears in the Google Sheets field plan submission row, before any
 *   normalization or cleaning has been applied
 * @returns {string|null} The VAN committee ID string if a match is found
 *   in the lookup table, or null if the organization could not be resolved
 */
```

When updating guide code samples, trim any existing verbose docstrings down to this concise style and ensure each has two `@example` lines.

## Writing for clarity — assume a beginner audience

The guide may be followed by someone who is not an expert. Every FIND/REPLACE step must be explicit enough that a beginner can follow it without making mistakes:

- **Always show complete FIND and REPLACE code blocks** — never use shorthand like "replace X with Y" without showing the full lines of code in context. The reader must be able to copy-paste directly.
- **Show the entire line, not just the changed part** — a beginner needs to see exactly what the line looks like before and after, including surrounding code for context
- **Call out common mistakes** — if a replacement involves a pattern that is easy to get wrong (e.g., passing a string where an object is expected, forgetting to wrap a lookup in another function call), add a "Common mistake to avoid" section with a concrete WRONG example and explanation of what goes wrong
- **Explain what each part returns** — if a replacement changes a function call chain (e.g., `getProperty()` returns a string that must be passed to `getSheetByName()`), explain what each function returns and why the chain matters. A beginner doesn't know that `scriptProps.getProperty('X')` returns a string, not a sheet.
- **Use consistent variable naming examples** — when a step involves multiple variables of the same type, show clear naming conventions so the reader doesn't accidentally reuse a name or mix them up
- **Never use arrows (→) as the only instruction** — arrows like `getSheetByName('old') → use scriptProps.getProperty('NEW')` are ambiguous. Always accompany them with a complete FIND/REPLACE code block showing the full before and after
