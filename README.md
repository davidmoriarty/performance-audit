# Performance Audit

[![GitHub Release](https://img.shields.io/github/v/release/davidmoriarty/performance-audit)](https://github.com/davidmoriarty/performance-audit/releases/latest)
[![License](https://img.shields.io/github/license/davidmoriarty/performance-audit)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/davidmoriarty/performance-audit)](https://github.com/davidmoriarty/performance-audit/commits/main)

A TypeScript CLI for running Lighthouse audits against one or more web applications.

It generates:

- HTML reports
- Lighthouse JSON reports
- Compact `summary.json` files for dashboards, trend analysis, and CI pipelines.

## Vision

Performance Audit is intended to become a lightweight performance toolkit for developers.

The long-term goal is to provide:

- repeatable Lighthouse audits
- historical performance tracking
- dashboards
- CI integration
- support for any web application or framework

## Features

- TypeScript
- Lighthouse integration
- Mobile performance audits
- HTML + JSON output
- Machine-readable summaries
- Configurable project list
- Works with any public website

## Installation

```bash
npm install
```

## Usage

Audit a project:

```bash
npm run audit -- task-ledger
```

Compile the project:

```bash
npm run build
```

Run type checking:

```bash
npm run typecheck
```

## Project Configuration

Projects are defined in:

```text
src/projects.config.ts
```

Example:

```ts
const projects = {
  "task-ledger": {
    name: "Task Ledger",
    root: "../task-ledger",
    url: "https://task-ledger.davidmoriarty.dev",
  },
};
```

## Output

Each audit generates a timestamped directory:

```text
reports/
└── task-ledger/
    └── 2026-07-25T03-20-25Z/
        ├── report.html
        ├── report.json
        └── summary.json
```

The summary contains:

- Lighthouse version
- Audit timestamp
- Scores
- Core Web Vitals
- Performance metrics

## Roadmap

Planned features include:

- HTML dashboard
- Historical trend graphs
- Project comparisons
- Desktop audits
- CI/CD integration
- GitHub Actions support
- npm package
- Bun package

## License

MIT
