import { FC } from "react";

type Props = {
  size?: number; 
  accent?: string;
  className?: string;
  withText?: boolean;
};

const VirtualTryOnLogo: FC<Props> = ({
  size = 64,
  accent = "#4B0082", // Dark Purple
  className = "",
  withText = true,
}) => {
  const w = size;
  const h = Math.round(size * 0.6);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG logo */}
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Virtual Try-On logo"
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feBlend in="SourceGraphic" in2="b" />
          </filter>
        </defs>

        {/* Left lens */}
        <g filter="url(#soft)">
          <ellipse cx="60" cy="60" rx="42" ry="32" fill="url(#g)" opacity="0.15" />
        </g>

        {/* Right lens */}
        <g filter="url(#soft)">
          <ellipse cx="140" cy="60" rx="42" ry="32" fill="url(#g)" opacity="0.15" />
        </g>

        {/* Glass frames stroke */}
        <path
          d="M16 60c0-18 14-33 32-33h4.5c13.5 0 26 9 38 9s24-9 38-9H152c18 0 32 15 32 33"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Left rim */}
        <ellipse cx="60" cy="60" rx="38" ry="28" fill="none" stroke={accent} strokeWidth="3" opacity="0.98" />

        {/* Right rim */}
        <ellipse cx="140" cy="60" rx="38" ry="28" fill="none" stroke={accent} strokeWidth="3" opacity="0.98" />

        {/* Bridge */}
        <path
          d="M98 58c2-4 6-6 10-6s8 2 10 6"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Monogram: stylized 'V' */}
        <path d="M46 50 L60 78 L74 50" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Small sparkle */}
        <g transform="translate(152,28)">
          <path
            d="M0 6 L3 10 L8 12 L3 14 L0 18 L-3 14 L-8 12 L-3 10 Z"
            fill={accent}
            opacity="0.9"
          />
        </g>

        {/* Subtle reflections */}
        <path d="M34 44c10-6 30-6 42 0" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.12" />
        <path d="M126 44c10-6 30-6 42 0" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.12" />
      </svg>

      {/* Brand text */}
      {withText && (
        <div className="leading-tight" itemScope itemType="http://schema.org/Brand">
          <div
            className="text-gray-900 font-serif text-lg tracking-wide"
            style={{ fontWeight: 700 }}
            itemProp="name"
          >
            Virtual
          </div>
          <div
            className="text-gray-500 text-sm tracking-wider"
            style={{ letterSpacing: 1 }}
          >
            Try-On
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOnLogo;
