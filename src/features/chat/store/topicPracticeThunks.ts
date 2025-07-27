// Re-export all thunks from the new modular structure
export {
  startTopicPractice,
  redoTopicQuestion,
  getNextTopicQuestion,
  enhanceTranscript,
  handleTopicPracticeCompletion,
  type TopicPractice,
  type StartTopicPracticeResult,
  type TopicQuestionResult,
  type NextQuestionResult,
  type EnhanceTranscriptResult
} from './topicPracticeThunks/index';