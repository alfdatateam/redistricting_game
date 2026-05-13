---
name: track-completion
description: Update an implementation guide's progress summary, known bugs list, and completion checklist based on the current state of the codebase and git history.
---

# Update Implementation Guide Progress

Audit the codebase against an implementation guide and mark completed work.

## Context

If the user provides additional context: $ARGUMENTS

Use that context to identify the specific guide file or focus area. If no context is provided, search the repository for implementation guide files (look in `guides/` directories or for files with names like `*guide*`, `*implementation*`).

## Steps

### 1. Locate the guide

- If the user specified a guide file, use that
- Otherwise, search for markdown files that contain implementation steps, checklists, or phase/step structures
- Read the full guide to understand its structure (phases, steps, checklists, progress summary, known bugs)

### 2. Gather evidence from git history

- Run `git log --oneline` on the current branch to see all commits
- Identify commits that relate to guide steps based on commit messages
- Note the commit hashes for completed work

### 3. Verify completion against the codebase

For each step or checklist item in the guide, verify whether the work has actually been done by checking the source code directly. Do not rely solely on commit messages. For each item:

- **Search the codebase** for patterns the guide says should exist (or should no longer exist)
- **Read the relevant source files** to confirm the changes are in place
- Mark as DONE only if the code matches what the guide specifies
- Mark as PARTIALLY DONE if only some parts are complete, and note what remains
- Mark as NOT DONE if the code still has the original problem

### 4. Update the guide

Make three types of updates to the guide file:

#### A. Progress Summary Table

- Add rows for newly completed steps with their commit hashes and DONE status
- Update the "based on git history through commit" reference to the latest commit
- In the "Remaining" table, strike through completed phases using `~~text~~`

#### B. Known Bugs List

- Strike through fixed bugs using `~~text~~` and append "FIXED in `commit_hash`"
- Leave unfixed bugs as-is

#### C. Completion Checklist

- Change `- [ ]` to `- [x]` for completed items and append the commit hash in parentheses
- If an entire phase is complete, append "COMPLETE" to the phase heading
- Leave incomplete items as `- [ ]`

### 5. Report results

After updating the guide, present a summary table to the user showing:

| Phase | Status | Items Done | Items Remaining |
|-------|--------|------------|-----------------|

List any items that are PARTIALLY DONE with specifics on what remains.

## Important rules

- Never mark something as done without verifying it in the source code
- Preserve all existing guide content that is still relevant — only add markings, don't delete instructions
- Use strikethrough (`~~text~~`) for completed items in narrative sections; use `[x]` for checklist items
- Always include commit hashes when marking items as done
- If a step was done across multiple commits, list all relevant hashes
