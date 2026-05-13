---
name: scope
description: Walk through scoping a project or feature — ask clarifying questions, then produce a scope document ready for the /guide skill.
argument-hint: [feature description, project idea, or path to existing scope draft]
allowed-tools: Read, Grep, Glob, Task, AskUserQuestion
---

# Project Scope Builder

Scope the following: **$ARGUMENTS**

## Your task

Produce a scope document through guided conversation. The document must be detailed enough to hand directly to the `/guide` skill for implementation guide generation.

## Phase 1: Orient

Determine what kind of scoping this is:

- **Existing codebase feature** — The user wants to add or change something in a project you can read. Explore the codebase first to understand the architecture, conventions, and relevant existing code before asking questions.
- **Greenfield project** — No existing codebase (or the user says to ignore it). Skip codebase exploration and go straight to questions.
- **Scope revision** — The user pointed to an existing scope document. Read it, then ask targeted questions about what to change.

For existing codebase features: use Glob, Grep, and Read to understand the project structure, key files, naming conventions, and any configuration-driven patterns before moving to Phase 2. This lets you ask informed questions instead of generic ones.

## Phase 2: Ask questions

Use AskUserQuestion to walk through these areas **one question set at a time**. Do not dump all questions at once. Ask 1-3 questions per round, wait for answers, then ask follow-up questions informed by the previous answers.

Adapt the questions to what you learned in Phase 1. Skip areas that are already obvious from the codebase or the user's initial description.

### Question areas

**Purpose and deliverables**
- What is the user building and why?
- What are the concrete outputs? (files, tabs, endpoints, UI components, reports, etc.)
- What does "done" look like?

**Data model**
- What is the grain of each output? (one row per ___, one file per ___, etc.)
- What are the primary keys and join keys?
- What are the source inputs? (forms, APIs, databases, spreadsheets, files, user input)
- Are there lookup tables, reference data, or external datasets involved?

**Technical decisions**
- What language, runtime, or framework? (For existing projects, confirm what you found in the codebase.)
- Are there dependencies, services, or APIs to integrate with?
- What are the constraints? (no build step, no external deps, must run in X environment, etc.)
- How will it be triggered or invoked? (manual, scheduled, event-driven, HTTP)

**Normalization and transformation**
- Are there fields that need cleaning, normalizing, or parsing?
- Are there multi-valued fields that need to be split into rows?
- Are there lookups or resolution steps? (fuzzy matching, ID resolution, FIPS codes, etc.)
- What existing utilities or resolvers can be reused?

**Calculations and derived values**
- Are there computed columns or metrics?
- What are the formulas? Get the user to be specific — not "calculate totals" but the actual arithmetic.
- Are there thresholds, flags, or conditional logic?

**Scope boundaries**
- What is explicitly out of scope?
- What is the user responsible for vs. what the code should handle?
- Are there future phases the user is deferring? (Capture these so the scope document doesn't accidentally include them.)

### Question rules

- **Ask only what you don't already know.** If the codebase or the user's description already answers a question, skip it.
- **Use what the user already told you.** Reference their previous answers. "You mentioned the grain is one row per org x tactic — does that mean zeroed-out tactics are excluded, or do they get a row with zeros?"
- **Offer concrete options when possible.** Instead of "how should this work?", propose 2-3 approaches you identified from the codebase or domain and let the user pick.
- **Stop when you have enough.** You do not need to ask about every area. When you can write the scope document without guessing, move to Phase 3. Aim for 2-4 rounds of questions, not 8.

## Phase 3: Write the scope document

Write the scope document to the path the user specified, or to `guides/` with a descriptive filename like `analysis-tabs.md` or `auth-integration.md`.

### Scope document structure

Follow this structure. Omit sections that don't apply (e.g., skip "Existing Code to Reuse" for greenfield projects).

```markdown
# [Feature Name] — Scope Document

## Purpose
[1-2 sentences: what this builds and why it exists. Include who consumes the output.]

---

## Output [Tabs / Files / Endpoints / Components]

### 1. `output_name`

**Grain:** One row per [entity] (keyed by `primary_key`)

| Column / Field | Source | Notes |
|----------------|--------|-------|
| field_name | SOURCE_CONSTANT or description | Primary key, FK, calculated, etc. |
| ... | ... | ... |

[Repeat for each output.]

---

## [Normalization / Transformation / Processing] Logic
[Describe cleaning, parsing, resolution, and lookup steps. Reference specific functions or utilities.]

---

## Calculations
[Table or list of derived values with explicit formulas. No ambiguity.]

---

## Execution Model
[How it runs: manual function, trigger, cron, CLI command, HTTP endpoint. Write mode: append, upsert, clear-and-rewrite.]

---

## Existing Code to Reuse

| What | Where | How |
|------|-------|-----|
| [utility / config / class] | `path/to/file.ext:line` | [brief description] |

---

## New Code to Write

| File | Contents |
|------|----------|
| `path/to/new_file.ext` | [what this file contains] |
| Update `path/to/existing.ext` | [what to add or change] |

---

## Out of Scope
[Bulleted list of things this phase explicitly does not cover.]
```

### Writing rules

- **Be concrete, not abstract.** Column names, file paths, function signatures, formula arithmetic. A scope document that says "calculate metrics" is useless; one that says "`weekly_attempts = weekly_volunteers * weekly_hours * hourly_attempts`" is actionable.
- **Use real names from the project.** If you explored the codebase, reference actual constants, config keys, column mappings, and function names — not generic placeholders.
- **Primary keys and grain are mandatory.** Every output table/file must state its grain and primary key. This is the single most important scoping decision.
- **Capture decisions, not options.** The question phase resolved ambiguities. The scope document should state what *will* happen, not present alternatives.
- **Note what's excluded.** The "Out of Scope" section prevents scope creep during implementation. Be specific: not "future work" but "BigQuery connection setup (user handles this)".
- **Keep it scannable.** Tables over prose. Short rows over long paragraphs. The `/guide` skill will expand this into full implementation detail — the scope document just needs to be unambiguous.
- **Match project conventions.** If the project uses `const`/`let`, `UPPER_CASE` config keys, or specific naming patterns, reflect those in the scope document's examples and column names.
- **Language-agnostic where possible.** The structure works for any stack. Use "Output" not "Output Tabs" if the project doesn't use spreadsheets. Adapt section headers to fit the technology.

## After writing

Tell the user the file path and suggest they review it, then run `/guide <path-to-scope-document>` when ready to generate the implementation guide.
