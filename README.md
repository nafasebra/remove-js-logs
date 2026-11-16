# remove-js-logs

A lightweight Node.js CLI tool for removing `console` statements from JavaScript and TypeScript projects.

Built as a small open-source utility to explore source code transformation, Abstract Syntax Trees (ASTs), and CLI development.

[View on npm](https://www.npmjs.com/package/remove-js-logs)

## Project Status

**Archived — No Longer Maintained**

The idea behind this project dates back several years, when I was exploring ways to automate repetitive development tasks and learn more about source code transformation.

Today, there are more mature and reliable tools available for removing debugging statements, including linters, build-time transformations, and AI-assisted coding tools that can handle similar tasks.

I wouldn't necessarily recommend this tool for modern production projects, especially when more established alternatives are available.

However, I decided to keep this repository public because it represents an important learning experience in building CLI tools, working with Abstract Syntax Trees (ASTs), and publishing open-source packages.

**The value of this project today is not the problem it solves, but what I learned while building it.**

## The Problem

During development, we often add `console.log()` statements for debugging. Over time, these statements can accumulate across a codebase.

I wanted a simple tool that could scan a project, identify specific console methods, and remove them without manually editing each file.

Rather than building a one-off script, I decided to turn the solution into a reusable CLI package that other developers could install and run.

## Features

- Removes selected console methods, including `log`, `warn`, `error`, and `info`
- Supports JavaScript, TypeScript, JSX, and TSX
- Recursively scans project directories
- Supports dry-run mode to preview changes
- Supports creating `.bak` backups before modifying files
- Available as an npm package

## Technical Decisions

### Why AST Instead of Regular Expressions?

One of the most important decisions was using an **Abstract Syntax Tree (AST)** instead of regular expressions to identify console statements.

A regular expression could match simple patterns such as `console.log(...)`, but JavaScript has a complex syntax. Calls may contain nested expressions, span multiple lines, or appear inside other expressions.

Using Babel allowed me to work with the structure of the code rather than treating source files as plain text.

The transformation follows three steps:

1. **Parse:** Convert source code into an AST using `@babel/parser`.
2. **Traverse:** Visit `CallExpression` nodes using `@babel/traverse` and identify selected console methods.
3. **Generate:** Convert the modified AST back into source code using `@babel/generator`.

This approach provided a more structured foundation for code transformation and support for JSX and TypeScript syntax.

### Why a CLI Tool?

I wanted the solution to be usable across different projects without requiring integration with a particular frontend framework or build tool.

Node.js was a natural choice because it provides filesystem APIs and integrates with npm.

The CLI can accept a target directory, scan its files, and apply the transformation wherever matching statements are found.

### Why Dry-Run and Backup Options?

Automated source code modifications can be risky, especially when applied across an entire project.

I added two options to make the tool easier to inspect and use:

- **Dry Run:** Reports the number of matching console calls without writing changes to the files.
- **Backup:** Creates a `.bak` copy before overwriting a modified file.

These options helped me explore an important consideration in developer tooling: users should have visibility into potentially destructive operations.

## What I Learned

Building this tool gave me practical experience with several topics beyond everyday application development.

**1. Abstract Syntax Trees and Code Transformation**

I gained a better understanding of how source code can be parsed into structured nodes, inspected, modified, and generated again.

**2. Building and Publishing CLI Tools**

I explored how Node.js applications can be exposed as executable commands and distributed through npm.

**3. Filesystem Operations**

Working with recursive directory traversal, file reading, and file modification helped me understand the practical challenges of automating operations across a codebase.

**4. Designing Safer Developer Tools**

Implementing preview and backup options highlighted the importance of protecting users from unintended changes.

**5. Understanding the Limits of AST Transformations**

Using an AST is more reliable than basic text matching, but it does not automatically guarantee that a transformation preserves program behavior.

Removing a function call can also remove side effects from its arguments or affect surrounding expressions. This is an important consideration when designing source code transformation tools.

## Installation

Install globally:

```bash
npm install -g remove-js-logs
```

## Usage

Remove default `console.log()` calls from a directory:

```bash
remove-logs ./src
```

Remove selected console methods:

```bash
remove-logs ./src log,info
```

Remove all supported console methods:

```bash
remove-logs ./src all
```

Preview changes without modifying files:

```bash
remove-logs ./src --dry-run
```

Create backups before modifying files:

```bash
remove-logs ./src --backup
```

## Limitations

This project was built as a focused developer utility rather than a production-grade codemod engine.

Some known limitations include:

- Removing console calls may affect expressions with side effects.
- The current recursive directory traversal does not exclude dependency or build directories.
- Re-generating code from an AST may change source formatting.
- The tool does not perform semantic analysis to guarantee behavior preservation.

For these reasons, changes should be reviewed before use in important codebases.

## Tech Stack

- **Node.js** — CLI execution and filesystem operations
- **JavaScript** — Implementation
- **@babel/parser** — Parsing source code into ASTs
- **@babel/traverse** — Finding and transforming AST nodes
- **@babel/generator** — Generating modified source code
- **npm** — Package distribution

## Project Status

**Archived — No Longer Maintained**

This repository is preserved as an open-source project and a record of my experience building developer tools and exploring source code transformation.

No further development or maintenance is planned.

## License

MIT License.
