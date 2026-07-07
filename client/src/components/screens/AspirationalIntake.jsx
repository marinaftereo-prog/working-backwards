import { useEffect, useRef, useState } from "react";
import Button from "../Button.jsx";

const QUESTIONS = [
  "How do you want to show up for the people you love?",
  "What do you do in your wildest dreams?",
  "What would you be really proud to have achieved in the end?",
  "How do you want to be remembered?",
];

const PLACEHOLDERS = [
  "The people you love now — and those not yet in your life",
  "The life you'd pursue if nothing held you back",
  "Imagine there's nothing holding you back",
  "The words you'd want spoken of you at the end",
];

// Screen 4 — Aspirational intake, presented one question at a time so it stays
// reflective and unhurried, matching the current-state flow.
export default function AspirationalIntake({
  answers,
  setAnswers,
  loading,
  error,
  onSubmit,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const answerRef = useRef(null);

  const total = QUESTIONS.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  function setAnswer(i, value) {
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
  }

  // Keep the field as a single line that grows with its content, so the cursor
  // always rests right on the orange underline rather than floating above it.
  function fitToContent(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // When a step mounts (incl. stepping back to a filled answer), size it.
  useEffect(() => {
    fitToContent(answerRef.current);
  }, [stepIndex]);

  function goNext() {
    if (isLast) {
      if (!loading) onSubmit();
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function goBack() {
    if (!isFirst) setStepIndex((i) => i - 1);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress dots */}
      <div className="mb-10 flex flex-col items-center gap-5 sm:mb-16">
        <div className="flex gap-2">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                i <= stepIndex ? "bg-ember-400" : "bg-ash-600"
              }`}
            />
          ))}
        </div>
        <p className="font-body text-sm text-ash-500">
          Don't be afraid to dream big.
        </p>
      </div>

      {/* The single focused question. Re-mounts per step so it fades in fresh. */}
      <div
        key={stepIndex}
        className="flex flex-1 flex-col items-center justify-center text-center animate-fadeup"
      >
        <div className="w-full max-w-xl">
          <label
            htmlFor={`aq-${stepIndex}`}
            className="mb-8 block font-serif text-3xl leading-snug text-cream-100 sm:text-4xl"
          >
            {QUESTIONS[stepIndex]}
          </label>
          <textarea
            id={`aq-${stepIndex}`}
            ref={answerRef}
            className="field overflow-hidden text-center text-lg leading-relaxed"
            rows={1}
            value={answers[stepIndex]}
            placeholder={PLACEHOLDERS[stepIndex]}
            autoFocus
            onChange={(e) => {
              setAnswer(stepIndex, e.target.value);
              fitToContent(e.target);
            }}
          />
        </div>
      </div>

      {error && (
        <p className="mt-6 text-center font-body text-sm text-ember-300">{error}</p>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-center gap-6 sm:mt-12">
        {!isFirst && (
          <Button variant="quiet" onClick={goBack}>
            Back
          </Button>
        )}
        <Button onClick={goNext} disabled={loading}>
          {isLast
            ? loading
              ? "Imagining forward…"
              : "Generate My Aspirational Obituary"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}
