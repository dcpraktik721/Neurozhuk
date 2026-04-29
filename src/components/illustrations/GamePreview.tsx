// ========================================
// Поймай Жука — Game Preview SVG Illustration
// ========================================
// Stylized game field preview showing beetles and equations.

export default function GamePreview({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <filter id="gp-glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gp-glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Game field background */}
      <rect x="10" y="10" width="300" height="180" rx="12" fill="url(#gp-bg)" />

      {/* Center divider */}
      <line x1="160" y1="18" x2="160" y2="182" stroke="white" strokeWidth="1" opacity="0.15" />

      {/* Equation bar at top */}
      <rect x="90" y="18" width="140" height="28" rx="8" fill="white" opacity="0.08" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
      <text x="160" y="37" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui" opacity="0.8">
        7 + 8 = ?
      </text>

      {/* Player beetle (green, center) */}
      <g filter="url(#gp-glow-green)">
        <ellipse cx="160" cy="110" rx="10" ry="13" fill="#22c55e" />
        <circle cx="160" cy="96" r="6" fill="#22c55e" />
        {/* Antennae */}
        <line x1="156" y1="91" x2="150" y2="83" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="164" y1="91" x2="170" y2="83" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="150" cy="83" r="2" fill="#4ade80" />
        <circle cx="170" cy="83" r="2" fill="#4ade80" />
      </g>

      {/* Enemy beetles (yellow, scattered) */}
      {/* Left side enemies */}
      <g filter="url(#gp-glow-yellow)">
        {/* Enemy 1 */}
        <ellipse cx="60" cy="55" rx="8" ry="10" fill="#facc15" />
        <circle cx="60" cy="44" r="5" fill="#facc15" />
        <text x="60" y="58" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold" fontFamily="system-ui">23</text>
        <line x1="57" y1="40" x2="52" y2="34" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
        <line x1="63" y1="40" x2="68" y2="34" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
      </g>

      <g filter="url(#gp-glow-yellow)">
        {/* Enemy 2 */}
        <ellipse cx="100" cy="140" rx="8" ry="10" fill="#facc15" />
        <circle cx="100" cy="129" r="5" fill="#facc15" />
        <text x="100" y="143" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold" fontFamily="system-ui">42</text>
        <line x1="97" y1="125" x2="92" y2="119" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
        <line x1="103" y1="125" x2="108" y2="119" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Right side enemies */}
      <g filter="url(#gp-glow-yellow)">
        {/* Enemy 3 — the CORRECT answer with golden glow */}
        <ellipse cx="230" cy="80" rx="8" ry="10" fill="#fbbf24" />
        <circle cx="230" cy="69" r="5" fill="#fbbf24" />
        <text x="230" y="83" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold" fontFamily="system-ui">15</text>
        <line x1="227" y1="65" x2="222" y2="59" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
        <line x1="233" y1="65" x2="238" y2="59" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
        {/* Hint glow ring */}
        <circle cx="230" cy="77" r="16" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.4">
          <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      <g filter="url(#gp-glow-yellow)">
        {/* Enemy 4 */}
        <ellipse cx="270" cy="150" rx="8" ry="10" fill="#facc15" />
        <circle cx="270" cy="139" r="5" fill="#facc15" />
        <text x="270" y="153" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold" fontFamily="system-ui">67</text>
        <line x1="267" y1="135" x2="262" y2="129" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
        <line x1="273" y1="135" x2="278" y2="129" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Score HUD */}
      <rect x="20" y="168" width="50" height="16" rx="4" fill="white" opacity="0.08" />
      <text x="45" y="179" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.8">
        120 pts
      </text>

      {/* Level HUD */}
      <rect x="250" y="168" width="50" height="16" rx="4" fill="white" opacity="0.08" />
      <text x="275" y="179" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.8">
        Lv. 3
      </text>

      {/* Particle effects */}
      <circle cx="140" cy="95" r="1.5" fill="#22c55e" opacity="0.6">
        <animate attributeName="cy" values="95;85;95" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="100" r="1" fill="#22c55e" opacity="0.4">
        <animate attributeName="cy" values="100;88;100" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
