
import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle2, Loader2, ExternalLink, RefreshCw, PlayCircle } from 'lucide-react';
import { generateWatchTasks } from '../constants';

interface TaskViewProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onRefresh: (newTasks: Task[]) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ tasks, onComplete, onRefresh }) => {
  const [activeTimer, setActiveTimer] = useState<{ id: string; timeLeft: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startVerification = (task: Task) => {
    if (task.completed || activeTimer) return;
    
    // Open the requested link
    window.open(task.link, '_blank');
    
    setActiveTimer({ id: task.id, timeLeft: 5 });
    
    const interval = setInterval(() => {
      setActiveTimer(prev => {
        if (prev && prev.id === task.id && prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        } else {
          clearInterval(interval);
          if (prev && prev.id === task.id) {
            onComplete(task.id);
          }
          return null;
        }
      });
    }, 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Add a slight delay for aesthetic "syncing" feel
    setTimeout(() => {
      onRefresh(generateWatchTasks());
      setIsRefreshing(false);
    }, 800);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-orbitron neon-emerald uppercase tracking-tighter">WATCH TO EARN</h2>
          <p className="text-sm text-slate-400 mt-1 uppercase font-bold tracking-widest text-[10px]">
            {"Continuous stream authorized: "}{completedCount}{"/10 Processed"}
          </p>
        </div>
        <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            {"Rewards < 100 CR"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className={`p-4 glass border rounded-2xl flex items-center justify-between group transition-all duration-300 ${
              task.completed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl glass border ${
                task.completed ? 'border-emerald-500/30' : 'border-white/10'
              }`}>
                {task.completed ? '✅' : <PlayCircle className="w-5 h-5 text-emerald-400 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </div>
              <div>
                <h3 className="font-black text-white text-xs uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                  {task.title}{" #"}{index + 1}
                </h3>
                <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-tighter">
                  {"ESTIMATED YIELD: "}{task.reward}{" CR"}
                </span>
              </div>
            </div>

            {task.completed ? (
              <div className="flex items-center gap-2 text-emerald-400 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[9px] font-black tracking-widest uppercase">HARVESTED</span>
              </div>
            ) : activeTimer?.id === task.id ? (
              <div className="flex items-center gap-2 text-yellow-400 px-3 py-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20 min-w-[100px] justify-center">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[9px] font-black tracking-widest uppercase">{activeTimer.timeLeft}{"S_SYNC"}</span>
              </div>
            ) : (
              <button
                disabled={!!activeTimer}
                onClick={() => startVerification(task)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-xl text-[10px] font-black transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest"
              >
                START <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl glass border border-emerald-400/20 text-emerald-400 hover:bg-emerald-500/10 transition-all group active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          <span className="font-orbitron font-black tracking-[0.25em] text-xs uppercase">RE_SYNC_TASK_STREAM</span>
        </button>
        <p className="text-center text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] mt-4">
          Protocol: Continuous Packet Ingestion • Est. 480 CR/Min
        </p>
      </div>
    </div>
  );
};

export default TaskView;
