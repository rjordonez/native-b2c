import type { IELTSScenario } from '../types';

export const IELTS_SCENARIOS: IELTSScenario[] = [
  {
    id: "hobbies-interests",
    icon: "🎨",
    name: "Hobbies and Interests",
    level: "BEGINNER",
    turns: 4,
    greeting: "What do you like to do in your free time?",
    description: "Share personal hobbies and leisure activities - IELTS Part 1 topic",
    instructions: "You are an IELTS examiner asking about hobbies and interests. Encourage detailed explanations about activities and their benefits.",
    conversationScript: [
      {
        turn: 1,
        agent: "What do you like to do in your free time?",
        suggestedResponse: "In my free time, I enjoy reading novels and short stories because they help me relax and improve my vocabulary. I also like playing basketball with my friends on weekends, which keeps me physically active. Recently, I've started learning to play the guitar, which is challenging but very rewarding."
      },
      {
        turn: 2,
        agent: "How long have you been interested in these activities?",
        suggestedResponse: "I've been reading since I was a child, probably for about fifteen years now. Basketball became my passion during high school, so that's been about six years. The guitar is my newest hobby - I just started three months ago when my friend offered to teach me."
      },
      {
        turn: 3,
        agent: "Do you prefer indoor or outdoor activities?",
        suggestedResponse: "I enjoy both indoor and outdoor activities because they offer different benefits. Indoor activities like reading and playing guitar are perfect for relaxing and developing skills quietly. Outdoor activities like basketball and hiking give me fresh air, exercise, and the chance to socialize with others."
      },
      {
        turn: 4,
        agent: "Would you like to try any new hobbies in the future?",
        suggestedResponse: "Yes, I'd love to try photography because I think it would help me see the world from different perspectives. I'm also interested in learning a new language, possibly Spanish or French. Cooking is another hobby I want to develop further to create more delicious and healthy meals."
      }
    ]
  }
];

// Helper function to get scenario by ID
export const getScenarioById = (id: string): IELTSScenario | undefined => {
  return IELTS_SCENARIOS.find(scenario => scenario.id === id);
};

// Helper function to get scenarios by level
export const getScenariosByLevel = (level: IELTSScenario['level']): IELTSScenario[] => {
  return IELTS_SCENARIOS.filter(scenario => scenario.level === level);
};