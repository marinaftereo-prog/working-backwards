import Button from "../Button.jsx";
import { FEEDBACK_URL } from "../../copy.js";

// "What matters most" — the app's read on the gap between the two lives, drawn
// from the focus lines. Also contrasts those with the "cold" goals the person
// set at the very start (the delta at the heart of the exercise), and is home to
// the (future) gentle-reminder system.
export default function WhatMattersMost({ goals, focusLines, onBack }) {
  const lines = focusLines?.length ? focusLines : [];
  const goalsList = (goals || "")
    .split("\n")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-1 flex-col items-center animate-fadein">
      <p className="mb-6 text-xs uppercase tracking-[0.35em] text-ember-400/70">
        What matters most
      </p>
      <p className="mb-14 max-w-md text-center font-body text-ash-300">
        The distance between the life you're living and the life you could — this
        is where to begin.
      </p>

      {lines.length > 0 ? (
        <ul className="flex w-full max-w-xl flex-col gap-6">
          {lines.map((line, i) => (
            <li
              key={i}
              className="text-center font-body text-xl leading-relaxed text-cream-200 animate-fadeup"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body text-ash-400">
          Your focus lines will appear here.
        </p>
      )}

      {/* The delta: the goals they set out with, before the reflection */}
      {goalsList.length > 0 && (
        <section className="mt-20 w-full max-w-xl border-t border-ash-600/50 pt-12">
          <h3 className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-ember-400/70">
            The goals you began with
          </h3>
          <ul className="flex flex-col gap-3">
            {goalsList.map((goal, i) => (
              <li
                key={i}
                className="text-center font-body text-lg text-ash-300"
              >
                {goal}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center font-body text-ash-400">
            Notice where these meet what matters most — and where they don't. That
            gap is where working backwards begins.
          </p>
        </section>
      )}

      {/* Future: gentle reminders toward what matters */}
      <div className="mt-20 w-full max-w-md border-t border-ash-600/50 pt-10 text-center">
        <p className="font-body text-ash-300">
          Soon, Working Backwards will gently remind you of what matters — a quiet
          nudge toward the life you chose.
        </p>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="mt-5 cursor-not-allowed rounded-full border border-ash-600 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ash-500"
        >
          Set up reminders (coming soon)
        </button>
      </div>

      {FEEDBACK_URL && (
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 max-w-md text-center font-body text-sm text-ember-400/80 underline decoration-ash-600 underline-offset-4 transition-colors hover:text-ember-300"
        >
          This is a private beta — I'd love to hear what you felt.
        </a>
      )}

      <div className="mt-14">
        <Button variant="quiet" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
