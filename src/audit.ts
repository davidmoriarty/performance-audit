// src/audit.ts

import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { type LaunchedChrome, launch } from "chrome-launcher";
import lighthouse from "lighthouse";

import projects from "./projects.config.js";

import type {
  AuditSummary,
  GeneratedReports,
  ProjectConfig,
  ReportPaths,
} from "./types.js";

class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsageError";
  }
}

function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

function printUsage(): void {
  console.log(`
Usage:
  npm run audit -- <project>

Available projects:
${Object.keys(projects)
  .map((key) => `  - ${key}`)
  .join("\n")}
`);
}

function getProjectKey(): string {
  const projectKey = process.argv[2];

  if (!projectKey) {
    throw new UsageError("No project was specified.");
  }

  return projectKey;
}

function validateProject(projectKey: string): ProjectConfig {
  if (!(projectKey in projects)) {
    throw new UsageError(`Unknown project "${projectKey}".`);
  }

  const project = projects[projectKey as keyof typeof projects];

  try {
    new URL(project.url);
  } catch {
    throw new Error(
      `Project "${projectKey}" has an invalid URL: ${project.url}`
    );
  }

  return project;
}

function createTimestamp(): string {
  return new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replace(/\.\d{3}Z$/, "Z");
}

async function createReportDirectory(projectKey: string): Promise<string> {
  const reportDirectory = path.resolve(
    "reports",
    projectKey,
    createTimestamp(),
  );

  await fs.mkdir(reportDirectory, { recursive: true });

  return reportDirectory;
}

function getReportPaths(reportDirectory: string): ReportPaths {
  return {
    html: path.join(reportDirectory, "report.html"),
    json: path.join(reportDirectory, "report.json"),
    summary: path.join(reportDirectory, "summary.json"),
  };
}

function requireNumber(
  value: number | null | undefined,
  label: string,
): number {
  if (typeof value !== "number") {
    throw new Error(`Lighthouse did not return ${label}.`);
  }

  return value;
}

async function runLighthouse(
  projectKey: string,
  project: ProjectConfig,
): Promise<GeneratedReports> {
  let chrome: LaunchedChrome | undefined;

  try {
    const chromePath = process.env.CHROME_PATH;

    if (!chromePath) {
      throw new Error(
        "CHROME_PATH is not configured. See .env.example."
      );
    }

    chrome = await launch({
      chromePath,
      chromeFlags: ["--headless"],
    });

    const result = await lighthouse(project.url, {
      port: chrome.port,
      output: ["html", "json"],
      logLevel: "error",
    });

    if (!result) {
      throw new Error("Lighthouse did not return a result.");
    }

    if (!Array.isArray(result.report)) {
      throw new Error("Lighthouse returned an unexpected report format.");
    }

    const [htmlReport, jsonReport] = result.report;

    if (
      typeof htmlReport !== "string" ||
      typeof jsonReport !== "string"
    ) {
      throw new Error(
        "Lighthouse did not generate both HTML and JSON reports."
      );
    }

    const { lhr } = result;

    const summary: AuditSummary = {
      version: 1,
      lighthouseVersion: lhr.lighthouseVersion,
      projectKey,
      projectName: project.name,
      url: project.url,
      timestamp: lhr.fetchTime,
      formFactor: lhr.configSettings.formFactor,
      scores: {
        performance: Math.round(
          requireNumber(
            lhr.categories.performance?.score,
            "a performance score",
          ) * 100,
        ),
        accessibility: Math.round(
          requireNumber(
            lhr.categories.accessibility?.score,
            "an accessibility score",
          ) * 100,
        ),
        bestPractices: Math.round(
          requireNumber(
            lhr.categories["best-practices"]?.score,
            "a best-practices score",
          ) * 100,
        ),
        seo: Math.round(
          requireNumber(lhr.categories.seo?.score, "an SEO score") * 100,
        ),
      },
      metrics: {
        firstContentfulPaint: round(
          requireNumber(
            lhr.audits["first-contentful-paint"]?.numericValue,
            "First Contentful Paint",
          ),
        ),
        largestContentfulPaint: round(
          requireNumber(
            lhr.audits["largest-contentful-paint"]?.numericValue,
            "Largest Contentful Paint",
          ),
        ),
        speedIndex: round(
          requireNumber(
            lhr.audits["speed-index"]?.numericValue,
            "Speed Index",
          ),
        ),
        totalBlockingTime: round(
          requireNumber(
            lhr.audits["total-blocking-time"]?.numericValue,
            "Total Blocking Time",
          ),
        ),
        cumulativeLayoutShift: round(
          requireNumber(
            lhr.audits["cumulative-layout-shift"]?.numericValue,
            "Cumulative Layout Shift",
          ),
        ),
        timeToInteractive: round(
          requireNumber(
            lhr.audits.interactive?.numericValue,
            "Time to Interactive",
          ),
        ),
      },
    };

    return {
      htmlReport,
      jsonReport,
      summary,
    };
  } finally {
    chrome?.kill();
  }
}

async function saveReports(
  reportDirectory: string,
  reports: GeneratedReports,
): Promise<ReportPaths> {
  const reportPaths = getReportPaths(reportDirectory);

  await Promise.all([
    fs.writeFile(
      reportPaths.html,
      reports.htmlReport,
      "utf8",
    ),
    fs.writeFile(
      reportPaths.json,
      reports.jsonReport,
      "utf8"
    ),
    fs.writeFile(
      reportPaths.summary,
      JSON.stringify(reports.summary, null, 2),
      "utf8",
    ),
  ]);

  return reportPaths;
}

function printAuditStart(
  projectKey: string,
  project: ProjectConfig,
): void {
  console.log(`
Performance audit

Project: ${project.name}
URL:     ${project.url}
`);
}

function printAuditComplete(reportPaths: ReportPaths): void {
  console.log(`
Audit complete

HTML:     ${reportPaths.html}
JSON:     ${reportPaths.json}
Summary:  ${reportPaths.summary}
`);
}

async function main(): Promise<void> {
  const projectKey = getProjectKey();
  const project = validateProject(projectKey);

  printAuditStart(projectKey, project);

  const reportDirectory = await createReportDirectory(projectKey);
  const reports = await runLighthouse(projectKey, project);
  const reportPaths = await saveReports(reportDirectory, reports);

  printAuditComplete(reportPaths);
}

main().catch((error: unknown) => {
  if (error instanceof UsageError) {
    console.error(`Error: ${error.message}\n`);
    printUsage();
  } else if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error("Error: An unknown error occurred.");
  }

  process.exitCode = 1;
});
