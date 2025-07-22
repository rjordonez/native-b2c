export interface Topic {
  id: string;
  title: string;
  category: 'speaking' | 'writing' | 'reading' | 'listening';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  completed: boolean;
  description: string;
  estimatedTime: string;
}

export interface LibraryState {
  topics: Topic[];
  filters: {
    category: string;
    difficulty: string;
    completed: boolean | null;
  };
  searchQuery: string;
}

export interface TopicProgressPayload {
  topicId: string;
  progress: number;
}

export interface FilterUpdatePayload {
  category?: string;
  difficulty?: string;
  completed?: boolean | null;
}