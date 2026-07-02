import { useEffect, useRef, useState } from "react";
import Button from "../Button.jsx";

const QUESTIONS = [
  "Who are the important people in your life?",
  "How do people in your life describe you?",
  "What do you do?",
  "What are you proud of?",
];

const PLACEHOLDERS = [
  "Family, friends, and love left behind — their names, and what they mean to you",
  "The words people use to describe you",
  "Your career journey — where you are today, and how you got there",
  "Things big and small",
];

// Screen 2 — Current-state intake, presented one question at a time so each
// gets full focus instead of a wall of fields. Name first, then the questions.
export default function CurrentIntake({
  name,
  setName,
  answers,
  setAnswers,
  loading,
  error,
  onSubmit,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const answerRef = useRef(null);

  // Keep the answer field as a single line that grows with its content, so the
  // cursor always rests right on the orange underline rather than floating above it.
  function fitToContent(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // The full sequence: collect the name first, then each question in turn.
  const steps = [
    { kind: "name" },
    ...QUESTIONS.map((q, i) => ({
      kind: "question",
      qIndex: i,
      label: q,
      placeholder: PLACEHOLDERS[i],
    })),
  ];
  const total = steps.length;
  const current = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  // When a question step mounts (incl. stepping back to a filled answer), size it.
  useEffect(() => {
    if (current.kind === "question") fitToContent(answerRef.current);
  }, [stepIndex, current.kind]);

  function setAnswer(i, value) {
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
  }

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

  // Enter advances from the single-line name field (textareas keep Enter for newlines).
  function onNameKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress dots */}
      <div className="mb-16 flex flex-col items-center gap-5">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                i <= stepIndex ? "bg-ember-400" : "bg-ash-600"
              }`}
            />
          ))}
        </div>
        <p className="font-body text-sm text-ash-500">
          Take a deep breath, take your time, answer honestly.
        </p>
      </div>

      {/* The single focused question. Re-mounts per step so it fades in fresh. */}
      <div
        key={stepIndex}
        className="flex flex-1 flex-col items-center justify-center text-center animate-fadeup"
      >
        {current.kind === "name" ? (
          <div className="w-full max-w-md">
            <label
              htmlFor="name-field"
              className="mb-8 block font-serif text-3xl leading-snug text-cream-100 sm:text-4xl"
            >
              What should we call you?
            </label>
            <input
              id="name-field"
              className="field text-center text-xl"
              type="text"
              value={name}
              placeholder="Your full name"
              autoFocus
              onKeyDown={onNameKeyDown}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        ) : (
          <div className="w-full max-w-xl">
            <label
              htmlFor={`q-${current.qIndex}`}
              className="mb-8 block font-serif text-3xl leading-snug text-cream-100 sm:text-4xl"
            >
              {current.label}
            </label>
            <textarea
              id={`q-${current.qIndex}`}
              ref={answerRef}
              className="field overflow-hidden text-center text-lg leading-relaxed"
              rows={1}
              value={answers[current.qIndex]}
              placeholder={current.placeholder}
              autoFocus
              onChange={(e) => {
                setAnswer(current.qIndex, e.target.value);
                fitToContent(e.target);
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-6 text-center font-body text-sm text-ember-300">{error}</p>
      )}

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-center gap-6">
        {!isFirst && (
          <Button variant="quiet" onClick={goBack}>
            Back
          </Button>
        )}
        <Button onClick={goNext} disabled={loading}>
          {isLast
            ? loading
              ? "Reading your life…"
              : "Generate My Current Obituary"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}
