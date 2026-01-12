
import { UserData, Task } from './types';

export const INITIAL_USER: UserData = {
  uid: 'guest-' + Math.random().toString(36).substr(2, 9),
  displayName: 'Neural Miner #001',
  credits: 0,
  energy: 1000,
  maxEnergy: 1000,
  energyRate: 1,
  multiTap: 1,
  cyberDronesLevel: 0,
  referrals: 0,
  referralEarnings: 0,
  walletAddress: '',
  withdrawals: [],
  isAdmin: false,
  isBanned: false,
  joinedAt: Date.now()
};

export const TASK_URL = "https://otieu.com/4/10183879";

export const generateWatchTasks = (): Task[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `task-${Date.now()}-${i}`,
    title: 'Watch to Earn',
    reward: Math.floor(Math.random() * 40) + 30, // 30-70 credits
    link: TASK_URL,
    icon: '💎',
    completed: false
  }));
};

export const TASKS: Task[] = generateWatchTasks();

export const BOOST_PRICES = {
  multiTap: (lvl: number) => Math.floor(500 * Math.pow(1.5, lvl - 1)),
  coreCapacity: (lvl: number) => Math.floor(1000 * Math.pow(1.6, (lvl / 500) - 1)), 
  fluxSpeed: (lvl: number) => Math.floor(2000 * Math.pow(2, lvl - 1)),
  cyberDrones: (lvl: number) => Math.floor(5000 * Math.pow(1.8, lvl))
};
