// src/types.ts

export interface ProjectConfig {
  name: string;
  url: string;
  root?: string;
}

export type ProjectsConfig = Record<string, ProjectConfig>;

export interface AuditScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface AuditMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  speedIndex: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export interface AuditSummary {
  version: 1;
  lighthouseVersion: string;
  projectKey: string;
  projectName: string;
  url: string;
  timestamp: string;
  formFactor: "mobile" | "tablet" | "desktop";
  scores: AuditScores;
  metrics: AuditMetrics;
}

export interface GeneratedReports {
  htmlReport: string;
  jsonReport: string;
  summary: AuditSummary;
}

export interface ReportPaths {
  html: string;
  json: string;
  summary: string;
}
