// A single labeled, quiet textarea question used in the intake forms.
export default function Question({ index, label, value, onChange, placeholder }) {
  return (
    <div className="animate-fadeup" style={{ animationDelay: `${index * 90}ms` }}>
      <label className="mb-2 block font-body text-lg text-cream-200">
        {label}
      </label>
      <textarea
        className="field"
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
