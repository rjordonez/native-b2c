export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface HomeState {
  welcomeMessage: string;
  visitCount: number;
  testDate: string; // ISO string
  practiceActivityDates: string[]; // ISO strings
  tasks: Task[];
}