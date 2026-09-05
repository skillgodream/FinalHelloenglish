import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';

export const RockAndRollProfilesView: React.FC<{ 
  onSelectHospitality: () => void; 
  onSelectRetail: () => void;
  onSelectSupplyChain: () => void;
  onSelectDummy: (profileName: string) => void; 
  onBack: () => void 
}> = ({ onSelectHospitality, onSelectRetail, onSelectSupplyChain, onSelectDummy, onBack }) => {
  const profiles = [
    {
      id: 'Hospitality',
      name: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      action: 'hospitality'
    },
    {
      id: 'Retail',
      name: 'Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      action: 'retail'
    },
    {
      id: 'Supply Chain',
      name: 'Supply Chain',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      action: 'supply-chain'
    },
    {
      id: 'Services',
      name: 'Services',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80',
      action: 'dummy'
    }
  ];

  const handleProfileClick = (profile: typeof profiles[0]) => {
    if (profile.action === 'hospitality') {
      onSelectHospitality();
    } else if (profile.action === 'retail') {
      onSelectRetail();
    } else if (profile.action === 'supply-chain') {
      onSelectSupplyChain();
    } else {
      onSelectDummy(profile.name);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Black & Slight Grey High-Pixel Dotted Wave Background */}
      <DottedWaveBackground variant="monochrome" intensity={1.15} />

      {/* Top Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white uppercase tracking-wider font-bold transition-colors bg-zinc-900/85 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Center Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center my-auto">
        {/* HELLOENGLISH Title */}
        <div className="mb-6 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-[#E50914] uppercase drop-shadow-[0_4px_16px_rgba(229,9,20,0.6)]">
            HELLOENGLISH
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-10 drop-shadow">
          Choose your profile
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full px-4 justify-items-center">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleProfileClick(profile)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white shadow-2xl transition-all duration-200 relative bg-zinc-900">
                <img 
                  src={profile.image} 
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="mt-3 text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-white transition-colors drop-shadow">
                {profile.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



