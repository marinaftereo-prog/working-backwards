import { useEffect, useRef, useState } from "react";
import Button from "../Button.jsx";

// ── Landing copy ────────────────────────────────────────────────────────────
// The opening epigraph. Buffett's actual idea, in his own words (Berkshire 2023:
// "You should write your obituary and figure out how to live up to it"), lightly
// trimmed. Kept accurate on purpose — a shaky attribution would undercut the app.
const QUOTE = "Write your obituary — then figure out how to live up to it.";
const ATTRIBUTION = "Warren Buffett";

// The promise line, revealed word by word. Marina's words. Note the deliberate
// motif: the landing asks how you *will* be remembered (the life you're on);
// the aspirational step later asks how you *want* to be (the life you choose).
const LINE = "How will you be remembered?";

// ── Timing (ms) ─────────────────────────────────────────────────────────────
const QUOTE_HOLD = 3200; // how long the quote sits before it dissolves
const QUOTE_FADE = 900; // the dissolve itself
const TITLE_DELAY = 0.3; // seconds before the title fades up
const LINE_DELAY = 1.6; // seconds before the first word appears (let the title breathe)
const WORD_STAGGER = 0.34; // seconds between each revealed word
const CTA_GAP = 0.8; // seconds after the last word before the CTA

const STAGE = { QUOTE: "quote", REVEAL: "reveal" };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function introAlreadySeen() {
  try {
    return localStorage.getItem("wb_intro_seen") === "1";
  } catch {
    return false;
  }
}

// Screen 1 — Welcome / Landing. A short cinematic open: an epigraph fades in,
// dissolves, and gives way to the name, a word-by-word promise, and the CTA.
// Returning visitors and reduced-motion users skip straight to the end state.
export default function Welcome({ onBegin }) {
  const skipIntro = prefersReducedMotion() || introAlreadySeen();

  const [stage, setStage] = useState(skipIntro ? STAGE.REVEAL : STAGE.QUOTE);
  const [animate, setAnimate] = useState(!skipIntro);
  const [quoteLeaving, setQuoteLeaving] = useState(false);
  const timers = useRef([]);

  function markSeen() {
    try {
      localStorage.setItem("wb_intro_seen", "1");
    } catch {
      /* private mode — fine, they just see the intro again */
    }
  }

  // Auto-play the opening: hold the quote, dissolve it, then reveal the rest.
  useEffect(() => {
    if (stage !== STAGE.QUOTE) return;
    timers.current.push(
      setTimeout(() => setQuoteLeaving(true), QUOTE_HOLD),
      setTimeout(() => {
        markSeen();
        setStage(STAGE.REVEAL);
      }, QUOTE_HOLD + QUOTE_FADE)
    );
    return () => timers.current.forEach(clearTimeout);
  }, [stage]);

  function skip() {
    timers.current.forEach(clearTimeout);
    markSeen();
    setStage(STAGE.REVEAL);
  }

  // Dev-only: replay the full sequence from the top, no reload. Never shipped.
  function replay() {
    timers.current.forEach(clearTimeout);
    try {
      localStorage.removeItem("wb_intro_seen");
    } catch {
      /* ignore */
    }
    setQuoteLeaving(false);
    setAnimate(true);
    setStage(STAGE.QUOTE);
  }

  const devReplay = import.meta.env.DEV ? (
    <button
      onClick={replay}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-ash-600 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ash-400 transition-colors hover:text-cream-200 hover:border-ash-400"
    >
      ↻ Replay intro
    </button>
  ) : null;

  if (stage === STAGE.QUOTE) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <blockquote
          className={`max-w-xl px-2 ${
            quoteLeaving ? "animate-quoteout" : "animate-fadein"
          }`}
        >
          <p className="font-serif text-3xl leading-snug text-cream-100 sm:text-4xl">
            &ldquo;{QUOTE}&rdquo;
          </p>
          <footer className="mt-6 text-xs uppercase tracking-[0.3em] text-ember-400/80">
            {ATTRIBUTION}
          </footer>
        </blockquote>

        <button
          onClick={skip}
          className="absolute bottom-0 text-xs uppercase tracking-[0.2em] text-ash-500 transition-colors hover:text-cream-200"
        >
          Skip
        </button>
        {devReplay}
      </div>
    );
  }

  // Reveal: name, the word-by-word line, then the CTA.
  const words = LINE.split(" ");
  const lineEnd = LINE_DELAY + words.length * WORD_STAGGER; // when the last word lands
  const ctaDelay = lineEnd + CTA_GAP;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <h1
        className={`font-serif text-5xl leading-tight text-cream-100 sm:text-6xl ${
          animate ? "animate-fadeup" : ""
        }`}
        style={animate ? { animationDelay: `${TITLE_DELAY}s` } : undefined}
      >
        Working Backwards
      </h1>

      <p className="mt-8 max-w-md font-body text-xl leading-relaxed text-ash-200 sm:text-2xl">
        {animate
          ? words.map((word, i) => (
              <span
                key={i}
                className="inline-block animate-fadeup"
                style={{ animationDelay: `${LINE_DELAY + i * WORD_STAGGER}s` }}
              >
                {word}&nbsp;
              </span>
            ))
          : LINE}
      </p>

      <div
        className={`mt-14 ${animate ? "animate-fadein" : ""}`}
        style={animate ? { animationDelay: `${ctaDelay}s` } : undefined}
      >
        <Button onClick={onBegin}>Write My Obituary</Button>
      </div>
      {devReplay}
    </div>
  );
}
