"use client";

const C = {
  cream: "#F8F9FA",
  ivory: "#F0F3F5",
  linen: "#E4E9ED",
  sage: "#7F9DB5",
  sageLight: "#A3BDD1",
  gold: "#D4B85C",
  charcoal: "#2C2C2C",
  warmGray: "#7A7068",
  river: "#C8D8E4",
  park: "#A3BDD1",
};

type PinId = 1 | 2 | 3;

const PINS: Array<{
  id: PinId;
  name: string;
  fill: string;
  x: number;
  y: number;
  labelDy?: number;
}> = [
  { id: 1, name: "AUS Airport", fill: C.sage, x: 685, y: 380 },
  { id: 2, name: "St. John Neumann", fill: C.gold, x: 110, y: 165 },
  { id: 3, name: "Hotel Ella", fill: C.charcoal, x: 410, y: 130 },
];

export default function AustinMap() {
  return (
    <div className="overflow-hidden rounded-lg border border-linen bg-cream shadow-soft">
      <svg
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustrated map of Austin showing AUS Airport, St. John Neumann Catholic Church, and Hotel Ella, with surrounding streets and landmarks"
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={C.linen}
              strokeWidth="0.6"
              opacity="0.55"
            />
          </pattern>
          <radialGradient id="map-vignette" cx="50%" cy="55%" r="65%">
            <stop offset="0%" stopColor={C.cream} stopOpacity="0" />
            <stop offset="100%" stopColor={C.ivory} stopOpacity="0.55" />
          </radialGradient>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" />
            <feOffset dx="0" dy="2" result="off" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.28" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Paper */}
        <rect width="800" height="500" fill={C.cream} />
        <rect width="800" height="500" fill="url(#map-grid)" />
        <rect width="800" height="500" fill="url(#map-vignette)" />

        {/* Parks — sit beneath the road network */}
        {/* Zilker Park (south of lake, west of Congress) */}
        <ellipse cx="370" cy="345" rx="48" ry="16" fill={C.park} opacity="0.22" />
        <text
          x="370"
          y="349"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          textAnchor="middle"
          opacity="0.85"
        >
          Zilker Park
        </text>

        {/* UT Austin (north of Hotel Ella) */}
        <rect x="385" y="80" width="70" height="32" rx="3" fill={C.park} opacity="0.18" />
        <text
          x="420"
          y="100"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          textAnchor="middle"
          opacity="0.85"
        >
          UT Austin
        </text>

        {/* Highways — major, dashed */}
        {/* I-35 */}
        <line x1="500" y1="20" x2="555" y2="480" stroke={C.linen} strokeWidth="2.6" strokeDasharray="8 5" />
        <text x="552" y="50" fill={C.warmGray} fontSize="10" fontFamily="serif" fontStyle="italic">
          I-35
        </text>
        {/* MoPac */}
        <line x1="225" y1="20" x2="275" y2="480" stroke={C.linen} strokeWidth="2.6" strokeDasharray="8 5" />
        <text x="232" y="50" fill={C.warmGray} fontSize="10" fontFamily="serif" fontStyle="italic">
          MoPac
        </text>

        {/* Surface streets — N-S */}
        {/* S. Lamar Blvd */}
        <line x1="335" y1="120" x2="365" y2="480" stroke={C.linen} strokeWidth="1.6" strokeDasharray="5 4" />
        <text
          x="345"
          y="200"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          opacity="0.8"
        >
          S. Lamar
        </text>

        {/* Congress Avenue */}
        <line x1="450" y1="180" x2="465" y2="480" stroke={C.linen} strokeWidth="1.9" strokeDasharray="6 4" />
        <text
          x="453"
          y="210"
          fill={C.warmGray}
          fontSize="9.5"
          fontFamily="serif"
          fontStyle="italic"
          opacity="0.85"
        >
          Congress Ave
        </text>

        {/* Surface streets — E-W */}
        {/* Bee Cave Rd (passes through church) */}
        <line x1="55" y1="170" x2="190" y2="170" stroke={C.linen} strokeWidth="1.4" strokeDasharray="4 3" />
        <text
          x="62"
          y="160"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          opacity="0.8"
        >
          Bee Cave Rd
        </text>

        {/* University Ave (passes through Hotel Ella) */}
        <line x1="365" y1="135" x2="455" y2="135" stroke={C.linen} strokeWidth="1.3" strokeDasharray="4 3" />

        {/* 6th Street (downtown E-W) */}
        <line x1="390" y1="245" x2="510" y2="245" stroke={C.linen} strokeWidth="1.4" strokeDasharray="4 3" />
        <text
          x="395"
          y="240"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          opacity="0.8"
        >
          6th St
        </text>

        {/* Lady Bird Lake / Colorado River — flowing curve */}
        <path
          d="M 50 270 C 160 250 240 270 320 280 S 470 305 580 295 S 720 280 760 305"
          stroke={C.river}
          strokeWidth="16"
          fill="none"
          opacity="0.7"
          strokeLinecap="round"
        />
        <path
          d="M 50 270 C 160 250 240 270 320 280 S 470 305 580 295 S 720 280 760 305"
          stroke={C.sage}
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          strokeDasharray="2 5"
          strokeLinecap="round"
        />
        <text
          x="200"
          y="272"
          fill={C.warmGray}
          fontSize="11"
          fontFamily="serif"
          fontStyle="italic"
          letterSpacing="1"
        >
          Lady Bird Lake
        </text>

        {/* Texas Capitol — small marker between Hotel Ella and the river */}
        <g transform="translate(458, 195)">
          <rect x="-5" y="-6" width="10" height="12" fill={C.charcoal} opacity="0.45" />
          <path d="M -6 -6 L 0 -11 L 6 -6 Z" fill={C.charcoal} opacity="0.45" />
        </g>
        <text
          x="470"
          y="200"
          fill={C.warmGray}
          fontSize="9"
          fontFamily="serif"
          fontStyle="italic"
          opacity="0.85"
        >
          Capitol
        </text>

        {/* Area labels — region context */}
        <text x="60" y="220" fill={C.warmGray} fontSize="10" fontFamily="serif" letterSpacing="2.5" opacity="0.7">
          WESTLAKE
        </text>
        <text x="395" y="295" fill={C.warmGray} fontSize="10" fontFamily="serif" letterSpacing="2.5" textAnchor="middle" opacity="0.7">
          DOWNTOWN
        </text>
        <text x="685" y="455" fill={C.warmGray} fontSize="10" fontFamily="serif" letterSpacing="2.5" textAnchor="middle" opacity="0.7">
          SOUTH AUSTIN
        </text>

        {/* Connecting routes (Hotel ↔ Church, Hotel ↔ Airport) */}
        <line
          x1={PINS[2].x}
          y1={PINS[2].y}
          x2={PINS[1].x}
          y2={PINS[1].y}
          stroke={C.warmGray}
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.6"
        />
        <line
          x1={PINS[2].x}
          y1={PINS[2].y}
          x2={PINS[0].x}
          y2={PINS[0].y}
          stroke={C.warmGray}
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.6"
        />

        {/* Distance pills */}
        <DistancePill
          x={(PINS[2].x + PINS[1].x) / 2}
          y={(PINS[2].y + PINS[1].y) / 2 - 14}
          label="~10 mi · 20 min"
        />
        <DistancePill
          x={(PINS[2].x + PINS[0].x) / 2 + 28}
          y={(PINS[2].y + PINS[0].y) / 2}
          label="~17 mi · 25 min"
        />

        {/* Pins */}
        {PINS.map((pin) => (
          <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`} filter="url(#pin-shadow)">
            <circle r="20" fill={pin.fill} stroke={C.cream} strokeWidth="3.5" />
            <text
              fill={C.cream}
              fontSize="15"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {pin.id}
            </text>
            {/* Label below pin with cream halo for legibility */}
            <text
              y={pin.labelDy ?? 42}
              fill={C.cream}
              stroke={C.cream}
              strokeWidth="4"
              strokeLinejoin="round"
              fontSize="12"
              fontFamily="serif"
              fontWeight="600"
              textAnchor="middle"
            >
              {pin.name}
            </text>
            <text
              y={pin.labelDy ?? 42}
              fill={C.charcoal}
              fontSize="12"
              fontFamily="serif"
              fontWeight="600"
              textAnchor="middle"
            >
              {pin.name}
            </text>
          </g>
        ))}

        {/* Title block — top-left */}
        <text x="40" y="48" fill={C.charcoal} fontSize="22" fontFamily="serif" fontWeight="500" letterSpacing="3">
          AUSTIN
        </text>
        <line x1="40" y1="58" x2="120" y2="58" stroke={C.gold} strokeWidth="1.2" />
        <text x="40" y="76" fill={C.warmGray} fontSize="9" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="3.5">
          THE WEEKEND
        </text>

        {/* Compass — top-right */}
        <g transform="translate(745, 55)">
          <circle r="22" fill={C.cream} stroke={C.linen} strokeWidth="1" />
          <path d="M 0 -15 L 4 0 L 0 15 L -4 0 Z" fill={C.charcoal} />
          <path d="M 0 -15 L 4 0 L -4 0 Z" fill={C.gold} />
          <text
            y="-26"
            fill={C.charcoal}
            fontSize="10"
            fontFamily="serif"
            fontWeight="600"
            textAnchor="middle"
          >
            N
          </text>
        </g>

        {/* Scale bar — bottom-left */}
        <g transform="translate(40, 470)">
          <line x1="0" y1="0" x2="80" y2="0" stroke={C.charcoal} strokeWidth="1.5" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke={C.charcoal} strokeWidth="1.5" />
          <line x1="40" y1="-3" x2="40" y2="3" stroke={C.charcoal} strokeWidth="1.5" />
          <line x1="80" y1="-4" x2="80" y2="4" stroke={C.charcoal} strokeWidth="1.5" />
          <text x="40" y="-8" fill={C.warmGray} fontSize="9" fontFamily="ui-sans-serif, system-ui, sans-serif" textAnchor="middle" letterSpacing="1">
            ≈ 5 MI
          </text>
        </g>
      </svg>
    </div>
  );
}

function DistancePill({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-44" y="-10" width="88" height="20" rx="10" fill={C.cream} stroke={C.linen} strokeWidth="1" />
      <text
        fill={C.charcoal}
        fontSize="10"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="500"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </g>
  );
}
