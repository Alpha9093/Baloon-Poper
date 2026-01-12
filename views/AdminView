
import React, { useState, useMemo } from 'react';
import { UserData, WithdrawalRequest } from '../types';
import { 
  ShieldCheck, Search, Ban, Unlock, UserCheck, AlertTriangle, 
  BarChart3, Users, DollarSign, Settings, FileText, CheckCircle, 
  XCircle, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Database, RefreshCw, Trash2, Edit3
} from 'lucide-react';

type AdminTab = 'overview' | 'users' | 'finance' | 'kyc' | 'config' | 'support';

const AdminView: React.FC<{ user: UserData; setUser: React.Dispatch<React.SetStateAction<UserData>> }> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for the dashboard
  const stats = {
    totalUsers: 14205,
    activeNodes: 2832,
    pendingWithdrawals: 18,
    totalCreditsCirculating: '412.4M',
    systemHealth: '98.2%',
    revenue7d: [20, 45, 28, 80, 99, 43, 60] // For the Sparkline
  };

  // Mock users list
  const mockUsers: (Partial<UserData> & { lastSeen: string })[] = [
    { uid: 'u1283', displayName: 'CryptoNova', credits: 1250000, referrals: 12, kycStatus: 'verified', isBanned: false, lastSeen: '2m ago' },
    { uid: 'u4921', displayName: 'NeonBender', credits: 450200, referrals: 2, kycStatus: 'pending', isBanned: false, lastSeen: '14m ago' },
    { uid: 'u0032', displayName: 'VoidRunner', credits: 89000, referrals: 0, kycStatus: 'unverified', isBanned: true, lastSeen: '3d ago' },
    { uid: 'u8821', displayName: 'Satoshi_X', credits: 8920000, referrals: 84, kycStatus: 'verified', isBanned: false, lastSeen: 'Just now' },
  ];

  const approveWithdrawal = (id: string) => {
    // Logic for actual app would involve API calls
    console.log(`Approving withdrawal: ${id}`);
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Network Popers', val: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-400', trend: '+12%' },
          { label: 'Active Neural Nodes', val: stats.activeNodes.toLocaleString(), icon: RefreshCw, color: 'text-emerald-400', trend: '+5%' },
          { label: 'Extraction Requests', val: stats.pendingWithdrawals, icon: DollarSign, color: 'text-amber-400', trend: 'High' },
          { label: 'System Integrity', val: stats.systemHealth, icon: ShieldCheck, color: 'text-purple-400', trend: 'Stable' },
        ].map((item, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <item.icon className="w-12 h-12" />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{item.label}</span>
             <div className="flex items-end gap-3">
                <span className="text-2xl font-orbitron font-black text-white">{item.val}</span>
                <span className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{item.trend}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black font-orbitron text-white uppercase tracking-tighter flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              CREDIT_FLUX_7D
            </h3>
            <div className="flex gap-2">
              <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors">Daily</button>
              <button className="text-[10px] font-black text-emerald-400 uppercase">Weekly</button>
            </div>
          </div>
          <div className="h-48 w-full flex items-end gap-2 px-2">
            {stats.revenue7d.map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/30 transition-all rounded-t-lg relative group cursor-help" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h}M CR
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
              <span key={d} className="text-[9px] font-black text-slate-600 uppercase">{d}</span>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/10 flex flex-col">
          <h3 className="font-black font-orbitron text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            CRITICAL_ALERTS
          </h3>
          <div className="space-y-4 flex-1">
            {[
              { msg: 'High withdrawal volume from Node #u8821', time: '2m ago', level: 'high' },
              { msg: 'System backup cycle completed', time: '1h ago', level: 'info' },
              { msg: 'Failed login attempts on Admin IP', time: '4h ago', level: 'warning' },
            ].map((alert, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border-l-2 border-emerald-500/40 flex flex-col gap-1">
                <span className="text-[10px] text-white font-bold leading-tight">{alert.msg}</span>
                <span className="text-[9px] text-slate-500 uppercase font-black">{alert.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all">
            Clear Protocols
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Filter by UID, Neural Signature, or Display Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-emerald-500/50 outline-none transition-all font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
          <Filter className="w-4 h-4" /> Export_Data
        </button>
      </div>

      <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Inhabitant</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Credits</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">KYC</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockUsers.map((u, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center font-orbitron text-[10px] font-black text-emerald-400">
                        {u.displayName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{u.displayName}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-black">{u.lastSeen}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{u.uid}</td>
                  <td className="px-6 py-4 font-orbitron text-xs text-white">{(u.credits || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {u.isBanned ? (
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20">Terminated</span>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-[9px] font-black uppercase tracking-tighter ${
                       u.kycStatus === 'verified' ? 'text-blue-400' : u.kycStatus === 'pending' ? 'text-amber-400' : 'text-slate-600'
                     }`}>
                       {u.kycStatus}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderKYC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="p-8 glass rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
             <UserCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-black font-orbitron text-white uppercase mb-2">Compliance Queue Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm font-medium">No pending neural identities require verification at this cycle. Systems operating within verified parameters.</p>
       </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-2xl border border-white/5">
             <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Total Payouts</span>
             <span className="text-2xl font-orbitron font-black text-white">$142,502.20</span>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5">
             <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Fee Revenue</span>
             <span className="text-2xl font-orbitron font-black text-emerald-400">$12,490.50</span>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5">
             <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Est. Reserve</span>
             <span className="text-2xl font-orbitron font-black text-blue-400">8.2M CR</span>
          </div>
       </div>

       <div className="glass rounded-[2rem] border border-white/10 p-8">
          <h3 className="text-lg font-black font-orbitron text-white uppercase mb-6">Extraction Requests Queue</h3>
          <div className="text-center py-20 opacity-30">
             <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">No Active Extractions Pending Approval</span>
          </div>
       </div>
    </div>
  );

  const renderConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
       <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6">
          <h3 className="font-black font-orbitron text-white uppercase tracking-tighter flex items-center gap-2 mb-4">
             <Settings className="w-4 h-4 text-emerald-400" />
             Global_Protocols
          </h3>
          
          <div className="space-y-4">
             {[
               { label: 'Induction Bonus (Credits)', val: '0', desc: 'Starting credits for new nodes' },
               { label: 'Relay Share (%)', val: '10', desc: 'Lifetime commission from referrals' },
               { label: 'Extraction Threshold (USDT)', val: '5.00', desc: 'Minimum withdrawal amount' },
               { label: 'Exchange Parity', val: '2M', desc: 'Credits required per 1 USDT' }
             ].map((cfg, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:border-emerald-500/20 border border-transparent transition-all">
                  <div>
                    <span className="text-[10px] font-black text-white uppercase block">{cfg.label}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">{cfg.desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-emerald-400 font-bold">{cfg.val}</span>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><Edit3 className="w-3 h-3" /></button>
                  </div>
               </div>
             ))}
          </div>

          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all">
             Commit Changes to Mainframe
          </button>
       </div>

       <div className="space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-white/10">
             <h3 className="font-black font-orbitron text-white uppercase tracking-tighter mb-4">Maintenance Mode</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-6">Instantly disconnect all nodes and suspend mining operations for system upgrades.</p>
             <button className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Execute Red-Code Lockout
             </button>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-white/10">
             <h3 className="font-black font-orbitron text-white uppercase tracking-tighter mb-4">Neural Data Backup</h3>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-6">Last extraction: 4h 12m ago. Sync to redundant cold storage clusters.</p>
             <button className="w-full py-4 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Trigger Cloud Sync
             </button>
          </div>
       </div>
    </div>
  );

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Mainframe', icon: Database },
    { id: 'users', label: 'Neural Nodes', icon: Users },
    { id: 'finance', label: 'Vault Control', icon: DollarSign },
    { id: 'kyc', label: 'Compliance', icon: ShieldCheck },
    { id: 'config', label: 'Protocols', icon: Settings },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-red-500/20 rounded-[1.5rem] flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
             <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <div>
             <h2 className="text-3xl font-black font-orbitron text-white tracking-tighter leading-none">ADMIN COMMAND</h2>
             <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Clearance: Level_5_Override</p>
             </div>
          </div>
        </div>
        
        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto max-w-full custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-red-500 text-white font-black shadow-lg shadow-red-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'kyc' && renderKYC()}
        {activeTab === 'config' && renderConfig()}
      </div>

      <div className="p-6 glass rounded-[2rem] border border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Sync Status: Stable</span>
         </div>
         <span className="text-[9px] font-mono font-bold text-slate-700 uppercase tracking-tighter">Lat: 24ms • Cluster: EU-West-4</span>
      </div>
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default AdminView;
