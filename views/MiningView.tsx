
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserData } from '../types';
import { Zap, TrendingUp, Activity, Terminal as TerminalIcon, Shield, Search } from 'lucide-react';

interface DataNode {
  id: number;
  x: number;
  y: number;
  reward: number;
  speed: number;
  scale: number;
  rotation: number;
  isPopped: boolean;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  val: string;
}

const MiningView: React.FC<{ user: UserData; onPop: (reward: number) => boolean }> = ({ user, onPop }) => {
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [log, setLog] = useState<string[]>(["INIT_BALOON_PROTOCOL: SUCCESS", "SEARCHING_DATA_PACKETS..."]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  // Spawn logic
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (nodes.length < 8 && user.energy > 0) {
        const newNode: DataNode = {
          id: nextId.current++,
          x: Math.random() * 80 + 10, // 10% to 90%
          y: 110, // Start below container
          reward: Math.random() * 1.4 + 0.5, // Between 0.5 and 1.9
          speed: Math.random() * 0.2 + 0.1,
          scale: Math.random() * 0.4 + 0.8,
          rotation: Math.random() * 360,
          isPopped: false
        };
        setNodes(prev => [...prev, newNode]);
      }
    }, 800);
    return () => clearInterval(spawnInterval);
  }, [nodes.length, user.energy]);

  // Movement loop
  useEffect(() => {
    let animationFrameId: number;
    const moveNodes = () => {
      setNodes(prev => {
        const updated = prev
          .map(node => ({ ...node, y: node.y - node.speed }))
          .filter(node => node.y > -20 && !node.isPopped);
        return updated;
      });
      animationFrameId = requestAnimationFrame(moveNodes);
    };
    animationFrameId = requestAnimationFrame(moveNodes);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePopClick = (e: React.MouseEvent | React.TouchEvent, node: DataNode) => {
    e.stopPropagation();
    if (node.isPopped) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const success = onPop(node.reward);
    if (success) {
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, isPopped: true } : n));
      
      const newText = { 
        id: Date.now(), 
        x: clientX, 
        y: clientY, 
        val: `+${(node.reward * user.multiTap).toFixed(2)}` 
      };
      setFloatingTexts(prev => [...prev, newText]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== newText.id)), 800);

      // Logs
      const events = ["PACKET_INTERCEPTED", "NODE_STABILIZED", "DATA_EXTRACTED", "FLUX_HARVESTED"];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLog(prev => [randomEvent, ...prev].slice(0, 5));
    }
  };

  const energyPercentage = (user.energy / user.maxEnergy) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-between relative select-none max-w-lg mx-auto py-4 overflow-hidden">
      
      {/* Network Stats Bar */}
      <div className="w-full flex justify-between px-4 mb-4 z-20">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol Type</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Search className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-tighter">Capture & Intercept</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Intercept Rate</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono font-bold text-blue-400">OPTIMIZED</span>
          </div>
        </div>
      </div>

      {/* Balloon Game Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full relative py-10 overflow-hidden cursor-crosshair z-10"
      >
        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute transition-transform duration-75 active:scale-90"
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) scale(${node.scale}) rotate(${node.rotation}deg)`
            }}
            onMouseDown={(e) => handlePopClick(e, node)}
            onTouchStart={(e) => handlePopClick(e, node)}
          >
            {/* The "Balloon" - A Cyber Data Packet */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-900/40 backdrop-blur-md border-2 border-emerald-500/40 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-neon-node">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-xl pointer-events-none"></div>
              
              <div className="absolute inset-0 bg-emerald-500/5 rounded-xl overflow-hidden opacity-30">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
              </div>
              
              <span className="text-2xl md:text-3xl filter drop-shadow-[0_0_10px_rgba(16,185,129,0.7)] z-10">🛸</span>
              
              {/* Decorative Hex Rings */}
              <div className="absolute -inset-1 border border-emerald-500/30 rounded-xl rotate-45 pointer-events-none"></div>
              <div className="absolute -inset-2 border border-blue-500/20 rounded-xl -rotate-12 pointer-events-none"></div>
              
              {/* Extra Sparkle - Small corner pips */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-emerald-400 rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-400 rounded-full"></div>
            </div>
            
            {/* Floating Value indicator for the node */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[8px] font-black text-emerald-400/80 uppercase tracking-widest font-mono whitespace-nowrap bg-slate-950/80 px-1 rounded">
              PKT_{node.id.toString(16).padStart(4, '0')}
            </div>
          </div>
        ))}

        {/* Live Logs - Cyber Style */}
        <div className="absolute left-4 top-4 hidden md:flex flex-col gap-2 pointer-events-none opacity-40">
           {log.map((l, i) => (
             <div key={i} className="flex items-center gap-2">
                <TerminalIcon className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-mono font-bold text-emerald-500 tracking-tighter uppercase">{l}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Floating Values */}
      {floatingTexts.map(t => (
        <span 
          key={t.id} 
          className="floating-text font-orbitron text-2xl md:text-3xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] z-50" 
          style={{ left: t.x - 20, top: t.y - 40 }}
        >
          {t.val}
        </span>
      ))}

      {/* Energy System Display */}
      <div className="w-full glass rounded-[2rem] p-8 border border-white/5 bg-slate-900/40 relative overflow-hidden group z-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <div 
             className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300"
             style={{ width: `${energyPercentage}%` }}
           ></div>
        </div>

        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
               <Zap className={`w-5 h-5 text-yellow-400 ${user.energy > 0 ? 'animate-pulse' : 'opacity-20'}`} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Neural Charge</span>
              <span className="font-orbitron text-lg font-black text-white">
                {Math.floor(user.energy).toLocaleString()} <span className="text-slate-600 text-sm">/ {user.maxEnergy.toLocaleString()}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">{user.energyRate}/S Recharge</span>
             <div className="flex items-center gap-1 justify-end mt-1">
                <TrendingUp className="w-3 h-3 text-slate-600" />
                <span className="text-[9px] font-bold text-slate-600 uppercase">Multiplier x{user.multiTap}</span>
             </div>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-lime-400 rounded-full transition-all duration-500"
            style={{ width: `${energyPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MiningView;
