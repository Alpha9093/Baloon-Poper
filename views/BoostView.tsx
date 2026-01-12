
import React from 'react';
import { UserData } from '../types';
import { BOOST_PRICES } from '../constants';
import { Zap, Activity, Battery, Radio, ChevronRight, TrendingUp } from 'lucide-react';

const BoostView: React.FC<{ user: UserData; onUpgrade: (type: string) => void }> = ({ user, onUpgrade }) => {
  const boosts = [
    {
      id: 'multiTap',
      name: 'Neural Tap',
      desc: 'Increase credits per tap',
      lvl: user.multiTap,
      cost: BOOST_PRICES.multiTap(user.multiTap),
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 'coreCapacity',
      name: 'Core Capacity',
      desc: 'Expand max energy storage',
      lvl: user.maxEnergy,
      cost: BOOST_PRICES.coreCapacity(user.maxEnergy),
      icon: Battery,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      id: 'fluxSpeed',
      name: 'Flux Speed',
      desc: 'Accelerate energy recharge',
      lvl: user.energyRate,
      cost: BOOST_PRICES.fluxSpeed(user.energyRate),
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      id: 'cyberDrones',
      name: 'Cyber Drones',
      desc: 'Passive auto-mining protocol',
      lvl: user.cyberDronesLevel,
      cost: BOOST_PRICES.cyberDrones(user.cyberDronesLevel),
      icon: Radio,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black font-orbitron neon-emerald">NEURAL UPGRADES</h2>
        <div className="px-3 py-1 glass rounded-full flex items-center gap-2 border-emerald-500/30">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400">{user.credits.toLocaleString()} CR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boosts.map(boost => (
          <button
            key={boost.id}
            onClick={() => onUpgrade(boost.id)}
            disabled={user.credits < boost.cost}
            className={`flex items-center gap-4 p-5 rounded-2xl glass border border-white/5 transition-all group relative overflow-hidden ${
              user.credits >= boost.cost ? 'hover:border-emerald-500/50 hover:bg-white/10 active:scale-95' : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <div className={`p-4 rounded-xl ${boost.bg} ${boost.color}`}>
              <boost.icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 text-left">
              <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{boost.name}</h3>
              <p className="text-xs text-slate-400">{boost.desc}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">LVL {boost.lvl}</span>
                <span className="text-[10px] text-slate-600">•</span>
                <span className={`text-[10px] font-bold uppercase ${user.credits >= boost.cost ? 'text-emerald-400' : 'text-red-400'}`}>
                  {boost.cost.toLocaleString()} CREDITS
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400" />
            
            {/* Progress Bar for the price */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
              <div 
                className={`h-full transition-all duration-500 ${user.credits >= boost.cost ? 'bg-emerald-500' : 'bg-red-500/40'}`}
                style={{ width: `${Math.min(100, (user.credits / boost.cost) * 100)}%` }}
              ></div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 glass rounded-2xl border border-white/10 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-400/20">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold font-orbitron">SYSTEM STATS</h3>
        <p className="text-sm text-slate-400 max-w-sm">Every upgrade integrates deeper into the neural mainframe, increasing your harvest yield and efficiency.</p>
      </div>
    </div>
  );
};

export default BoostView;
