
import React, { useState } from 'react';
import { UserData } from '../types';
import { Wallet, Info, ArrowUpRight, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';

const WalletView: React.FC<{ user: UserData; onSubmitWithdrawal: (addr: string, amt: number) => void }> = ({ user, onSubmitWithdrawal }) => {
  const [address, setAddress] = useState(user.walletAddress);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState('');

  // 10,000,000 credits = $5 => 2,000,000 credits = $1
  const usdValue = (user.credits / 2000000).toFixed(6);
  const minWithdrawal = 5; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amount);
    
    if (!address || address.length < 20) {
      setError('Invalid Wallet Address (TRC-20/TON)');
      return;
    }
    if (isNaN(amt) || amt < minWithdrawal) {
      setError(`Minimum withdrawal is $${minWithdrawal}`);
      return;
    }
    if (amt > parseFloat(usdValue)) {
      setError('Insufficient neural credits');
      return;
    }

    onSubmitWithdrawal(address, amt);
    setAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-orbitron neon-emerald tracking-tight">USDT VAULT</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Convert neural assets into stable currencies.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            {"10,000,000 CR = $5.000000"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-12 glass rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-blue-500/10 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1),_transparent_70%)]"></div>
          
          <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Wallet className="w-10 h-10 text-emerald-400" />
          </div>
          
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6 relative z-10">Net_Induction_Balance</span>
          
          <div className="relative z-10">
             <div className="flex flex-col items-center">
               <span className="text-5xl md:text-7xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{usdValue}</span>
               <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-emerald-400 font-black uppercase text-xs tracking-[0.3em]">USDT_AVAILABLE</span>
               </div>
             </div>
          </div>
          
          <div className="mt-10 pt-10 border-t border-white/5 w-full flex flex-col items-center gap-2">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calculated Credit Mass</span>
             <span className="text-lg font-mono font-black text-white/80">{user.credits.toFixed(6)}{" CR"}</span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="p-8 glass rounded-[2rem] border border-white/10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <ArrowUpRight className="w-6 h-6 text-emerald-400" />
               </div>
               <div>
                <h3 className="font-black text-md uppercase tracking-[0.2em] text-white">Extraction Protocol</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network: TRC-20 / TON / BEP-20</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Destination_Hash</label>
                <input 
                  type="text" 
                  placeholder="Enter secure wallet address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:border-emerald-500/50 outline-none transition-all font-mono text-emerald-100 placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Extraction_Mass (USDT)</label>
                   <span className="text-[9px] text-emerald-500/40 font-black uppercase">{"Min Extraction: $5.000000"}</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.000001"
                    placeholder="0.000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-14 py-5 text-2xl focus:border-emerald-500/50 outline-none transition-all font-orbitron font-black text-white placeholder:text-slate-900"
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 font-black font-orbitron text-lg">$</div>
                  <button 
                    type="button"
                    onClick={() => setAmount(usdValue)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all uppercase tracking-tighter"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-red-400 text-[10px] font-black p-4 bg-red-500/5 rounded-2xl border border-red-500/20 uppercase tracking-widest animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-slate-950 font-orbitron font-black rounded-2xl shadow-[0_15px_40px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] active:scale-95 text-xs tracking-[0.3em] uppercase"
            >
              Initiate Sequential Transfer
            </button>
          </form>

          <div className="p-6 glass rounded-2xl border border-white/5 flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Security Audit protocol</h4>
                <p className="text-[9px] text-slate-500 uppercase leading-relaxed font-bold tracking-wider">All manual extractions undergo multi-sig verification by neural auditors. Transfer latency estimated between 24 and 48 cycles.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
