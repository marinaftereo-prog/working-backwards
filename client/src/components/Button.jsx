// Subtle warm-toned outline button. Nothing bright or loud.
export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-sans tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-ember-400 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "px-8 py-3.5 text-sm text-cream-100 border border-ember-500/60 hover:border-ember-400 hover:bg-ember-400/10 hover:shadow-[0_0_30px_-8px_rgba(224,168,94,0.5)]",
    ghost:
      "px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ash-400 border border-ash-600 hover:text-cream-200 hover:border-ash-400",
    quiet:
      "px-4 py-2 text-xs uppercase tracking-[0.2em] text-ash-400 hover:text-cream-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
