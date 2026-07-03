import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";

const PORT = process.env.PORT || 3001;
const MODEL = "claude-opus-4-8";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "\n⚠️  ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.\n",
  );
}

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const app = express();
app.set("trust proxy", 1); // behind Render/Railway's proxy — needed for correct client IP
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- Access gate (optional): protect the whole app for the private beta -------
// Set ACCESS_PASSWORD to require a shared password (HTTP Basic Auth). Unset = open.
// The browser remembers it, so friends & family enter it once. Health stays open.
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;
if (ACCESS_PASSWORD) {
  app.use((req, res, next) => {
    if (req.path === "/api/health") return next();
    const [scheme, encoded] = (req.headers.authorization || "").split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString();
      if (decoded.slice(decoded.indexOf(":") + 1) === ACCESS_PASSWORD) return next();
    }
    res.set("WWW-Authenticate", 'Basic realm="Working Backwards — private beta"');
    res.status(401).send("Working Backwards is in private beta.");
  });
}

// --- Rate limiting: cap generation per IP (public + Opus = real spend) --------
// One full run = 3 calls, so the default of 30 / 30 min ≈ 10 runs per person.
const generateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "You've reached the limit for now. Take a breath and try again a little later.",
  },
});
app.use(
  ["/api/generate-obituary", "/api/generate-aspirational", "/api/generate-focus"],
  generateLimiter,
);

// --- Prompt builders -------------------------------------------------------

const CURRENT_SYSTEM = `You are a quiet, literary obituary writer. You write the obituary of a living person as it would read if their life ended today — reflecting honestly and tenderly on the life they have actually lived so far.

Voice and form:
- Write in warm, spacious, dignified prose. Third person, past tense.
- 180–320 words. A few short paragraphs, not a list.
- Open with a single, quiet line stating that the person passed away on the date provided below — e.g. "[Name] passed away on [date]." State it plainly and let it land; do not dramatize it.
- Draw directly and specifically from the person's own answers — the people they love, how others see them, their work, and what they are proud of. Let the people in their life be near the heart of it.
- Be honest but never cruel — tender and dignified, never an accusation.
- No headers, no preamble, no quotation marks around the whole thing, no "In Loving Memory" letterhead. Just the obituary text itself.
- Do not state or invent a cause, illness, or circumstance of death (no "suddenly," no accident, no long illness) — only that they passed. Do not invent other concrete facts (place names, relatives' names) the person did not provide.`;

const ASPIRATIONAL_SYSTEM = `You are a quiet, literary obituary writer. You write the obituary of a life fully lived — the life this person could grow into if they followed what they most want. This is the eulogy of who they are becoming, written as if it were already true at the end of a long, complete life.

Voice and form:
- Write in warm, spacious, dignified prose. Third person, past tense.
- 180–320 words. A few short paragraphs, not a list.
- Draw directly and specifically from the person's own answers about how they want to show up for the people they love, how they want to be remembered, what they dream of doing, and what they would be most proud to have achieved.
- This is aspirational but grounded and believable — not a fantasy of fame or wealth. Honor the quiet, human shape of a meaningful life.
- No headers, no preamble, no quotation marks around the whole thing. Just the obituary text itself.
- Do not invent concrete facts (dates, place names, relatives' names) that the person did not provide.`;

const FOCUS_SYSTEM = `You read two obituaries of the same person: one reflecting the life they are living now, and one reflecting the life they could grow into. Your job is to distill what matters most — the few things this person could begin moving toward.

Frame everything as focus and possibility, never as failure, gap, or deficiency. These are gentle, forward-looking invitations, not judgments. Write three concise lines, each one short (under 16 words), each one a distinct thread of what matters most. Speak directly and warmly to the person ("you").`;

// Today, written long-form (e.g. "June 29, 2026") — the date the obituary opens on.
function today() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function currentUserPrompt({ name, q1, q2, q3, q4 }) {
  return `Write the current-state obituary for ${name || "this person"}, as if their life ended today.

Date of passing (open the obituary with this exact date):
${today()}

The important people in their life (family, friends, the people they love most):
${q1 || "(left blank)"}

How people in their life describe them:
${q2 || "(left blank)"}

What they do (role, work, identity):
${q3 || "(left blank)"}

What they are proud of (what they achieved, and what they came through):
${q4 || "(left blank)"}`;
}

function aspirationalUserPrompt({ name, q1, q2, q3, q4 }) {
  return `Write the aspirational obituary for ${name || "this person"} — the life they could grow into.

How they want to show up for the people they love (including those not yet in their life — a partner, children, family ahead):
${q1 || "(left blank)"}

What they dream of doing — their wildest dreams:
${q2 || "(left blank)"}

What they would be most proud to have achieved in the end:
${q3 || "(left blank)"}

How they want to be remembered:
${q4 || "(left blank)"}`;
}

// --- Helpers ---------------------------------------------------------------

function textFromMessage(message) {
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function handleError(res, err, label) {
  console.error(`[${label}]`, err?.message || err);
  const status = err?.status && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error:
      err?.status === 401
        ? "Invalid or missing ANTHROPIC_API_KEY."
        : "Something went wrong generating your reflection. Please try again.",
  });
}

// --- Routes ----------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL, keyConfigured: !!process.env.ANTHROPIC_API_KEY });
});

// Current-state obituary: name + 4 intake answers -> obituary text
app.post("/api/generate-obituary", async (req, res) => {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      system: CURRENT_SYSTEM,
      messages: [{ role: "user", content: currentUserPrompt(req.body || {}) }],
    });
    res.json({ obituary: textFromMessage(message) });
  } catch (err) {
    handleError(res, err, "generate-obituary");
  }
});

// Aspirational obituary: 4 aspirational answers -> obituary text
app.post("/api/generate-aspirational", async (req, res) => {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      system: ASPIRATIONAL_SYSTEM,
      messages: [{ role: "user", content: aspirationalUserPrompt(req.body || {}) }],
    });
    res.json({ obituary: textFromMessage(message) });
  } catch (err) {
    handleError(res, err, "generate-aspirational");
  }
});

// Focus: both obituaries -> exactly 3 "what matters most" lines
app.post("/api/generate-focus", async (req, res) => {
  try {
    const { currentObituary, aspirationalObituary } = req.body || {};
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: FOCUS_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Here is the obituary of the life being lived now:\n\n${currentObituary}\n\n---\n\nHere is the obituary of the life that could be grown into:\n\n${aspirationalObituary}\n\n---\n\nReturn what matters most as exactly three short lines.`,
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              lines: {
                type: "array",
                items: { type: "string" },
                description: "Exactly three short, warm, forward-looking lines.",
              },
            },
            required: ["lines"],
            additionalProperties: false,
          },
        },
      },
    });

    const parsed = JSON.parse(textFromMessage(message));
    const lines = Array.isArray(parsed.lines) ? parsed.lines.slice(0, 3) : [];
    res.json({ lines });
  } catch (err) {
    handleError(res, err, "generate-focus");
  }
});

// --- Serve the built frontend (single-service deploy) ------------------------
// In production the same server serves the React build AND the /api routes, from
// one origin — so the API key never ships to the browser and there's no CORS.
const clientDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../client/dist",
);
const indexHtml = path.join(clientDist, "index.html");
console.log(`[startup] clientDist=${clientDist} hasBuild=${fs.existsSync(indexHtml)}`);

app.use(express.static(clientDist));
// SPA fallback: any non-API GET returns the app shell.
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (!fs.existsSync(indexHtml)) {
    return res
      .status(503)
      .send("Frontend build missing on the server — the client build did not run.");
  }
  res.sendFile(indexHtml, (err) => {
    if (err) {
      console.error("[static] sendFile failed:", err.message);
      if (!res.headersSent) res.status(500).send("Could not load the app.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Working Backwards server listening on http://localhost:${PORT}`);
});
