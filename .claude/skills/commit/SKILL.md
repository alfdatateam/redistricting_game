---
name: commit
description: Draft a clear, descriptive git commit message based on the current staged and unstaged changes.
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Draft a Commit Message

Review the current changes in this repository and draft a commit message.

## Steps

1. Run `git status` to see all modified, added, and deleted files (never use `-uall`)
2. Run `git diff` to see unstaged changes
3. Run `git diff --cached` to see staged changes
4. Run `git log --oneline -5` to see recent commit style for context

## Commit message format

Write the message in this format:

```
<type>: <short summary in imperative mood> (max 72 chars)

<body — 2-4 bullet points explaining what changed and why>
```

**Type** must be one of:
- `add` — New files, features, or capabilities that didn't exist before
- `update` — Changes to existing functionality (enhancements, modifications)
- `fix` — Bug fixes
- `refactor` — Code restructuring without behavior change
- `config` — Configuration, environment, or infrastructure changes
- `docs` — Documentation only
- `test` — Test additions or changes
- `remove` — Deleting files or features

**Short summary rules:**
- Imperative mood ("Add scraper function" not "Added scraper function")
- No period at the end
- Describe WHAT changed, not HOW

**Body rules:**
- Each bullet starts with a dash
- Focus on WHY the change was made and WHAT it accomplishes
- Reference specific files or components when helpful
- If a change spans multiple concerns, mention each one

## Examples

```
add: Create meeting scraper Cloud Function

- Scrapes Granicus portal for Birmingham council meeting metadata
- Inserts new meetings into Supabase with deduplication check
- Publishes Pub/Sub messages to trigger PDF and MP4 downloads
```

```
update: Extend PDF parser with structured data extraction

- Extract agenda items, votes, attendance, and speakers from minutes
- Add regex patterns for GL accounts and resolution numbers
- Store extracted data in dedicated Supabase tables
```

```
config: Set up GCS bucket with lifecycle policies

- Create bhm-council-meetings-data bucket in US multi-region
- Configure Standard -> Nearline (180 days) -> Coldline (365 days) transitions
- Add bucket_lifecycle.json to config/
```

## Important rules

- NEVER add a "Co-Authored-By" line or any AI attribution to commit messages
- The commit message should contain only the type, summary, and body — nothing else
- Git commits are snapshots, not journals — only describe what the diff actually contains relative to the previous commit. Do not mention intermediate mistakes, refactors, or fixes that happened during development but aren't visible in the final diff.

## After drafting

Present the draft message to me and ask which option I prefer:

1. **Stage and commit** — You run `git add` on the relevant files and `git commit` with the message
2. **Copy to clipboard** — Just show the message so I can paste it into my GUI client
3. **Edit** — Let me modify the message before committing

If I provide additional context with the command (like `/commit fixes the date parsing bug`), incorporate that context into the message. That context is: $ARGUMENTS
