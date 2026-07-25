// src/projects.config.ts

import type { ProjectsConfig } from "./types.js";

const projects = {
  "baseline-web": {
    name: "Baseline Web",
    url: "https://baseline-web.davidmoriarty.dev",
    root: "../baseline-web",
  },
  "outsiders-hair-boutique": {
    name: "Outsiders Hair Boutique",
    url: "https://outsidershairboutique.com",
    root: "../outsiders-site",
  },
  "task-ledger": {
    name: "Task Ledger",
    url: "https://task-ledger.davidmoriarty.dev/ui/login",
    root: "../task-ledger",
  },
  "task-manager": {
    name: "Task Manager",
    url: "https://task-manager.davidmoriarty.dev",
    root: "../task-manager",
  },
  "note-manager": {
    name: "Note Manager",
    url: "https://note-manager.davidmoriarty.dev",
    root: "../note-manager",
  },
  "kybernesis": {
    name: "Kybernesis",
    url: "https://acme.kybernesis.davidmoriarty.dev",
    root: "../kybernesis",
  },
} satisfies ProjectsConfig;

export default projects;
