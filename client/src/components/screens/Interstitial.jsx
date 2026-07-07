import { QUOTE, ATTRIBUTION } from "../../copy.js";

// Shown during the ~15–30s while an obituary is being written. Resurfaces the
// Buffett epigraph so the wait feels intentional and reflective, not broken,
// with a quiet pulsing status line.
export default function Interstitial({ message }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fadein">
      <blockquote className="max-w-xl px-2">
        <p className="font-serif text-2xl leading-snug text-cream-100 sm:text-3xl">
          &ldquo;{QUOTE}&rdquo;
        </p>
        <footer className="mt-6 text-xs uppercase tracking-[0.3em] text-ember-400/80">
          {ATTRIBUTION}
        </footer>
      </blockquote>

      <p className="mt-16 font-body text-ash-300 animate-pulse">{message}</p>
    </div>
  );
}
