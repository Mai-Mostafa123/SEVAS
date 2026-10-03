import React from 'react';

interface SevasLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'shield' | 'badge' | 'horizontal';
  className?: string;
  showSlogan?: boolean;
  animatePulse?: boolean;
}

export const SevasLogo: React.FC<SevasLogoProps> = ({
  size = 'md',
  variant = 'badge',
  className = '',
  showSlogan = true,
  animatePulse = false,
}) => {
  // Dimensions scaling
  const heightMap = {
    xs: 28,
    sm: 38,
    md: 52,
    lg: 84,
    xl: 130,
  };

  const h = heightMap[size];

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3.5 select-none ${className}`}>
        {/* Shield Icon Lockup */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-10 h-10 drop-shadow-[0_0_12px_rgba(229,27,36,0.45)]"
          >
            {/* Red Shield */}
            <path
              d="M 120 70 C 200 45 250 40 250 40 C 250 40 300 45 380 70 L 380 240 C 380 370 250 460 250 460 C 250 460 120 370 120 240 Z"
              fill="#06090E"
              stroke="#E51B24"
              strokeWidth="20"
              strokeLinejoin="round"
            />
            {/* White Car Silhouette */}
            <path
              d="M 195 140 L 305 140 C 312 140 318 144 322 150 L 350 195 C 356 195 362 200 362 208 L 362 218 C 362 224 356 228 350 228 L 348 238 C 356 250 362 270 358 295 C 354 315 334 326 322 328 L 178 328 C 166 326 146 315 142 295 C 138 270 144 250 152 238 L 150 228 C 144 228 138 224 138 218 L 138 208 C 138 200 144 195 150 195 L 178 150 C 182 144 188 140 195 140 Z"
              fill="#FFFFFF"
            />
            {/* Dark Windshield */}
            <path d="M 200 150 L 300 150 L 332 192 L 168 192 Z" fill="#06090E" />
            {/* Headlights */}
            <polygon points="152,240 195,246 188,264 148,255" fill="#06090E" />
            <polygon points="348,240 305,246 312,264 352,255" fill="#06090E" />
            {/* Circular Siren Emblem */}
            <circle cx="250" cy="275" r="48" fill="#000000" stroke="#FFFFFF" strokeWidth="5" />
            {/* Light Rays */}
            <g stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
              <line x1="250" y1="238" x2="250" y2="248" />
              <line x1="228" y1="244" x2="234" y2="252" />
              <line x1="272" y1="244" x2="266" y2="252" />
            </g>
            {/* Red Siren */}
            <path
              d="M 236 298 L 264 298 C 264 298 267 280 259 268 C 255 262 245 262 241 268 C 233 280 236 298 236 298 Z"
              fill="#E51B24"
            />
            <rect x="230" y="296" width="40" height="6" rx="2" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Wordmark and Tagline */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold tracking-wider text-xl text-white">
              SEVAS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#E51B24] uppercase border border-[#E51B24]/40 px-1 py-0.2 rounded-xs">
              SYSTEM
            </span>
          </div>
          <span className="text-[9px] tracking-wider text-slate-400 font-medium uppercase">
            Smart Emergency Vehicle Alert System
          </span>
        </div>
      </div>
    );
  }

  // Full official artwork with ECG pulse waves and slogan
  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 1000 640"
          style={{ height: `${h}px`, width: `${(h * 1000) / 640}px` }}
          className={`overflow-visible ${
            animatePulse ? 'drop-shadow-[0_0_25px_rgba(229,27,36,0.6)]' : 'drop-shadow-[0_0_12px_rgba(229,27,36,0.3)]'
          }`}
        >
          {/* Left ECG Wave */}
          <path
            d="M 50 340 L 220 340 L 235 300 L 255 390 L 285 200 L 315 430 L 332 330 L 342 340"
            fill="none"
            stroke="#E51B24"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right ECG Wave */}
          <path
            d="M 658 340 L 668 330 L 685 430 L 715 200 L 745 390 L 765 300 L 780 340 L 950 340"
            fill="none"
            stroke="#E51B24"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Red Shield */}
          <path
            d="M 330 150 C 430 125 500 120 500 120 C 500 120 570 125 670 150 L 670 345 C 670 495 500 595 500 595 C 500 595 330 495 330 345 Z"
            fill="#03060A"
            stroke="#E51B24"
            strokeWidth="24"
            strokeLinejoin="round"
          />

          {/* White Car Body */}
          <path
            d="M 430 220 L 570 220 C 578 220 584 224 588 230 L 624 286 C 632 286 642 292 642 302 L 642 314 C 642 320 636 324 628 324 L 626 335 C 636 350 644 375 640 405 C 636 430 610 445 595 448 L 405 448 C 390 445 364 430 360 405 C 356 375 364 350 374 335 L 372 324 C 364 324 358 320 358 314 L 358 302 C 358 292 368 286 376 286 L 412 230 C 416 224 422 220 430 220 Z"
            fill="#FFFFFF"
          />

          {/* Dark Windshield */}
          <path d="M 438 232 L 562 232 L 602 284 L 398 284 Z" fill="#03060A" />

          {/* Side mirrors */}
          <rect x="345" y="292" width="22" height="12" rx="4" fill="#FFFFFF" />
          <rect x="633" y="292" width="22" height="12" rx="4" fill="#FFFFFF" />

          {/* Headlights */}
          <polygon points="378,340 432,348 424,370 374,358" fill="#03060A" />
          <polygon points="622,340 568,348 576,370 626,358" fill="#03060A" />

          {/* Circular Siren Emblem */}
          <circle cx="500" cy="380" r="62" fill="#000000" stroke="#FFFFFF" strokeWidth="6" />

          {/* Radiating Light Rays */}
          <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round">
            <line x1="500" y1="334" x2="500" y2="346" />
            <line x1="472" y1="342" x2="480" y2="352" />
            <line x1="528" y1="342" x2="520" y2="352" />
            <line x1="452" y1="362" x2="463" y2="368" />
            <line x1="548" y1="362" x2="537" y2="368" />
          </g>

          {/* Emergency Siren Beacon (Red) */}
          <path
            d="M 482 408 L 518 408 C 518 408 522 386 512 372 C 506 364 494 364 488 372 C 478 386 482 408 482 408 Z"
            fill="#E51B24"
          />
          <rect x="474" y="406" width="52" height="8" rx="2" fill="#FFFFFF" />
          <circle cx="496" cy="376" r="4" fill="#FFFFFF" opacity="0.85" />
        </svg>
      </div>

      {/* Slogan */}
      {showSlogan && (
        <div className="mt-2 text-center">
          <p className="font-extrabold tracking-[0.25em] text-xs sm:text-sm uppercase font-display">
            <span className="text-white">EVERY SECOND </span>
            <span className="text-[#E51B24] drop-shadow-[0_0_8px_rgba(229,27,36,0.6)]">SAVES A LIFE.</span>
          </p>
        </div>
      )}
    </div>
  );
};
