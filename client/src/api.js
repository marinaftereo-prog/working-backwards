// Thin client for the Working Backwards API.
// In dev, Vite proxies /api -> http://localhost:3001 (see vite.config.js).

async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* keep default */
    }
    throw new Error(message);
  }

  return res.json();
}

export async function getAccessStatus() {
  const res = await fetch("/api/access-status");
  if (!res.ok) throw new Error("Could not check access status.");
  return res.json();
}

export function unlock(password) {
  return post("/api/unlock", { password });
}

export function generateCurrentObituary({ name, answers }) {
  return post("/api/generate-obituary", {
    name,
    q1: answers[0],
    q2: answers[1],
    q3: answers[2],
    q4: answers[3],
  });
}

export function generateAspirationalObituary({ name, answers }) {
  return post("/api/generate-aspirational", {
    name,
    q1: answers[0],
    q2: answers[1],
    q3: answers[2],
    q4: answers[3],
  });
}

export function generateFocus({ currentObituary, aspirationalObituary }) {
  return post("/api/generate-focus", { currentObituary, aspirationalObituary });
}
