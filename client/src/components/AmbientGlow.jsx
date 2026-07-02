// A soft, candlelit amber light source emanating from behind the main content.
// Rendered fixed behind everything; purely decorative.
export default function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary warm bloom, gently flickering like a flame */}
      <div
        className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 animate-flicker rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(224,168,94,0.22) 0%, rgba(200,136,74,0.12) 35%, rgba(10,10,10,0) 70%)",
        }}
      />
      {/* Secondary deeper ember, offset to give the light a source */}
      <div
        className="absolute left-1/2 top-[42%] h-[34vmax] w-[34vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(240,194,123,0.18) 0%, rgba(10,10,10,0) 65%)",
        }}
      />
      {/* Vignette to keep the edges dark and intimate */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0) 35%, rgba(10,10,10,0.85) 100%)",
        }}
      />
    </div>
  );
}
