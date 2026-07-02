import Button from "../Button.jsx";
import Obituary from "../Obituary.jsx";

// Screen 3 — Current obituary reveal. A heavy moment. Give it room to breathe.
export default function CurrentReveal({ obituary, onContinue }) {
  return (
    <div className="flex flex-1 flex-col items-center animate-fadein">
      <p className="mb-12 text-xs uppercase tracking-[0.35em] text-ember-400/70">
        As your life reads today
      </p>

      <article className="w-full max-w-xl">
        <Obituary text={obituary} />
      </article>

      <div className="mt-20 mb-4 flex flex-col items-center gap-4">
        <Button onClick={onContinue}>Write My Aspirational Obituary</Button>
      </div>
    </div>
  );
}
