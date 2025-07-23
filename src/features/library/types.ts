export interface Question {
  id: string;
  text: string;
  type: 'part1' | 'part2' | 'part3';
}

export interface Topic {
  id: string;
  title: string;
  part: 'part1' | 'part3';
  progress: number;
  completed: boolean;
  questions: string;
  estimatedTime: string;
  questionsList: Question[];
  expanded: boolean;
}

export interface LibraryState {
  topics: Topic[];
  filters: {
    part: string;
    completed: boolean | null;
  };
  searchQuery: string;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface TopicProgressPayload {
  topicId: string;
  progress: number;
}

export interface FilterUpdatePayload {
  part?: string;
  completed?: boolean | null;
}