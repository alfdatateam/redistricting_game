---
name: guide
description: Generate a detailed, step-by-step implementation guide for a specific phase or feature of the Redistricting Game project. Invoke manually when ready to build a new phase.
argument-hint: [phase-number-or-topic]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, WebFetch, WebSearch, Task, Bash
---

# Implementation Guide Generator

Create a comprehensive, step-by-step implementation guide for: **$ARGUMENTS**

## Your task

1. When in doubt, reorient yourself to the purpose and structure of the project by reviewing the source files under `src/`, `index.html`, `tsconfig.json`, and `package.json`.
2. Read any previously completed implementation guides in `guides/` to maintain consistency in style, depth, and patterns.
4. Write the complete implementation guide as a new file in `guides/`

## Writing rules — follow these exactly

**Verify claims against the codebase before writing.** Before documenting how a system works (e.g., how modules are structured, how the build pipeline runs, what libraries are used), read the actual source files to confirm. Do not assume a tool's general capabilities apply to this project — check how the project specifically uses it.

**Separate actionable steps from informational context.** Explanations of concepts, background, and "how it works" content are valuable and should be included — but they must never be presented as numbered steps the reader needs to perform. If a feature exists in a tool but is not required for the guide's stated goal, it can be documented in a clearly labeled reference or advanced section, not intermixed with the core instructions.

**Never give an instruction then immediately correct it.** Identify the correct instruction before writing it. If a step has a prerequisite, constraint, or caveat, state the constraint first. Do not write "do X" followed by "actually, X won't work because Y — do Z instead."

**Review the guide after writing it.** Re-read each numbered step and ask: does the reader need to perform this step for the guide's stated goal to be achieved? If a step is informational but not required, either move it to a reference section or convert it from a numbered step to explanatory prose.

**No assumptions about prior knowledge.** When a tool, service, command, concept, or library appears for the first time in the guide, explain what it is and why it's being used. Write as if the reader is encountering it for the first time.

**Full implementation code.** Every file that needs to be created or modified must be shown in its entirety. Never write "implement this yourself", "add your logic here", "...", or similar placeholders. Never truncate code with comments like "rest of the code". Every function, every import, every line.

**Step-by-step with no skipped steps.** Number every step. If a step has sub-steps, number those too. If something needs to happen before something else, make the ordering explicit. Include the exact terminal commands to run, the exact file paths to create, and the exact configuration to set.

**Show complete FIND/REPLACE blocks.** Every code change must show the full before and after in fenced code blocks. Never use shorthand like "replace X → Y" without showing the complete lines of code in context. The reader must be able to copy-paste directly. Include line numbers for easy navigation.

**Call out common mistakes.** If a replacement involves a pattern that is easy to get wrong (e.g., a type mismatch, a missing generic parameter, an incorrect import path), add a "Common mistake to avoid" section with a concrete WRONG code example and an explanation of what goes wrong and why.

**Show what each part returns.** When a replacement involves chained calls or composed types, explain what each function returns and why the chain matters. A beginner doesn't know that `document.querySelector<HTMLCanvasElement>('#canvas')` returns `HTMLCanvasElement | null`, not `HTMLCanvasElement`.

**Use consistent variable naming examples.** When a step involves multiple variables of the same type (e.g., two DOM element lookups), show clear naming so the reader doesn't accidentally reuse a name or mix them up.

**Explain every terminal command.** When a command has flags (like `npx tsc --noEmit --watch`), explain what each flag does either inline or in a note block after the command.

**Reference real project values.** Use the actual file paths and config values from this project — not generic placeholders. Read `tsconfig.json` and `package.json` to get these values.

**Use modern TypeScript.** The project uses Vite with vanilla TypeScript (ES modules). Use modern syntax throughout:
- `const` / `let` — never `var`
- Arrow functions for callbacks (`arr.map(x => x.id)`, not `arr.map(function(x) { return x.id; })`)
- Template literals, destructuring, default parameters, spread/rest operators
- Explicit type annotations on function signatures and exported values
- `interface` for object shapes, `type` for unions and intersections
- Generics where they improve type safety (e.g., `querySelector<T>`)
- `Map`, `Set`, `readonly`, `as const`, discriminated unions where appropriate
- `.find()`, `.filter()`, `.map()`, `.reduce()`, `.flatMap()`, `.forEach()` over manual for-loops
- Shorthand property names (`{ queries, errors }` not `{ queries: queries, errors: errors }`)

**Use TypeScript strict mode patterns.** The project uses strict TypeScript. Handle nullability explicitly — use non-null assertions only when you can prove the value exists, prefer narrowing and early returns otherwise. Avoid `any`; use `unknown` with type guards when the type is truly unknown.

**Style for Guide.** Match this pattern:
- Each major section starts with "Understand [concept]" before building
- Code files include a brief module-level doc comment: one sentence on what the file does, then a list of its exported functions/types.
- Function docs: one-line summary of what the function does. Then `@param` and `@returns` tags — keep descriptions to a few words, not full sentences. Always include exactly two `@example` lines — one working case and one edge case — each starting with the function call (not a variable assignment), showing the return value with `// =>`, using realistic project data, and fitting on 1–2 lines.
- Comments explain WHY, not just WHAT

## Guide structure template

**Table of Contents links must be navigable.** Every entry in the Table of Contents must be a markdown link whose anchor slug matches the auto-generated ID of its target heading. GitHub-flavored markdown generates anchor IDs by lowercasing the full heading text, replacing spaces with hyphens, and stripping punctuation like colons. Always derive the slug from the complete heading text — never abbreviate or paraphrase it. After writing the TOC, verify each anchor slug against its corresponding heading to ensure they match exactly.

**Easy Navigation** Ensure that every step is hyper-linked at the title so that it is easy to navigate to the very next step, the previous step, and the table of contents from each header section. Ensure that the checklist headers are hyperlinked to the associated section.

```markdown
# Phase N: [Title] — Complete Implementation Guide

**Version**: 1.0
**Date**: [today]

---

## What You Will Build
[List of concrete deliverables]

### Architecture Overview
[ASCII diagram showing how components connect]

---

## Table of Contents
[Numbered list of all parts]

---

## Prerequisites
[What must be complete before starting, software needed]

---

## Part 1: [First major section]
### Step 1.1: [First step]
...

## Part N: Testing
## Part N+1: Build & Deploy
## Part N+2: Verification

---

## Troubleshooting
[Common problems with solutions]

## Completion Checklist
[Checkboxes for every deliverable]
```

## Important context

- The project root is at `/Users/richardscc1/alf_dev/redistricting_game`
- Built with Vite + vanilla TypeScript (no framework)
- Entry point: `index.html` → `src/`
- Build: `tsc && vite build`
- Dev server: `vite` (with HMR)

Write the guide to `guides/` with a descriptive filename like `phase1_implementation_guide.md`.
