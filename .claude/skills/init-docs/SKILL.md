---
name: init-docs
description: Scaffold a complete MkDocs documentation site for a project by reading the codebase and generating initial pages, config, and GitHub Pages deployment setup.
---

# Initialize Project Documentation

Scaffold a MkDocs + Material theme documentation site from scratch based on the actual codebase.

## Context

If the user provides additional context: $ARGUMENTS

Use that context to identify the project root, specific focus areas, or customization preferences (e.g., project name, color scheme). If no context is provided, use the current working directory as the project root.

## Steps

### 1. Analyze the project

Before generating anything, understand what you're documenting:

- Read the directory structure to identify major components, modules, and entry points
- Read key source files (configs, main classes, entry points) to understand architecture
- Check for existing documentation (`README.md`, `guides/`, `docs/`, inline comments)
- Read `package.json`, `pyproject.toml`, `.clasp.json`, or similar config files for project metadata
- Check git history for project name, description, and major milestones
- Identify the tech stack (languages, frameworks, platforms)

### 2. Generate mkdocs.yml

Create `docs/mkdocs.yml` at the project root with:

```yaml
site_name: <Project Name>
site_description: <One-line description derived from codebase analysis>
site_url: ''  # Update after GitHub Pages deployment

theme:
  name: material
  palette:
    - scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - search.suggest
    - content.code.copy

plugins:
  - search

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.tabbed:
      alternate_style: true
  - attr_list
  - md_in_html
  - toc:
      permalink: true

nav:
  # Generate based on actual project structure
```

Populate the `nav` section based on the pages you generate in the next step.

### 3. Generate documentation pages

Create pages in a `docs/docs/` directory. Generate only pages that are relevant to the project — skip sections that don't apply.

#### Required pages:

**`index.md`** — Landing page
- Project name and one-paragraph description
- What the project does (derived from code analysis, not generic filler)
- Quick links to key sections
- Tech stack summary

**`architecture.md`** — System architecture
- Component diagram showing how major parts connect (use Mermaid or ASCII)
- Data flow: where data comes from, how it's processed, where it goes
- File organization: which files do what
- Key design decisions visible in the code (e.g., config-driven patterns, class hierarchies)

**`getting-started.md`** — Developer setup
- Prerequisites (runtime versions, tools, access requirements)
- Installation / clone / setup steps
- Configuration (environment variables, script properties, config files)
- How to run the project locally
- How to deploy

#### Conditional pages (generate only if relevant):

**`configuration.md`** — If the project has meaningful configuration
- All configurable values, where they live, what they do
- Example values
- Required vs. optional settings

**`api.md`** or **`functions.md`** — If the project exposes functions, endpoints, or a public interface
- Function signatures with parameters and return types
- Brief description of each
- Usage examples

**`testing.md`** — If test files exist
- How to run tests
- What the tests cover
- How to add new tests

**`deployment.md`** — If deployment is non-trivial
- Step-by-step deployment process
- Environment differences (dev, staging, prod)
- Rollback procedures

**`troubleshooting.md`** — If common issues are apparent from the code
- Error messages and their causes (derived from error handling in the code)
- Common configuration mistakes
- Debugging techniques specific to the tech stack

### 4. Incorporate existing documentation

If the project already has documentation (`guides/`, old `docs/`, `README.md`):

- Read existing content for accurate details, terminology, and context
- Incorporate relevant information into the new pages rather than duplicating
- Link to detailed guides that should remain separate (e.g., implementation guides, migration guides)
- Do NOT copy stale content — verify against the code before including anything

### 5. Add GitHub Pages deployment

Create `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation
on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      - run: pip install mkdocs-material
      - run: mkdocs build --config-file docs/mkdocs.yml --site-dir ../site
        working-directory: docs
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Create .gitignore entries

Add to the project `.gitignore` if not already present:

```
site/
```

### 7. Report results

Present to the user:
- List of all files created
- Summary of what each page covers
- Any information gaps where you couldn't determine details from the code
- Instructions for local preview: `pip install mkdocs-material && mkdocs serve --config-file docs/mkdocs.yml`
- Instructions for deployment: push to main, or run `mkdocs gh-deploy --config-file docs/mkdocs.yml`

## Important rules

- Every claim in the generated docs must come from the actual code — never invent features or capabilities
- Use the project's own terminology (class names, function names, config keys) — don't paraphrase into generic terms
- Keep pages concise — a developer should be able to read any page in under 5 minutes
- Use code blocks with the correct language identifier for syntax highlighting
- If you can't determine something from the code, leave a clear placeholder: `<!-- TODO: describe X -->`
- Do not generate end-user documentation unless the project has a user-facing interface
- Prefer Mermaid diagrams over ASCII art for architecture diagrams (MkDocs Material supports them)
