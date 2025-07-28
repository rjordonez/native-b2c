// Helper function to transform topic practice state for database
export function transformTopicPracticeForDB(topicPracticeState: any) {
  if (!topicPracticeState || !topicPracticeState.currentTopic) {
    return undefined;
  }
  
  return {
    currentTopic: {
      id: topicPracticeState.currentTopic.id || `topic-${Date.now()}`,
      title: topicPracticeState.currentTopic.title || topicPracticeState.currentTopic.name || 'Unknown Topic',
      description: topicPracticeState.currentTopic.description,
    },
    currentQuestionIndex: topicPracticeState.currentQuestionIndex || 0,
    questions: (topicPracticeState.questions || []).map((q: any, index: number) => ({
      id: q.id || `question-${index}`,
      text: q.text || q,
      order: q.order ?? index,
    })),
  };
}