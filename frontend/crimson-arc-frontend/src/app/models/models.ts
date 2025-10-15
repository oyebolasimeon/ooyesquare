export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  token: string;
}

export interface Voter extends User {
  phoneNumber: string;
  maidenName?: string;
  hasVoted: boolean;
  votedCategories: {
    national: boolean;
    state: boolean;
  };
  status: string;
}

export interface Admin extends User {
  role: string;
}

export interface Position {
  _id: string;
  title: string;
  description?: string;
  category: 'National' | 'State';
  state?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contestant {
  _id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  position: string | Position;
  photo?: string;
  bio?: string;
  order: number;
  isActive: boolean;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteSubmission {
  positionId: string;
  contestantId: string | null;
}

export interface ElectionSettings {
  _id: string;
  category: 'National' | 'State';
  state?: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'ongoing' | 'ended';
  isActive: boolean;
}

export interface Result {
  position: {
    _id: string;
    title: string;
    category: string;
    state?: string;
  };
  contestants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    maidenName?: string;
    voteCount: number;
    percentage: string;
  }>;
  totalVotes: number;
  abstentions: number;
  winner?: {
    _id: string;
    firstName: string;
    lastName: string;
    maidenName?: string;
    voteCount: number;
  };
}

export interface Analytics {
  voters: {
    total: number;
    active: number;
    voted: number;
    notVoted: number;
    votingPercentage: string;
  };
  votes: {
    total: number;
    national: number;
    state: number;
  };
  positions: {
    total: number;
    national: number;
    state: number;
  };
  contestants: {
    total: number;
  };
  recentVotes: any[];
}

