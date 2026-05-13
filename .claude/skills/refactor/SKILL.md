---
name: refactor
description: Produce a step-by-step refactoring guide for a function or block of code — explains the current code, identifies the opportunity, and walks the user through making the change themselves.
argument-hint: [function-name, file:line-range, or description]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Task
---

# Refactoring Guide

Produce a step-by-step refactoring guide for: **$ARGUMENTS**

## Your task

1. Locate the target code. If the argument is a function name, find it in the codebase. If it's a file path or line range, read that directly.
2. Read the code and all related code (callers, callees, shared constants) to understand the full impact surface.
3. Identify the refactoring opportunity and categorize it (see Refactoring Types below).
4. Write a step-by-step guide that teaches the user how to perform the refactor themselves.

## Refactoring types

### Style transformation (declarative / imperative)
- **To declarative:** Replace `for`/`while` loops with `.map()`, `.filter()`, `.reduce()`, `.find()`, `.flatMap()`, `.some()`, `.every()`. Prefer method chaining. Eliminate mutable accumulators where possible.
- **To imperative:** Replace functional chains with explicit loops when the user requests it (e.g., for readability in deeply nested transforms, or when early termination matters for performance).

### Time complexity improvement
- Identify the current time complexity and explain it
- Propose a lower-complexity alternative (e.g., replacing nested `.find()` inside `.map()` with a pre-built `Map` or `Set` for O(1) lookups)
- Call out the tradeoff (memory vs speed, readability vs performance)
- Only optimize where it matters — if the dataset is always small (< 100 rows), say so and let the user decide

### DRY (Don't Repeat Yourself)
- Identify duplicated logic across functions or files
- Propose extracting shared logic into a reusable helper, constant, or configuration object
- Show every call site that would need to be updated

## Guide format

### 1. Current code
Show the full function(s) in a fenced code block with the file path and line numbers.

### 2. What this code does
A plain-language explanation of the current logic — what goes in, what happens, what comes out. Same educational tone as the `/explain` skill.

### 3. What to improve
Explain the specific issue:
- **If style:** "This `for` loop accumulates results into a mutable array. The same logic can be expressed as a `.map()` chain, which makes the intent clearer and eliminates the mutable variable."
- **If complexity:** "The nested `.find()` inside `.forEach()` creates O(n*m) time. Pre-building a lookup `Map` from the inner array reduces the inner search to O(1)."
- **If DRY:** "This pattern appears in 3 functions. Extracting it into a shared helper reduces duplication and ensures future changes only need to happen in one place."

### 4. Step-by-step instructions
Numbered steps walking the user through the refactor. Each step should:
- Tell the user exactly what to change (which lines, which file)
- Show the **before** snippet and the **after** snippet in fenced code blocks
- Explain **why** the change works — what JavaScript feature or pattern is being used, and why it produces the same result
- Call out gotchas (e.g., "`.reduce()` needs an initial value here because the array could be empty — without it, you'd get a TypeError")

### 5. Impact check
List every function and file that calls the refactored code. For each one, state whether it needs changes (and what) or whether it's unaffected because the public interface didn't change.

### 6. Verify
Tell the user how to confirm the refactor didn't break anything:
- What test functions to run (reference actual test functions in the project like those in `field_test_functions.js` or `budget_test_functions.js`)
- What to spot-check in the spreadsheet
- What the output should look like if it's working correctly

## Rules

- **Guide, don't execute.** This skill produces instructions for the user to follow. Do not edit files directly.
- **Never change behavior.** A refactor must produce the same outputs for the same inputs. If you discover a bug while analyzing, flag it separately — do not fold a fix into the refactor steps.
- **Follow project conventions.** Use `const`/`let` (never `var`), template literals, `.includes()` over `.indexOf()`, and the project's JSDoc style (concise description, typed params, two `@example` lines).
- **One concern at a time.** If the user asks for a DRY refactor, don't also restyle to declarative unless asked. Keep the guide focused.
- **Preserve the public interface.** Function names, parameter signatures, and return shapes must not change unless the user explicitly requests it.
- **Show your reasoning.** When choosing between two valid approaches, briefly explain why you recommend one over the other and let the user decide.
- **Ask before large scopes.** If the refactor would touch more than 3 functions or 2 files, present an outline and ask the user which parts to tackle first.
