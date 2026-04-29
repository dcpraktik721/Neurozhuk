// ========================================
// Поймай Жука — Hero Beetle SVG Illustration
// ========================================
// Thematic beetle character with neural circuit patterns.

export default function BeetleHero({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Glow filter */}
      <defs>
        <filter id="beetle-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="beetle-body-grad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <radialGradient id="beetle-head-grad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </radialGradient>
        <linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Neural circuit lines behind beetle */}
      <g opacity="0.5" stroke="url(#neural-line)" strokeWidth="1.5" fill="none">
        <path d="M30 180 Q60 160, 70 130">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M170 180 Q140 160, 130 130">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M20 140 Q50 120, 65 110">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M180 140 Q150 120, 135 110">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" begin="1s" repeatCount="indefinite" />
        </path>
        {/* Neural nodes */}
        <circle cx="30" cy="180" r="3" fill="#22c55e" opacity="0.6">
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="170" cy="180" r="3" fill="#14b8a6" opacity="0.6">
          <animate attributeName="r" values="2;4;2" dur="2s" begin="0.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="140" r="2.5" fill="#22c55e" opacity="0.5">
          <animate attributeName="r" values="1.5;3.5;1.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="140" r="2.5" fill="#14b8a6" opacity="0.5">
          <animate attributeName="r" values="1.5;3.5;1.5" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Beetle body */}
      <g filter="url(#beetle-glow)">
        {/* Body ellipse */}
        <ellipse cx="100" cy="120" rx="38" ry="50" fill="url(#beetle-body-grad)" />

        {/* Wing divider */}
        <line x1="100" y1="75" x2="100" y2="168" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* Wing shine */}
        <ellipse cx="85" cy="105" rx="12" ry="20" fill="white" opacity="0.12" transform="rotate(-10, 85, 105)" />
        <ellipse cx="115" cy="105" rx="12" ry="20" fill="white" opacity="0.08" transform="rotate(10, 115, 105)" />

        {/* Head */}
        <circle cx="100" cy="68" r="22" fill="url(#beetle-head-grad)" />

        {/* Eyes */}
        <circle cx="90" cy="62" r="5" fill="white" opacity="0.9" />
        <circle cx="110" cy="62" r="5" fill="white" opacity="0.9" />
        <circle cx="91" cy="61" r="2.5" fill="#0f172a" />
        <circle cx="111" cy="61" r="2.5" fill="#0f172a" />
        {/* Eye highlights */}
        <circle cx="92.5" cy="59.5" r="1" fill="white" />
        <circle cx="112.5" cy="59.5" r="1" fill="white" />

        {/* Smile */}
        <path d="M93 72 Q100 78, 107 72" stroke="#15803d" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Antennae */}
        <path d="M88 50 Q78 30, 65 25" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M112 50 Q122 30, 135 25" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Antenna tips */}
        <circle cx="65" cy="25" r="4" fill="#4ade80">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="135" cy="25" r="4" fill="#4ade80">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Legs */}
        <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none">
          {/* Left legs */}
          <path d="M65 100 L55 90 L45 92" />
          <path d="M63 120 L50 118 L42 122" />
          <path d="M65 140 L55 148 L45 150" />
          {/* Right legs */}
          <path d="M135 100 L145 90 L155 92" />
          <path d="M137 120 L150 118 L158 122" />
          <path d="M135 140 L145 148 L155 150" />
        </g>
      </g>

      {/* Sparkle decorations */}
      <g fill="#fbbf24">
        <path d="M45 50 L47 44 L49 50 L55 52 L49 54 L47 60 L45 54 L39 52Z" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M155 70 L156.5 65 L158 70 L163 71.5 L158 73 L156.5 78 L155 73 L150 71.5Z" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}
