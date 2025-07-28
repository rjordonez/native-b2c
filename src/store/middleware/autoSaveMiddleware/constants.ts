// Actions that trigger saves
export const SAVE_ACTIONS = [
  'chat/addUserMessage',
  'chat/addMessage',
  'chat/createConversation/fulfilled',
  'chat/updateConversationTitle',
  'chat/deleteConversation',
  // Legacy action names (for backward compatibility)
  'conversation/addUserMessage',
  'conversation/addMessage',
  'conversation/createConversation/fulfilled',
  'conversation/updateConversationTitle',
  'conversation/deleteConversation',
  // Topic practice actions
  'chat/startTopicPractice/fulfilled',
  'chat/redoTopicQuestion/fulfilled',
  'chat/getNextTopicQuestion/fulfilled',
  'topicPractice/startTopicPractice/fulfilled',
  'topicPractice/redoTopicQuestion/fulfilled',
  'topicPractice/getNextTopicQuestion/fulfilled',
  // Transcription and pronunciation actions
  'conversation/updateMessage',
  'chat/updateMessage',
  'voiceRecording/processTranscription/fulfilled',
  'voiceRecording/analyzePronunciation/fulfilled',
  // Enhanced transcript action
  'topicPractice/enhanceTranscript/fulfilled',
];