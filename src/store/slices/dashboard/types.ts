export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface PracticeActivity {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
}

export interface PracticeStreak {
  current: number;
  longest: number;
  totalDays: number;
  lastPracticeDate: string | null;
}

export interface HomeState {
  welcomeMessage: string;
  visitCount: number;
  testDate: string; // ISO string
  practiceActivityDates: string[]; // ISO strings (legacy - to be removed)
  tasks: Task[];
  // New practice activity data
  practiceActivities: PracticeActivity[];
  practiceStreak: PracticeStreak | null;
  isLoadingActivities: boolean;
}