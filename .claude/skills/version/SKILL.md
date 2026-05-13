---
name: version
description: Bump the version of a project, update its CHANGELOG.md, and create an annotated git tag.
allowed-tools: Bash(git *), Read, Edit, Glob, Grep
argument-hint: "<bump> [project]  — e.g. /version patch 2026, /version minor, /version 2.1.0"
---

# Bump Version

Update the changelog, and create an annotated git tag for a project release.

## Context

If the user provides arguments: $ARGUMENTS

Parse them as `<bump> [project]`:
- **bump** (required): One of `major`, `minor`, `patch`, or an explicit version like `2.1.0`
- **project** (optional): A short project name to scope the tag. Defaults to `fieldplan-analyzer`.

If no arguments are provided, ask the user what kind of bump they want (`major`, `minor`, or `patch`).

## Conventions

### Tag format
Tags are namespaced by project to avoid collisions in the monorepo:
```
<project>/v<MAJOR>.<MINOR>.<PATCH>
```
Examples: `fieldplan-analyzer/v1.0.0`, `fieldplan-analyzer/v1.1.0`

### Changelog format
Follows [Keep a Changelog](https://keepachangelog.com/). Categories map to the repo's commit verb convention:

| Commit prefix | Changelog category |
|---|---|
| `add:` / `added:` | **Added** |
| `update:` | **Changed** |
| `fix:` / `fixed:` | **Fixed** |
| `refactor:` | **Changed** |
| `remove:` / `removed:` | **Removed** |
| `config:` | **Changed** |
| `docs:` | **Changed** |
| `test:` | **Added** (under test context) |

### Project-to-path mapping
| Project key | Changelog path | Git log path filter |
|---|---|---|
| `fieldplan-analyzer` | `fieldplan_analyzer/CHANGELOG.md` | `fieldplan_analyzer/` |

If the user specifies a project not in this table, ask them for the changelog path and log path filter, then proceed.

## Steps

### 1. Determine the current version

```bash
git tag --list '<project>/v*' --sort=-version:refname
```

Take the first result as the current version. If no tags exist, treat the current version as `0.0.0`.

### 2. Compute the next version

- If **bump** is `major`: increment MAJOR, reset MINOR and PATCH to 0
- If **bump** is `minor`: increment MINOR, reset PATCH to 0
- If **bump** is `patch`: increment PATCH
- If **bump** is an explicit version string (e.g. `2.1.0`): use it directly, but warn if it is not greater than the current version

### 3. Gather changes since the last tag

If a previous tag exists:
```bash
git log <previous-tag>..HEAD --oneline -- <git-log-path-filter>
```

If no previous tag exists, gather all commits:
```bash
git log --oneline -- <git-log-path-filter>
```

If there are **no commits** since the last tag, stop and tell the user there is nothing to release.

### 4. Categorize the commits

Parse each commit message's prefix and sort into changelog categories:
- **Added** — `add:`, `added:`, `test:` prefixed commits
- **Changed** — `update:`, `refactor:`, `config:`, `docs:` prefixed commits
- **Fixed** — `fix:`, `fixed:` prefixed commits
- **Removed** — `remove:`, `removed:` prefixed commits

Commits that don't match any prefix go under **Changed** with their full message.

Write each entry as a concise, human-readable bullet point. Clean up the commit message:
- Remove the prefix verb
- Use imperative mood if the original doesn't
- Capitalize the first word
- Keep it to one line

### 5. Update the CHANGELOG.md

Read the existing changelog file. Replace the `## [Unreleased]` section's contents with an empty section, and insert the new version section directly below it:

```markdown
## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD
### Added
- ...
### Changed
- ...
### Fixed
- ...
### Removed
- ...
```

Only include categories that have entries. Use today's date in `YYYY-MM-DD` format.

If the changelog file does not exist, create it with this template:

```markdown
# Changelog — <Project Name>

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD
### Added
- ...
```

### 6. Present the changelog update for review

Show the user:
- The version being created (e.g. `1.0.0 → 1.1.0`)
- The full new changelog section that will be inserted
- The tag that will be created

Ask the user to choose:
1. **Stage, commit, and tag** — Stage the changelog, commit it, and create the tag
2. **Edit** — Let the user modify the changelog entries before proceeding
3. **Abort** — Cancel the release

### 7. Commit and tag

If the user approves:

```bash
git add <changelog-path>
git commit -m "<type>: Release <project> v<X.Y.Z>"
git tag -a "<project>/v<X.Y.Z>" -m "<Project Name> v<X.Y.Z>"
```

Use `docs` as the commit type since it's a changelog-only change.

Then confirm success:
```bash
git tag --list '<project>/v*' --sort=-version:refname
git log --oneline -1
```

### 8. Report results

Tell the user:
- The new version number and tag name
- How many commits were included in this release
- Remind them to `git push && git push --tags` when ready to publish

## Important rules

- NEVER push to the remote — only create local commits and tags
- NEVER amend a previous commit — always create a new commit for the changelog update
- NEVER skip the user review step — always show the changelog draft before committing
- NEVER add a "Co-Authored-By" line or any AI attribution to commit messages
- If the working tree has uncommitted changes unrelated to the changelog, warn the user and ask if they want to proceed or commit those changes first
- Respect the existing changelog formatting — match indentation, heading style, and bullet style of the file
