export interface DashboardState {
  stats: {
    totalUsers: number;
    totalRevenue: number;
    activeProjects: number;
  };
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'user' | 'project' | 'revenue';
  message: string;
  timestamp: string;
}