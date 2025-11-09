# PowerShell 7 scaffold for Ops Protocol Tools secure backend
# Run from project root: C:\Ops5\web\nextjs-site
# This ONLY creates folders + safe stub files.
# It does NOT overwrite existing files.

$ErrorActionPreference = "Stop"

function Ensure-Dir {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Ensure-File {
    param(
        [string]$Path,
        [string]$Content
    )
    if (-not (Test-Path $Path)) {
        $dir = Split-Path $Path
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir | Out-Null
        }
        $Content | Set-Content -Path $Path -Encoding UTF8
    }
}

Write-Host "== Ops Protocol Tools Secure Scaffold =="

# 1. New directories

Ensure-Dir "scripts"
Ensure-Dir "lib/security"
Ensure-Dir "lib/coach"
Ensure-Dir "app/api/audit"
Ensure-Dir "app/api/security"
Ensure-Dir "app/api/security/service-account"
Ensure-Dir "app/api/coach"

Write-Host "Created base directories."

# 2. lib/security/hash.ts

$hashTs = @"
import crypto from "crypto";

/**
 * Hash arbitrary string with SHA-256.
 * Used for API keys, tokens, and internal integrity checks.
 */
export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Generate a random API key string.
 * Store ONLY the sha256 hash in the database.
 */
export function generateApiKey(): string {
  return crypto.randomBytes(24).toString("hex");
}
"@

Ensure-File "lib/security/hash.ts" $hashTs

# 3. lib/security/mfa.ts (stub only, you wire real TOTP locally)

$mfaTs = @"
import { sha256 } from "./hash";

/**
 * MFA utilities (stub).
 * Implement real TOTP using a local library (e.g. otplib) in your environment.
 */

export type MfaStatus = {
  enabled: boolean;
};

export function generateMfaSecretSeed(userId: number | string): string {
  // Deterministic-friendly seed. You should refine this locally.
  return sha256(String(userId) + ":ops:mfa:seed").slice(0, 32);
}

export function getMfaStatusForUser(hasSecret: boolean): MfaStatus {
  return { enabled: hasSecret };
}

/**
 * Placeholder verifier.
 * Replace with real TOTP verification using your chosen library.
 */
export function verifyMfaToken(_secret: string, _token: string): boolean {
  // Always false by default; implement locally.
  return false;
}
"@

Ensure-File "lib/security/mfa.ts" $mfaTs

# 4. lib/security/session.ts (stub rotation helpers)

$sessionTs = @"
import { sha256 } from "./hash";

/**
 * Session + token helpers (stub).
 * Use these patterns to implement rotation and invalidation locally.
 */

export function buildSessionFingerprint(
  userId: number | string,
  userAgent: string | null,
  ip: string | null
): string {
  const base = `${userId}|${userAgent || ""}|${ip || ""}`;
  return sha256(base);
}

/**
 * Example: derive a hashed token value for DB storage.
 */
export function hashSessionToken(raw: string): string {
  return sha256(raw);
}
"@

Ensure-File "lib/security/session.ts" $sessionTs

# 5. lib/security/csp.ts

$cspTs = @"
import { NextResponse } from "next/server";

const CSP_HEADER_VALUE =
  \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self';\";

/**
 * Apply baseline security headers to a NextResponse.
 * Call this from API routes or middleware as needed.
 */
export function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set(\"Content-Security-Policy\", CSP_HEADER_VALUE);
  res.headers.set(\"X-Frame-Options\", \"DENY\");
  res.headers.set(\"X-Content-Type-Options\", \"nosniff\");
  res.headers.set(\"Referrer-Policy\", \"strict-origin-when-cross-origin\");
  return res;
}
"@

Ensure-File "lib/security/csp.ts" $cspTs

# 6. lib/coach/validator.ts

$coachValidatorTs = @"
import { sha256 } from \"../security/hash\";

/**
 * AI Coach input/output normalization.
 * All coach-facing data should go through here before any model call.
 */

export function sanitizeCoachInput(raw: unknown): string {
  const text =
    typeof raw === \"string\" ? raw : JSON.stringify(raw ?? \"\", null, 2);
  // Strip obvious HTML/script.
  return text.replace(/<script/gi, \"[blocked-script]\").trim();
}

/**
 * Produce a stable hash for logging requests/responses
 * without storing raw sensitive content.
 */
export function hashCoachPayload(payload: unknown): string {
  const text =
    typeof payload === \"string\"
      ? payload
      : JSON.stringify(payload ?? \"\", null, 2);
  return sha256(text);
}
"@

Ensure-File "lib/coach/validator.ts" $coachValidatorTs

# 7. app/api/audit/route.ts

$auditRouteTs = @"
import { NextResponse } from \"next/server\";
import prisma from \"@/lib/prisma\";

/**
 * Internal-only endpoint for writing audit logs.
 * You should restrict access to this route via middleware.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      role,
      action,
      route,
      ip,
      userAgent,
      metadata
    } = body || {};

    if (!action) {
      return NextResponse.json(
        { error: \"Missing 'action'\" },
        { status: 400 }
      );
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        role: role || \"UNKNOWN\",
        action,
        route: route || null,
        ip: ip || null,
        userAgent: userAgent || null,
        metadata: metadata || {}
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(\"/api/audit POST error\", error);
    return NextResponse.json(
      { error: \"Server error\" },
      { status: 500 }
    );
  }
}
"@

Ensure-File "app/api/audit/route.ts" $auditRouteTs

# 8. app/api/security/login-attempt/route.ts

$loginAttemptRouteTs = @"
import { NextResponse } from \"next/server\";
import prisma from \"@/lib/prisma\";

/**
 * Records login attempts for brute-force detection.
 * Call this from your auth flow.
 */

export async function POST(req: Request) {
  try {
    const { email, ip, success } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: \"Missing 'email'\" },
        { status: 400 }
      );
    }

    await prisma.loginAttempt.create({
      data: {
        email,
        ip: ip || null,
        success: Boolean(success)
      }
    });

    // Simple advisory response; enforcement can be added in auth layer.
    const windowStart = new Date(Date.now() - 15 * 60 * 1000);
    const recentFails = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: windowStart }
      }
    });

    const locked = recentFails >= 5;

    return NextResponse.json({ locked });
  } catch (error) {
    console.error(\"/api/security/login-attempt error\", error);
    return NextResponse.json(
      { error: \"Server error\" },
      { status: 500 }
    );
  }
}
"@

Ensure-File "app/api/security/login-attempt/route.ts" $loginAttemptRouteTs

# 9. app/api/security/service-account/route.ts

$serviceAccountRouteTs = @"
import { NextResponse } from \"next/server\";
import prisma from \"@/lib/prisma\";
import { generateApiKey, sha256 } from \"@/lib/security/hash\";

/**
 * Creates a new ServiceAccount + API key.
 * Restrict this route to ADMIN in your auth/middleware.
 * Response includes the raw key ONCE; store it securely client-side.
 */

export async function POST() {
  try {
    const apiKey = generateApiKey();
    const hash = sha256(apiKey);

    const sa = await prisma.serviceAccount.create({
      data: {
        name: \"AI Coach\",
        apiKeyHash: hash,
        role: \"SERVICE\"
      }
    });

    return NextResponse.json({
      success: true,
      id: sa.id,
      apiKey
    });
  } catch (error) {
    console.error(\"/api/security/service-account error\", error);
    return NextResponse.json(
      { error: \"Server error\" },
      { status: 500 }
    );
  }
}
"@

Ensure-File "app/api/security/service-account/route.ts" $serviceAccountRouteTs

# 10. app/api/coach/ping/route.ts

$coachPingRouteTs = @"
import { NextResponse } from \"next/server\";
import prisma from \"@/lib/prisma\";
import { sha256 } from \"@/lib/security/hash\";

/**
 * Minimal AI Coach isolation check.
 * Requires x-service-key header matching a stored ServiceAccount.apiKeyHash.
 * Does NOT expose data. Used only to confirm wiring.
 */

export async function GET(req: Request) {
  try {
    const key = req.headers.get(\"x-service-key\") || \"\";
    if (!key) {
      return NextResponse.json(
        { error: \"Missing service key\" },
        { status: 401 }
      );
    }

    const hash = sha256(key);
    const sa = await prisma.serviceAccount.findFirst({
      where: { apiKeyHash: hash }
    });

    if (!sa) {
      return NextResponse.json(
        { error: \"Invalid service key\" },
        { status: 403 }
      );
    }

    await prisma.coachRequest.create({
      data: {
        serviceAccountId: sa.id,
        userId: null,
        inputHash: \"ping\",
        outputHash: \"pong\"
      }
    });

    return NextResponse.json({ ok: true, serviceAccountId: sa.id });
  } catch (error) {
    console.error(\"/api/coach/ping error\", error);
    return NextResponse.json(
      { error: \"Server error\" },
      { status: 500 }
    );
  }
}
"@

Ensure-File "app/api/coach/ping/route.ts" $coachPingRouteTs

Write-Host "Secure scaffold files created (no existing files overwritten)."
Write-Host "Next steps:"
Write-Host "1. Update prisma/schema.prisma with AuditLog, LoginAttempt, ServiceAccount, CoachRequest models."
Write-Host "2. Run: npx prisma migrate dev --name secure_scaffold"
Write-Host "3. Wire auth + middleware to call these endpoints and helpers."
