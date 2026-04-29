// ========================================
// Поймай Жука — Brain with Neural Circuits SVG
// ========================================
// Stylized brain with glowing neural pathways.

export default function BrainCircuit({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brain-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <filter id="brain-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Neural connections (behind brain) */}
      <g stroke="#8b5cf6" strokeWidth="1" opacity="0.35" fill="none">
        <line x1="30" y1="140" x2="55" y2="110">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="150" y1="140" x2="125" y2="110">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" begin="1s" repeatCount="indefinite" />
        </line>
        <line x1="20" y1="90" x2="50" y2="80">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="160" y1="90" x2="130" y2="80">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur="4s" begin="1.5s" repeatCount="indefinite" />
        </line>
        {/* Neural nodes */}
        <circle cx="30" cy="140" r="3" fill="#a78bfa" opacity="0.5">
          <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="140" r="3" fill="#a78bfa" opacity="0.5">
          <animate attributeName="r" values="2;4;2" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="90" r="2" fill="#c4b5fd" opacity="0.4">
          <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="90" r="2" fill="#c4b5fd" opacity="0.4">
          <animate attributeName="r" values="1.5;3;1.5" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Brain shape */}
      <g filter="url(#brain-glow)">
        {/* Left hemisphere */}
        <path
          d="M90 40 C70 38, 48 50, 45 70 C42 85, 48 100, 55 108 C50 115, 48 125, 55 135 C62 145, 78 148, 90 145"
          fill="url(#brain-grad)"
          opacity="0.9"
        />
        {/* Right hemisphere */}
        <path
          d="M90 40 C110 38, 132 50, 135 70 C138 85, 132 100, 125 108 C130 115, 132 125, 125 135 C118 145, 102 148, 90 145"
          fill="url(#brain-grad)"
          opacity="0.85"
        />
        {/* Center division */}
        <path
          d="M90 42 C88 60, 92 80, 88 100 C85 115, 92 130, 90 145"
          stroke="#7c3aed"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        {/* Folds (left) */}
        <path d="M60 65 Q70 60, 80 68" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M55 85 Q68 78, 82 88" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.4" />
        <path d="M58 108 Q70 100, 85 110" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.4" />
        {/* Folds (right) */}
        <path d="M120 65 Q110 60, 100 68" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M125 85 Q112 78, 98 88" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.4" />
        <path d="M122 108 Q110 100, 95 110" stroke="#ddd6fe" strokeWidth="1.2" fill="none" opacity="0.4" />
      </g>

      {/* Electrical sparks on brain */}
      <g fill="#fbbf24">
        <circle cx="70" cy="70" r="2.5" opacity="0.9">
          <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="1;3;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="115" cy="85" r="2" opacity="0.7">
          <animate attributeName="opacity" values="0;1;0" dur="2.2s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="r" values="1;2.5;1" dur="2.2s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="105" r="2" opacity="0.8">
          <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="1;2.5;1" dur="2s" begin="1.2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Lightning bolt icon on top */}
      <path
        d="M88 25 L84 37 L90 37 L86 50 L96 34 L90 34 L94 25Z"
        fill="#fbbf24"
        opacity="0.85"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
