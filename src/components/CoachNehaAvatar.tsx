import React from 'react';

interface CoachNehaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export const CoachNehaAvatar: React.FC<CoachNehaAvatarProps> = ({
  size = 'md',
  showBadge = false,
  isSpeaking = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer animated speaking glow */}
      {isSpeaking && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F97316] animate-pulse blur-[4px]" />
      )}

      {/* Avatar Container with vibrant gradient border */}
      <div
        className={`${sizeMap[size]} rounded-full p-[2px] bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F97316] shadow-sm relative overflow-hidden`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF5FF] relative flex items-center justify-center">
          {/* Stylized illustrated portrait of Coach Neha */}
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBD5BC" />
                <stop offset="100%" stopColor="#EBB89B" />
              </linearGradient>
              <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A1B28" />
                <stop offset="100%" stopColor="#18111C" />
              </linearGradient>
              <linearGradient id="dress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>
              <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF2F8" />
                <stop offset="100%" stopColor="#F3E8FF" />
              </linearGradient>
            </defs>

            {/* Background */}
            <circle cx="50" cy="50" r="50" fill="url(#bgGlow)" />

            {/* Hair Back */}
            <path d="M22 45 Q20 85 40 92 Q50 95 60 92 Q80 85 78 45 Q76 18 50 18 Q24 18 22 45 Z" fill="url(#hair)" />

            {/* Shoulders / Kurti / Blazer */}
            <path d="M20 95 C25 78 35 72 50 72 C65 72 75 78 80 95 Z" fill="url(#dress)" />
            {/* Collar neckline */}
            <path d="M42 72 L50 82 L58 72 Z" fill="#FBD5BC" />

            {/* Neck */}
            <rect x="44" y="60" width="12" height="15" rx="4" fill="url(#skin)" />

            {/* Face */}
            <ellipse cx="50" cy="48" rx="20" ry="22" fill="url(#skin)" />

            {/* Hair Front / Bangs */}
            <path d="M30 38 C32 24 45 22 50 22 C55 22 68 24 70 38 C65 30 55 28 50 30 C45 28 35 30 30 38 Z" fill="url(#hair)" />
            {/* Hair Side strands */}
            <path d="M30 38 C28 48 30 60 32 68 C34 60 32 48 32 40 Z" fill="url(#hair)" />
            <path d="M70 38 C72 48 70 60 68 68 C66 60 68 48 68 40 Z" fill="url(#hair)" />

            {/* Eyes */}
            <ellipse cx="42" cy="46" rx="2.5" ry="3.2" fill="#2A1B28" />
            <circle cx="43" cy="45" r="1" fill="#FFFFFF" />
            <ellipse cx="58" cy="46" rx="2.5" ry="3.2" fill="#2A1B28" />
            <circle cx="59" cy="45" r="1" fill="#FFFFFF" />

            {/* Eyebrows */}
            <path d="M38 41 Q42 39 46 41" stroke="#2A1B28" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M54 41 Q58 39 62 41" stroke="#2A1B28" strokeWidth="1.6" strokeLinecap="round" fill="none" />

            {/* Warm Friendly Smile */}
            <path d="M43 56 Q50 63 57 56" stroke="#D15B78" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Soft Blush */}
            <circle cx="36" cy="52" r="4" fill="#FFA5BD" opacity="0.55" />
            <circle cx="64" cy="52" r="4" fill="#FFA5BD" opacity="0.55" />

            {/* Subtle Bindi */}
            <circle cx="50" cy="38" r="1.4" fill="#C43862" />

            {/* Small pearl earrings */}
            <circle cx="28" cy="50" r="2.2" fill="#FFFFFF" />
            <circle cx="72" cy="50" r="2.2" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Online indicator badge */}
      {showBadge && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />
      )}
    </div>
  );
};
