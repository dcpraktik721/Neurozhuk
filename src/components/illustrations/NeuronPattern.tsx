// ========================================
// Поймай Жука — Neuron Background Pattern SVG
// ========================================
// Animated neural network pattern for section backgrounds.

export default function NeuronPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="np-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* Neural connection lines */}
      <g stroke="url(#np-line)" strokeWidth="1" fill="none">
        {/* Cluster 1 — top left */}
        <line x1="80" y1="60" x2="160" y2="120" />
        <line x1="160" y1="120" x2="140" y2="200" />
        <line x1="160" y1="120" x2="250" y2="100" />
        <line x1="80" y1="60" x2="50" y2="140" />

        {/* Cluster 2 — center */}
        <line x1="300" y1="180" x2="250" y2="100" />
        <line x1="300" y1="180" x2="380" y2="140" />
        <line x1="300" y1="180" x2="320" y2="280" />
        <line x1="250" y1="100" x2="340" y2="50" />

        {/* Cluster 3 — right */}
        <line x1="480" y1="80" x2="380" y2="140" />
        <line x1="380" y1="140" x2="440" y2="240" />
        <line x1="480" y1="80" x2="540" y2="160" />
        <line x1="540" y1="160" x2="440" y2="240" />

        {/* Cluster 4 — bottom */}
        <line x1="140" y1="320" x2="320" y2="280" />
        <line x1="320" y1="280" x2="440" y2="340" />
        <line x1="140" y1="320" x2="50" y2="280" />
      </g>

      {/* Neural nodes */}
      <g>
        {/* Node positions with pulsing animation */}
        {[
          { cx: 80, cy: 60, r: 3, delay: '0s' },
          { cx: 160, cy: 120, r: 4, delay: '0.3s' },
          { cx: 140, cy: 200, r: 2.5, delay: '0.8s' },
          { cx: 250, cy: 100, r: 3.5, delay: '0.5s' },
          { cx: 50, cy: 140, r: 2, delay: '1.2s' },
          { cx: 300, cy: 180, r: 4, delay: '0.2s' },
          { cx: 380, cy: 140, r: 3, delay: '0.7s' },
          { cx: 320, cy: 280, r: 3, delay: '1s' },
          { cx: 340, cy: 50, r: 2.5, delay: '1.5s' },
          { cx: 480, cy: 80, r: 3, delay: '0.4s' },
          { cx: 540, cy: 160, r: 2.5, delay: '0.9s' },
          { cx: 440, cy: 240, r: 3.5, delay: '0.6s' },
          { cx: 140, cy: 320, r: 2.5, delay: '1.1s' },
          { cx: 440, cy: 340, r: 2, delay: '1.4s' },
          { cx: 50, cy: 280, r: 2, delay: '1.3s' },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="white"
            opacity="0.25"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur="3s"
              begin={node.delay}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${node.r * 0.7};${node.r * 1.3};${node.r * 0.7}`}
              dur="3s"
              begin={node.delay}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* Traveling pulse along a path */}
      <circle r="2" fill="white" opacity="0.5">
        <animateMotion dur="4s" repeatCount="indefinite" path="M80,60 L160,120 L250,100 L300,180 L380,140 L480,80" />
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle r="1.5" fill="#22c55e" opacity="0.4">
        <animateMotion dur="5s" repeatCount="indefinite" path="M540,160 L440,240 L320,280 L140,320 L50,280" begin="1s" />
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
