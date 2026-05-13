---
name: explain
description: Take an educational approach to explain a block of code, a function, a coding convention, or a code snippet provided inline. Invoke with a function name, file path, line range, concept, or paste a code snippet directly.
argument-hint: [function-name, file:line-range, concept, or inline code snippet]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Task
---

# Code Explainer

Explain the code or concept specified by: **$ARGUMENTS**

## Your task

1. Determine the input type:
   - **Function name or file path** — locate it in the codebase and read the source directly.
   - **Convention or concept** — find representative examples in the codebase.
   - **Inline code snippet** — the user pasted code directly (from a guide, a draft, an example file, or from memory). Use the snippet as-is. It may not exist in the codebase yet.
2. For codebase code: read any closely related code it depends on (callers, callees, constants, types).
3. For inline snippets: search the codebase for related code that the snippet references or would interact with (e.g., if it calls `resolveCountyName()`, read that function). Use what you find to enrich the explanation with project-specific context.
4. Produce a clear, educational explanation following the format below.

## Explanation format

### Overview
One paragraph summarizing **what** the code does and **why** it exists in the project. Relate it to the broader system (e.g., "This function is called during the trigger cycle when new field plan rows are detected").

### Line-by-line walkthrough
Walk through the code in logical sections. For each section:
- Quote the relevant lines in a fenced code block
- Explain what those lines accomplish in plain language
- Call out any non-obvious patterns, idioms, or conventions (e.g., "This uses `.reduce()` with an accumulator to merge contiguous ranges — a common functional pattern for collapsing sorted intervals")

### Key concepts
If the code uses patterns or conventions that a learner might not know, explain them:
- **Language features** — destructuring, spread, `padStart`, `Set`, arrow functions, etc.
- **Design patterns** — strategy pattern, configuration-driven classes, reduce walkers, etc.
- **Apps Script specifics** — `PropertiesService`, `getDataRange().getValues()`, sheet vs spreadsheet, etc.
- **Project conventions** — `normalizeField()` for multi-select splitting, `FIELD_PLAN_COLUMNS` for column indices, etc.

### Data flow
Trace the data from input to output:
- What goes in (parameters, sheet data, config values)
- What transformations happen
- What comes out (return value, side effects like writing to a sheet or sending an email)

### Connections
List what calls this code and what this code calls. Show the chain so the reader understands where it fits in the execution flow.

For inline snippets that don't exist in the codebase yet: identify what existing functions, constants, or config values the snippet *would* interact with, and explain how it would fit into the project if implemented.

## Writing rules

- **Teach, don't just describe.** "This loops through rows" is a description. "This iterates each row because the form data arrives as a 2D array where each inner array is one submission" is teaching.
- **Use the project's actual data.** When giving examples of what a value looks like, use realistic values from this project (org names, county names, tactic types) — not generic placeholders.
- **Define terms on first use.** If you mention "Likert value", "FIPS code", "zero-padded", or "denormalized", explain what it means the first time it appears.
- **Compare approaches when useful.** If the code uses a `.reduce()` where a `for` loop would also work, briefly explain why the author may have chosen the functional approach (immutability, chaining, expressiveness).
- **No condescension.** Assume the reader is intelligent but unfamiliar with this specific codebase and possibly with some JavaScript patterns. Explain without being patronizing.
