import React from 'react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import pikku from '../data/rockandrole/pikku.json';
import chakkar from '../data/rockandrole/chakkar.json';
import jaldi from '../data/rockandrole/jaldi.json';
import mehmaan from '../data/rockandrole/mehmaan.json';
import hisab from '../data/rockandrole/hisab.json';
import kyaHua from '../data/rockandrole/kyaHua.json';
import vip from '../data/rockandrole/vip.json';

interface ChallengeCardProps {
  title: string;
  description: string;
  points: string;
  gradientClass: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, description, points, gradientClass }) => (
  <div className={`p-4 rounded-3xl border border-white/10 ${gradientClass} bg-opacity-20 flex flex-col gap-2`}>
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold">{title}</h3>
      <span className="text-xs bg-black/30 px-2 py-1 rounded-full">{points}</span>
    </div>
    <p className="text-sm text-white/80">{description}</p>
    <button className="mt-2 bg-white text-black text-sm font-bold py-2 px-4 rounded-xl self-start cursor-pointer">
      Start Challenge
    </button>
  </div>
);

export const RockAndRollView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const data = [pikku, chakkar, jaldi, mehmaan, hisab, kyaHua, vip];
  
  const gradients = [
    'bg-gradient-to-br from-indigo-900 to-purple-900',
    'bg-gradient-to-br from-red-900 to-orange-900',
    'bg-gradient-to-br from-blue-900 to-cyan-900',
    'bg-gradient-to-br from-green-900 to-emerald-900',
    'bg-gradient-to-br from-yellow-900 to-orange-900',
    'bg-gradient-to-br from-teal-900 to-blue-900',
    'bg-gradient-to-br from-pink-900 to-rose-900',
  ];

  const challenges = data.map((d, index) => ({
    title: d.theme,
    description: d.themeDescription,
    points: `+${(index + 1) * 10} Points`, // Placeholder points
    gradientClass: gradients[index % gradients.length],
  }));

  return (
    <div className="relative w-full min-h-screen bg-black text-white p-6 pt-16 overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.1} />

      <div className="relative z-10 flex flex-col w-full">
        <button 
          onClick={onBack}
          className="mb-6 p-2 bg-zinc-800/80 backdrop-blur-md rounded-full cursor-pointer self-start"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mb-8 drop-shadow-sm">Rock and Roll</h1>
        <div className="flex flex-col gap-4">
          {challenges.map((c, i) => (
            <ChallengeCard key={i} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
};
