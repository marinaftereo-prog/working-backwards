import { useState } from "react";
import Button from "../Button.jsx";
import Obituary from "../Obituary.jsx";
import { FEEDBACK_URL } from "../../copy.js";

// Screen 5 — Aspirational obituary reveal. One meaningful next step
// ("What matters most") plus two quiet options (Share, Save). The focus lines
// now live on their own "What matters most" page.
export default function AspirationalReveal({ name, obituary, onWhatMatters }) {
  const [feedback, setFeedback] = useState("");

  function flash(message) {
    setFeedback(message);
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setFeedback(""), 2600);
  }

  function shareText() {
    const who = name ? `${name}'s ` : "";
    return `${who}aspirational obituary — from Working Backwards\n\n${obituary}`;
  }

  async function handleShare() {
    const text = shareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Working Backwards", text });
        return;
      } catch {
        // user dismissed the share sheet, or it's unavailable — fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flash("Share text copied to your clipboard");
    } catch {
      flash("Couldn't share on this device");
    }
  }

  function handleSave() {
    // Real accounts are a later build; for now, a gentle nudge.
    flash("Saving keeps this forever — accounts coming soon");
  }

  return (
    <div className="flex flex-1 flex-col items-center animate-fadein">
      <p className="mb-12 text-xs uppercase tracking-[0.35em] text-ember-400/70">
        What to live up to
      </p>

      <article id="aspirational-print" className="w-full max-w-xl">
        <Obituary text={obituary} />
      </article>

      {/* One meaningful next step, two quiet options */}
      <div className="mt-16 flex flex-col items-center gap-6 print:hidden">
        <Button onClick={onWhatMatters}>See what matters most</Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleShare}>
            Share
          </Button>
          <Button variant="ghost" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <p className="mt-4 h-5 font-body text-sm text-ember-300 print:hidden">
        {feedback}
      </p>

      {FEEDBACK_URL && (
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 font-body text-xs uppercase tracking-[0.2em] text-ash-500 transition-colors hover:text-cream-200 print:hidden"
        >
          Beta feedback
        </a>
      )}
    </div>
  );
}
