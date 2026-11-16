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

