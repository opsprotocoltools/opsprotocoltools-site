import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const specPath = path.join(__dirname, "spec.json");

if (!fs.existsSync(specPath)) {
  console.error("[generateDocs] Missing ops/spec.json");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

function write(filePath, content) {
  fs.writeFileSync(filePath, content.trimStart() + "\n", "utf8");
  console.log(`[generateDocs] Wrote ${path.relative(root, filePath)}`);
}

// STACK_SPEC.md: full internal spec for humans
const stackSpec = `
# ${spec.projectName} — Stack Specification

## Overview

${spec.description}

## Stack

- Framework: ${spec.stack.framework}
- Auth: ${spec.stack.auth}
- ORM: ${spec.stack.orm}
- Database: ${spec.stack.db}
- Styling: ${spec.stack.styling}
- Charts: ${spec.stack.charts}
- Hosting: ${spec.stack.hosting}

## Environment Variables

Required:
${spec.env.required.map((k) => `- ${k}`).join("\n")}

Optional:
${spec.env.optional.map((k) => `- ${k}`).join("\n")}

Notes:
${spec.env.notes.map((n) => `- ${n}`).join("\n")}

## Critical Files

These files are guarded. Update only via full replacements aligned with this spec:

${spec.criticalFiles.map((f) => `- \`${f}\``).join("\n")}

## Rules

Editing:
${spec.rules.editing.map((r) => `- ${r}`).join("\n")}

Assistant:
${spec.rules.assistant.map((r) => `- ${r}`).join("\n")}

## Schema Expectations (Summary)

- Enum \`Role\`: ${spec.schema.roleEnum.join(", ")}
- \`User.role\` uses \`Role\`.
- \`KnowledgeChunk\` includes: domain, source, priority, tags, content, createdAt, updatedAt.
- \`AnalyticsEvent\` relates to \`User\` via \`userId\`.
`;

write(path.join(__dirname, "STACK_SPEC.md"), stackSpec);

// CHAT_BOOTSTRAP.md: what you paste into a new ChatGPT window
const chatBootstrap = `
You are attaching to the "${spec.projectName}" codebase.

Key points:

- Purpose: ${spec.description}
- Stack: ${spec.stack.framework}, ${spec.stack.auth}, ${spec.stack.orm}, ${spec.stack.db}, ${spec.stack.styling}, ${spec.stack.charts}, ${spec.stack.hosting}.
- Env: Requires ${spec.env.required.join(", ")} (see STACK_SPEC.md for details).
- Critical files (no snippets, full-file edits only):
${spec.criticalFiles.map((f) => `  - ${f}`).join("\n")}

Operational rules:

1. Always treat this repo as source of truth. No invented models or migrations.
2. When changing any critical file, output the complete corrected file.
3. Keep schema consistent:
   - Role enum: ${spec.schema.roleEnum.join(", ")}
   - User.role uses Role.
   - KnowledgeChunk and AnalyticsEvent match the documented structure.
4. Prefer minimal, deterministic fixes aligned with this spec.

When errors occur:
- Read the error.
- Identify which critical file is involved.
- Propose a single, full-file replacement consistent with this spec.
`;

write(path.join(__dirname, "CHAT_BOOTSTRAP.md"), chatBootstrap);
