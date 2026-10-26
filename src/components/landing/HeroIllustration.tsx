export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 400 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full max-h-[280px]"
      >
        {/* Soft abstract medical / building shape */}
        <ellipse cx="200" cy="140" rx="160" ry="100" fill="rgba(14, 165, 233, 0.08)" />
        <ellipse cx="200" cy="130" rx="120" ry="70" fill="rgba(14, 165, 233, 0.06)" />
        {/* Simple hospital building silhouette */}
        <path
          d="M140 200 L140 100 L160 100 L160 80 L240 80 L240 100 L260 100 L260 200 Z"
          fill="rgba(14, 165, 233, 0.12)"
          stroke="rgba(14, 165, 233, 0.2)"
          strokeWidth="1.5"
        />
        {/* Cross on top */}
        <rect x="198" y="45" width="24" height="8" rx="2" fill="rgba(14, 165, 233, 0.3)" />
        <rect x="206" y="37" width="8" height="24" rx="2" fill="rgba(14, 165, 233, 0.3)" />
        {/* Window rows */}
        <rect x="155" y="110" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.2)" />
        <rect x="185" y="110" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.2)" />
        <rect x="215" y="110" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.2)" />
        <rect x="245" y="110" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.2)" />
        <rect x="155" y="145" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.15)" />
        <rect x="185" y="145" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.15)" />
        <rect x="215" y="145" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.15)" />
        <rect x="245" y="145" width="20" height="25" rx="2" fill="rgba(14, 165, 233, 0.15)" />
      </svg>
    </div>
  );
}
