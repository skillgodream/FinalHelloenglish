import React from 'react';
import { Sparkles, Flame, Bell } from 'lucide-react';
import { CoachNehaAvatar } from './CoachNehaAvatar';

interface HeaderProps {
  streakDays?: number;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakDays = 5,
  onOpenProfile,
}) => {
  return (
    <header className="w-full flex items-center justify-between pt-3 pb-2 px-1">
      {/* Brand Mark Icon */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F97316] p-[2px] shadow-sm flex items-center justify-center">
          <div className="w-full h-full bg-[#181124] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#FDF2F8]" />
          </div>
        </div>
      </div>

      {/* Right side controls: Notification Bell & Avatar */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          className="w-9 h-9 rounded-full bg-white/95 border border-[#E9D5FF] flex items-center justify-center text-[#6B21A8] hover:bg-[#FAF5FF] hover:border-[#D8B4FE] transition-colors relative shadow-2xs cursor-pointer"
          title="Daily reminder"
          onClick={onOpenProfile}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EC4899] ring-2 ring-white" />
        </button>

        {/* Coach Neha mini avatar */}
        <button
          onClick={onOpenProfile}
          className="focus:outline-none hover:scale-105 transition-transform cursor-pointer"
          title="Profile & Settings"
        >
          <CoachNehaAvatar size="sm" showBadge />
        </button>
      </div>
    </header>
  );
};
