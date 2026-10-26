export function ChuLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        width="40"
        height="40"
        rx="8"
        fill="url(#chu-gradient)"
      />
      <path
        d="M20 8v24M12 16h16M12 20h16M12 24h16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="12" r="2" fill="white" />
      <defs>
        <linearGradient id="chu-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
