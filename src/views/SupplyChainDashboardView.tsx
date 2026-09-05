import React from 'react';
import { motion } from 'motion/react';
import qcDelay from '../data/rockandrole/quick_commerce/qc_delay.json';
import qcDamagedMissing from '../data/rockandrole/quick_commerce/qc_damaged_missing.json';
import qcWrongAddress from '../data/rockandrole/quick_commerce/qc_wrong_address.json';
import qcQualityExpiry from '../data/rockandrole/quick_commerce/qc_quality_expiry.json';
import qcOutOfStock from '../data/rockandrole/quick_commerce/qc_out_of_stock.json';
import qcHisabRefund from '../data/rockandrole/quick_commerce/qc_hisab_refund.json';
import { Sparkles, ArrowLeft, Truck, RefreshCw } from 'lucide-react';
import { DottedWaveBackground } from '../components/DottedWaveBackground';
import { AudioMuteButton } from '../components/AudioMuteButton';

interface ThemeCardProps {
  theme: any;
  onSelect: () => void;
}

const SUPPLY_CHAIN_META: Record<string, { image: string; tag: string }> = {
  qc_jaldi_delay: {
    image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=800&q=80',
    tag: '10-Min Delivery Delays',
  },
  qc_damaged_missing: {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tag: 'Leaking & Missing Items',
  },
  qc_wrong_address: {
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Gate Access & Address Errors',
  },
  qc_quality_expiry: {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    tag: 'Freshness & Expiry Claims',
  },
  qc_out_of_stock: {
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    tag: 'Dark Store Stockouts',
  },
  qc_hisab_refund: {
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572290?auto=format&fit=crop&w=800&q=80',
    tag: 'UPI & Surge Fee Disputes',
  },
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const meta = SUPPLY_CHAIN_META[theme.bucketId] || {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tag: 'Quick Commerce Track',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer shadow-lg transition-all duration-200"
    >
      <img
        src={meta.image}
        alt={theme.theme}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      <div className="relative h-full p-2.5 flex flex-col justify-end z-10 text-left">
        <h3 className="text-xs font-bold text-white tracking-tight drop-shadow-md leading-tight">
          {theme.theme}
        </h3>
        <p className="text-[10px] text-zinc-300 font-medium line-clamp-1 mt-0.5 opacity-90">
          {meta.tag}
        </p>
      </div>
    </motion.div>
  );
};

export const SupplyChainDashboardView: React.FC<{
  onBack: () => void;
  onSelectTheme: (theme: any) => void;
}> = ({ onBack, onSelectTheme }) => {
  const data = [
    qcDelay,
    qcDamagedMissing,
    qcWrongAddress,
    qcQualityExpiry,
    qcOutOfStock,
    qcHisabRefund,
  ];

  return (
    <div className="relative w-full bg-black text-white p-4 pt-6 pb-16 flex flex-col min-h-full overflow-hidden">
      <DottedWaveBackground variant="monochrome" intensity={1.15} />

      <div className="relative z-10 flex flex-col w-full">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <AudioMuteButton size="sm" variant="glass" />
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Supply Chain & Quick Commerce
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
            Quick Commerce Scenarios
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Master 10-minute grocery delivery escalations, dark store delays, damaged goods & refund handling
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {data.map((d) => (
            <ThemeCard
              key={d.bucketId}
              theme={d}
              onSelect={() => onSelectTheme(d)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
