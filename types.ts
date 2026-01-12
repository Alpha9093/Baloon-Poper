
export interface UserData {
  uid: string;
  displayName: string;
  credits: number;
  energy: number;
  maxEnergy: number;
  energyRate: number; // energy per second
  multiTap: number;
  cyberDronesLevel: number;
  referrals: number;
  referralEarnings: number; // 10% of friends income
  walletAddress: string;
  withdrawals: WithdrawalRequest[];
  isAdmin: boolean;
  isBanned: boolean;
  joinedAt: number;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  address: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: number;
  userId?: string;
  userName?: string;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  link: string;
  icon: string;
  completed: boolean;
}

export enum AppView {
  MINING = 'MINING',
  BOOSTS = 'BOOSTS',
  TASKS = 'TASKS',
  FRIENDS = 'FRIENDS',
  WALLET = 'WALLET',
  ADMIN = 'ADMIN',
  CORE_AI = 'CORE_AI'
}

export interface AdminStats {
  totalCredits: number;
  totalUsers: number;
  pendingWithdrawals: number;
  activeMiners24h: number;
  revenue24h: number;
}
