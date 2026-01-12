
import React, { useState, useMemo } from 'react';
import { UserData } from '../types';
import { Users, Copy, Check, Send, RefreshCw, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface FriendsViewProps {
  user: UserData;
  onClaimReferral: (amount: number) => void;
}

const FriendsView: React.FC<FriendsViewProps> = ({ user, onClaimReferral }) => {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [claimable, setClaimable] = useState(() => Math.floor(Math.random() * 50) + 10); // Simulated pending rewards
  
  const referralLink = `https://t.me/baloonpoperBot?start=${user.uid}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSync = () => {
    if (syncing || claimable <= 0) return;
    setSyncing(true);
    
    // Simulate checking network for friend activity
    setTimeout(() => {
      onClaimReferral(claimable);
      setClaimable(0);
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black font-orbitron neon-emerald tracking-tight uppercase">Relay Network</h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Harness the collective power of your neural grid.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:border-emerald-500/20 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-3xl font-orbitron font-black text-white">{user.referrals}</span>
          <span className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">Active Nodes</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Sparkles className="w-3 h-3 text-emerald-500/40 animate-pulse" />
          </div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Network Yield</span>
          <span className="text-2xl font-orbitron font-black text-white">15% SHARE</span>
          <span className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">MAX COMMISSION TIER</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center justify-center bg-gradient-to-br from-emerald-500/5 to-transparent">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Extracted</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-2xl font-orbitron font-black text-white">{(user.referralEarnings || 0).toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">CR LIFETIME</span>
        </div>
      </div>

      <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
             <h3 className="text-xl font-black font-orbitron text-white tracking-tighter uppercase">Expand The Grid</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl font-medium">
            Shift from manual harvesting to network dominance. Every miner who joins through your uplink grants you a <span className="text-emerald-400 font-bold">15% Lifetime Revenue Share</span> of their total harvested credits. 
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 relative z-10">
          <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4 overflow-hidden group hover:border-emerald-500/30 transition-all">
            <Send className="w-5 h-5 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
            <span className="text-xs text-slate-500 font-mono truncate">{referralLink}</span>
          </div>
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all font-orbitron font-black text-xs shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'LINK_COPIED' : 'COPY_UPLINK'}
          </button>
        </div>

        <div className="pt-4 space-y-4">
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Node Commissions</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">{claimable > 0 ? `${claimable} CR READY` : 'GRID SYNCED'}</span>
           </div>
           
           <button
            onClick={handleSync}
            disabled={claimable <= 0 || syncing}
            className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl border transition-all group relative overflow-hidden ${
              claimable > 0 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-white/5 border-white/10 text-slate-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-5 h-5 relative z-10 ${syncing ? 'animate-spin text-emerald-300' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            <span className="font-orbitron font-black tracking-[0.25em] text-xs relative z-10 uppercase">
              {syncing ? 'EXTRACTING...' : 'SYNC_GRID_COMMISSION'}
            </span>
          </button>
        </div>
      </div>

      <div className="p-6 glass rounded-2xl border border-white/5 flex items-start gap-4">
         <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
            <TrendingUp className="w-4 h-4 text-blue-400" />
         </div>
         <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Elite Network Protocol</h4>
            <p className="text-[9px] text-slate-500 uppercase leading-relaxed font-bold">The Baloon Poper relay algorithm is optimized for high-volume packet ingestion. More active friends = higher network stability and increased passive commission rates.</p>
         </div>
      </div>
    </div>
  );
};

export default FriendsView;
