import { useEffect, useRef } from "react";
import Button from "../Button.jsx";

// Captured EARLY (before the reflection) so the goals stay "cold" — a baseline
// of what the person consciously thinks they want, to contrast later with what
// the exercise surfaces as what matters most. Copy is kept neutral on purpose,
// so as not to bias the goals-vs-what-matters delta.
export default function GoalsIntake({ goals, setGoals, onContinue }) {
  const ref = useRef(null);

  // Grow the field with its content so the cursor rests on the orange line
  // rather than floating above it.
  function fitToContent(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    fitToContent(ref.current);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fadein">
      <h2 className="font-serif text-3xl leading-snug text-cream-100 sm:text-4xl">
        Think about your future.
      </h2>
      <p className="mt-6 max-w-md font-body text-ash-300">
        What goals do you have for your life?
      </p>

      <textarea
        ref={ref}
        className="field mt-10 w-full max-w-md overflow-hidden text-left text-lg leading-snug !py-2"
        rows={1}
        value={goals}
        placeholder="Aim for 3-5 goals"
        autoFocus
        onChange={(e) => {
          setGoals(e.target.value);
          fitToContent(e.target);
        }}
      />

      <p className="mt-6 max-w-md text-center font-body text-sm text-ash-500">
        Working Backwards doesn't have a database yet. Nothing is saved, and your
        thoughts here are only for your eyes.
      </p>

      <div className="mt-10">
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
}
