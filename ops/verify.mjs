import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const specPath = path.join(__dirname, "spec.json");

if (!fs.existsSync(specPath)) {
  console.error("[verify] Missing ops/spec.json");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
let failed = false;

function rel(p) {
  return path.relative(root, p);
}

function checkFileExists(relPath) {
  const full = path.join(root, relPath);
  if (!fs.existsSync(full)) {
    console.error(`[verify] Missing critical file: ${relPath}`);
    failed = true;
    return null;
  }
  return full;
}

function checkContains(fullPath, marker, label) {
  const content = fs.readFileSync(fullPath, "utf8");
  if (!content.includes(marker)) {
    console.error(
      `[verify] ${label} missing marker "${marker}" in ${rel(fullPath)}`
    );
    failed = true;
  }
}

console.log("[verify] Checking critical files...");

// 1. All critical files exist
for (const relPath of spec.criticalFiles) {
  checkFileExists(relPath);
}

// 2. schema.prisma invariants
const schemaPath = checkFileExists("prisma/schema.prisma");
if (schemaPath) {
  const schema = fs.readFileSync(schemaPath, "utf8");
  if (!schema.includes("enum Role")) {
    console.error("[verify] schema.prisma missing enum Role");
    failed = true;
  }
  for (const role of spec.schema.roleEnum) {
    if (!schema.includes(role)) {
      console.error(`[verify] schema.prisma missing Role value: ${role}`);
      failed = true;
    }
  }
  if (!schema.includes("model User")) {
    console.error("[verify] schema.prisma missing model User");
    failed = true;
  }
  if (!schema.includes("model KnowledgeChunk")) {
    console.error("[verify] schema.prisma missing model KnowledgeChunk");
    failed = true;
  }
  if (!schema.includes("model AnalyticsEvent")) {
    console.error("[verify] schema.prisma missing model AnalyticsEvent");
    failed = true;
  }
}

// 3. lib/prisma.ts invariants
const prismaLibPath = checkFileExists("lib/prisma.ts");
if (prismaLibPath) {
  checkContains(
    prismaLibPath,
    "export default prisma",
    "lib/prisma.ts must default export prisma"
  );
}

// 4. seed.ts invariants
const seedPath = checkFileExists("prisma/seed.ts");
if (seedPath) {
  checkContains(
    seedPath,
    "Role.ADMIN",
    "prisma/seed.ts must use Role.ADMIN for admin user"
  );
}

// 5. seedKnowledge.ts invariants
const seedKPath = checkFileExists("prisma/seedKnowledge.ts");
if (seedKPath) {
  const c = fs.readFileSync(seedKPath, "utf8");
  if (!c.includes("knowledgeChunk")) {
    console.error(
      "[verify] prisma/seedKnowledge.ts must write to prisma.knowledgeChunk"
    );
    failed = true;
  }
}

// 6. analytics/page.tsx invariants
const analyticsPath = checkFileExists("app/admin/analytics/page.tsx");
if (analyticsPath) {
  const c = fs.readFileSync(analyticsPath, "utf8");
  if (!c.includes("analyticsEvent.findMany")) {
    console.error(
      "[verify] analytics/page.tsx must query prisma.analyticsEvent"
    );
    failed = true;
  }
  if (!c.includes("include:") || !c.includes("user")) {
    console.error(
      "[verify] analytics/page.tsx must include user relation for events"
    );
    failed = true;
  }
}

if (failed) {
  console.error("[verify] Spec drift detected. Fix before committing.");
  process.exit(1);
} else {
  console.log("[verify] OK: critical files match structural spec.");
}
