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
- Configurable Chrome launch flags
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

Run in headful mode:

```bash

npm run audit -- task-ledger --headful

```

Override the default Chrome launch flags:

```bash

npm run audit -- task-ledger --chrome-flags="--disable-extensions"

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

## Known Limitations

### CDN and Security Middleware

When auditing sites protected by Cloudflare or similar security middleware, Lighthouse CLI may trigger additional JavaScript challenge or bot-detection scripts. These scripts can significantly increase JavaScript execution time and Total Blocking Time (TBT), resulting in lower Performance scores than those obtained from interactive browser audits.

- The application itself may not be responsible for the additional scripting time.
- Check the Long Tasks and Bootup Time audits.
- If `/cdn-cgi/challenge-platform/scripts/jsd/main.js` dominates those sections, the reported Performance score reflects Cloudflare’s challenge script rather than the application bundle.
- Accessibility, Best Practices, and SEO scores are generally unaffected.

```plaintext
Long Tasks (example)

1253 ms  Cloudflare challenge
 232 ms  Application bundle
```

In these cases, inspect the Long Tasks and Bootup Time audits before optimizing application code, as the largest performance cost may originate from infrastructure rather than the application itself.

## Troubleshooting

### Performance score is much lower than Chrome DevTools

Possible causes:

- Cloudflare JavaScript challenge
- Browser extensions or injected scripts
- Different Lighthouse throttling settings
- CDN cache warming
- Third-party analytics or monitoring scripts


## Roadmap

Planned features include:

- HTML dashboard
- Historical trend analysis
- Performance attribution summary
- Project comparisons
- Desktop audits
- CI/CD integration
- GitHub Actions support
- npm package
- Bun package

## License

MIT
