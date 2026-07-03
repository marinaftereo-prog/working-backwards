import { useState } from "react";
import Button from "../Button.jsx";
import { unlock } from "../../api.js";

// A quiet, on-brand access screen for the private beta. Works everywhere,
// including in-app browsers, because it's a normal page + a cookie (not the
// browser's native Basic-Auth popup, which mobile in-app browsers often hide).
export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!password || loading) return;
    setError("");
    setLoading(true);
    try {
      await unlock(password);
      onUnlock();
    } catch (err) {
      setError(err.message || "That code isn't right.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center animate-fadein">
      <h1 className="font-serif text-4xl text-cream-100 sm:text-5xl">
        Working Backwards
      </h1>
      <p className="mt-6 max-w-sm font-body text-ash-300">
        A private beta. Enter the code you were given to begin.
      </p>

      <form
        onSubmit={submit}
        className="mt-10 flex w-full max-w-xs flex-col items-center gap-6"
      >
        <input
          type="password"
          className="field text-center text-lg"
          value={password}
          placeholder="Access code"
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="font-body text-sm text-ember-300">{error}</p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Unlocking…" : "Enter"}
        </Button>
      </form>
    </div>
  );
}
