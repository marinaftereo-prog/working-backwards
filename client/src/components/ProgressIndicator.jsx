// Minimal, warm-toned progress indicator: "Step N of M" with small dots.
export default function ProgressIndicator({ step, total }) {
  return (
    <div className="flex items-center gap-3 text-ash-400">
      <span className="text-xs uppercase tracking-[0.25em]">
        Step {step} of {total}
      </span>
      <span className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              "h-1.5 w-1.5 rounded-full transition-colors duration-500 " +
              (i < step ? "bg-ember-400" : "bg-ash-600")
            }
          />
        ))}
      </span>
    </div>
  );
}
