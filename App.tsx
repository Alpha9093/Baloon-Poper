
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Wallet, 
  LayoutGrid, 
  ShieldAlert, 
  RefreshCw,
  MoreVertical,
  Cpu,
  Terminal,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react';
import { UserData, AppView, Task, WithdrawalRequest } from './types';
import { INITIAL_USER, TASKS, BOOST_PRICES } from './constants';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot 
} from './firebase';

// --- Views ---
import MiningView from './views/MiningView';
import BoostView from './views/BoostView';
import TaskView from './views/TaskView';
import FriendsView from './views/FriendsView';
import WalletView from './views/WalletView';
import AdminView from './views/AdminView';
import CoreAIView from './views/CoreAIView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.MINING);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [user, setUser] = useState<UserData>(INITIAL_USER);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('green_miner_tasks');
    return saved ? JSON.parse(saved) : TASKS;
  });

  // Auth & Database Sync Listener
  useEffect(() => {
    let unsubscribeDoc: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        const userDocRef = doc(db, "users", fUser.uid);
        
        // Initial setup/fetch
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          // Provision new user in Firestore
          const newUser: UserData = {
            ...INITIAL_USER,
            uid: fUser.uid,
            displayName: fUser.displayName || 'Neural Node',
            isAdmin: fUser.email === 'admin@baloonpoper.bot' || fUser.uid === '693605500238',
            joinedAt: Date.now()
          };
          await setDoc(userDocRef, newUser);
          setUser(newUser);
        } else {
          setUser(userDoc.data() as UserData);
        }

        // Real-time listener for credits and boosts
        unsubscribeDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser(snapshot.data() as UserData);
          }
        });
      } else {
        setUser(INITIAL_USER);
        if (unsubscribeDoc) unsubscribeDoc();
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // Sync tasks locally (Tasks are session-based or global, usually not high-security)
  useEffect(() => {
    localStorage.setItem('green_miner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Energy Recharge Logic (Local calculation)
  useEffect(() => {
    if (!firebaseUser) return;
    const rechargeInterval = setInterval(() => {
      setUser(prev => {
        if (prev.energy < prev.maxEnergy) {
          return { ...prev, energy: Math.min(prev.maxEnergy, prev.energy + prev.energyRate) };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(rechargeInterval);
  }, [firebaseUser]);

  // handlePop - Atomic Firestore Increment
  const handlePop = async (reward: number) => {
    if (!firebaseUser || user.energy < 1) return false;

    const actualReward = reward * user.multiTap;

    // Optimistic UI Update
    setUser(prev => ({
      ...prev,
      credits: prev.credits + actualReward,
      energy: prev.energy - 1
    }));

    if (navigator.vibrate) navigator.vibrate(10);

    // Atomic Database Update
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userDocRef, {
        credits: increment(actualReward),
        // Energy is less sensitive, we can sync it periodically or just here
        energy: increment(-1) 
      });
    } catch (e) {
      console.error("Critical Sync Failure:", e);
    }
    
    return true;
  };

  const updateBoost = async (type: string) => {
    if (!firebaseUser) return;
    
    let cost = 0;
    let field = '';
    let valChange = 0;
    
    switch(type) {
      case 'multiTap':
        cost = BOOST_PRICES.multiTap(user.multiTap);
        field = 'multiTap';
        valChange = 1;
        break;
      case 'coreCapacity':
        cost = BOOST_PRICES.coreCapacity(user.maxEnergy);
        field = 'maxEnergy';
        valChange = 500;
        break;
      case 'fluxSpeed':
        cost = BOOST_PRICES.fluxSpeed(user.energyRate);
        field = 'energyRate';
        valChange = 1;
        break;
      case 'cyberDrones':
        cost = BOOST_PRICES.cyberDrones(user.cyberDronesLevel);
        field = 'cyberDronesLevel';
        valChange = 1;
        break;
    }

    if (cost > 0 && user.credits >= cost) {
      setIsSyncing(true);
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const updates: any = {
          credits: increment(-cost),
          [field]: increment(valChange)
        };
        
        // Special case for energy capacity boost: also refill energy
        if (type === 'coreCapacity') {
          updates.energy = increment(valChange);
        }

        await updateDoc(userDocRef, updates);
      } catch (e) {
        console.error("Upgrade Sync Failed:", e);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const completeTask = async (id: string) => {
    if (!firebaseUser) return;
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
      
      // Update balance in Firestore
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        await updateDoc(userDocRef, {
          credits: increment(task.reward)
        });
      } catch (e) {
        console.error("Task Reward Sync Failed:", e);
      }
    }
  };

  const handleRefreshTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 font-orbitron text-[10px] text-emerald-500 tracking-[0.4em] uppercase">Initializing_Neural_Link...</p>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden p-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[150px]"></div>
        </div>

        <div className="z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-8 animate-bounce">
            <Terminal className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black font-orbitron neon-emerald tracking-tighter mb-4">BALOON POPER</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 uppercase tracking-widest opacity-80">
            Secure neural-mining protocol. Connect your identity to access the global data grid.
          </p>
          
          <button 
            onClick={handleLogin}
            className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-50 shadow-xl transition-all active:scale-95 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa-google.svg" alt="G" className="w-5 h-5" />
            <span className="font-orbitron text-xs tracking-widest uppercase">Connect Neural ID</span>
          </button>
          
          <div className="mt-12 flex items-center justify-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Encrypted</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span>V3.0.1 Stable</span>
          </div>
        </div>
      </div>
    );
  }

  if (user.isBanned) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <ShieldAlert className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-4xl font-black font-orbitron mb-2 tracking-tighter text-red-500">LINK SEVERED</h1>
        <p className="text-slate-400 max-w-md font-mono text-sm uppercase">Neural signature blacklisted. Protocol violation detected.</p>
        <button onClick={handleLogout} className="mt-10 text-xs font-black text-slate-500 uppercase tracking-widest underline">Return to Gatekeeper</button>
      </div>
    );
  }

  const navItems = [
    { id: AppView.MINING, label: 'Nodes', icon: Zap },
    { id: AppView.BOOSTS, label: 'Matrix', icon: TrendingUp },
    { id: AppView.TASKS, label: 'Watch to Earn', icon: LayoutGrid },
    { id: AppView.CORE_AI, label: 'Neural', icon: Cpu },
    { id: AppView.FRIENDS, label: 'Relay', icon: Users },
    { id: AppView.WALLET, label: 'Vault', icon: Wallet },
  ];

  if (user.isAdmin) {
    navItems.push({ id: AppView.ADMIN, label: 'Admin', icon: ShieldCheck });
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-950 relative text-slate-200">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="hidden md:flex flex-col w-72 glass border-r border-white/5 z-20">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-black font-orbitron neon-emerald tracking-tighter uppercase">BALOON POPER</h1>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Active_Session: {firebaseUser.uid.slice(0, 8)}</p>
        </div>
        
        <div className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                activeView === item.id 
                  ? (item.id === AppView.ADMIN ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]') 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activeView === item.id ? (item.id === AppView.ADMIN ? 'text-red-500' : 'text-emerald-400') : ''}`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={firebaseUser.photoURL || ''} alt="Av" className="w-12 h-12 rounded-xl border border-emerald-500/30" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-white">{user.displayName}</span>
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{user.isAdmin ? 'Admin_Link' : 'Master_Poper'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="px-6 py-4 md:py-6 flex items-center justify-between glass border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-black">Net Harvested</span>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-3xl font-orbitron font-black text-white tracking-tight leading-none">
                {user.credits.toFixed(2)}
              </span>
              <div className="bg-emerald-500/10 px-2 py-0.5 rounded text-[8px] font-black text-emerald-400 border border-emerald-500/30 uppercase tracking-tighter">
                CR
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Network Sync</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Stable</span>
                {isSyncing ? (
                   <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                )}
              </div>
            </div>
            <div className="h-8 w-px bg-white/5"></div>
            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <MoreVertical className="text-slate-500 w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10">
          {activeView === AppView.MINING && <MiningView user={user} onPop={handlePop} />}
          {activeView === AppView.BOOSTS && <BoostView user={user} onUpgrade={updateBoost} />}
          {activeView === AppView.TASKS && <TaskView tasks={tasks} onComplete={completeTask} onRefresh={handleRefreshTasks} />}
          {activeView === AppView.FRIENDS && <FriendsView user={user} onClaimReferral={async (amt) => {
             const userDocRef = doc(db, "users", firebaseUser.uid);
             await updateDoc(userDocRef, {
               credits: increment(amt),
               referralEarnings: increment(amt)
             });
          }} />}
          {activeView === AppView.WALLET && <WalletView user={user} onSubmitWithdrawal={(addr, amt) => {}} />}
          {activeView === AppView.ADMIN && user.isAdmin ? <AdminView user={user} setUser={setUser} /> : null}
          {activeView === AppView.CORE_AI && <CoreAIView user={user} />}
        </div>
      </main>

      <nav className="md:hidden glass border-t border-white/5 flex items-center justify-around py-3 px-2 pb-8 z-50 bg-slate-950/80">
        <div className="flex gap-2 overflow-x-auto w-full justify-around custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative min-w-[50px] ${
                activeView === item.id ? (item.id === AppView.ADMIN ? 'text-red-500' : 'text-emerald-400') : 'text-slate-600'
              }`}
            >
              {activeView === item.id && (
                <div className={`absolute -top-3 w-10 h-1 rounded-full shadow-[0_0_10px_currentcolor] ${item.id === AppView.ADMIN ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
              )}
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'fill-current opacity-10' : ''}`} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
