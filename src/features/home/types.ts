export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface SpeakingPractice {
  type: string;
  time: string;
  difficulty: string;
}

export interface SpeakingTest {
  type: string;
  time: string;
  difficulty: string;
}

export interface HomeState {
  welcomeMessage: string;
  visitCount: number;
  testDate: string; // ISO string
  practiceActivityDates: string[]; // ISO strings
  tasks: Task[];
  speakingPractices: SpeakingPractice[];
  speakingTests: SpeakingTest[];
}