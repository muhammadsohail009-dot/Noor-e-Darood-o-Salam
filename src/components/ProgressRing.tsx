import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

type ProgressRingProps = {
  current: number;
  target: number;
  isUrdu: boolean;
  onOpenCounter?: () => void;
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  current,
  target,
  isUrdu,
  onOpenCounter,
}) => {
  const safeTarget = target > 0 ? target : 100;
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));
  const isCompleted = current >= safeTarget;

  // SVG parameters
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-900/60 to-emerald-950/80 rounded-2xl border border-emerald-800/60 shadow-xl text-center relative overflow-hidden group">
      {/* Background Islamic Pattern Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none" />

      <div className="relative w-48 h-48 flex items-center justify-center my-2">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-emerald-950/80 stroke-emerald-900/60"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#emeraldGoldGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="emeraldGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-100">
          {isCompleted ? (
            <div className="flex flex-col items-center animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-amber-400 mb-1" />
              <span className="text-2xl font-bold font-serif text-amber-300">100%</span>
              <span className="text-xs text-amber-200/90 font-medium">
                {isUrdu ? 'ہدف مکمل!' : 'Goal Achieved!'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                {current}
              </span>
              <div className="h-0.5 w-10 bg-amber-400/40 my-1" />
              <span className="text-xs font-medium text-emerald-300/80">
                {isUrdu ? `ہدف: ${safeTarget}` : `Target: ${safeTarget}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-emerald-200/90 mt-2">
        {isUrdu
          ? `آج کا ہدف ${percentage}% مکمل ہوا`
          : `Today's Goal is ${percentage}% Complete`}
      </p>

      {onOpenCounter && (
        <button
          onClick={onOpenCounter}
          className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-emerald-950" />
          <span>{isUrdu ? 'ابھی درود پڑھیں' : 'Recite & Count Now'}</span>
        </button>
      )}
    </div>
  );
};
