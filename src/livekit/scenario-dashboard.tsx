import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../shared/components/layout/ui/card';
import { Button } from '../shared/components/layout/ui/button';
import { Badge } from '../shared/components/layout/ui/badge';

export interface ConversationTurn {
  turn: number;
  agent: string;
  suggestedResponse?: string;
}

export interface Scenario {
  id: string;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  greeting: string;
  instructions: string;
  turns: number;
  icon: string;
  conversationScript: ConversationTurn[];
}

// Single scenario for testing
export const scenarios: Scenario[] = [
  {
    id: 'coffee-corner',
    name: 'Coffee Corner',
    level: 'BEGINNER',
    description: 'Practice ordering coffee with guided prompts and suggestions',
    greeting: 'Hi! Welcome to Coffee Corner. What can I get for you today?',
    instructions: 'You are a friendly coffee shop barista. Follow the exact script for guided practice. Guide the customer through ordering coffee step by step.',
    turns: 5,
    icon: '☕',
    conversationScript: [
      {
        turn: 1,
        agent: 'Hi! Welcome to Coffee Corner. What can I get for you today?',
        suggestedResponse: 'I want a coffee, please'
      },
      {
        turn: 2,
        agent: 'Great! What size would you like - small, medium, or large?',
        suggestedResponse: 'Medium, please'
      },
      {
        turn: 3,
        agent: 'Perfect! Would you like anything else? We have muffins and sandwiches.',
        suggestedResponse: 'How much is a muffin?'
      },
      {
        turn: 4,
        agent: 'The blueberry muffin is $3 and the chocolate chip is $3.50.',
        suggestedResponse: 'I\'ll take the blueberry muffin'
      },
      {
        turn: 5,
        agent: 'Excellent! That\'s one medium coffee and one blueberry muffin. That\'ll be $8.50 total.',
        suggestedResponse: 'Here you go'
      }
    ]
  }
];

interface ScenarioDashboardProps {
  onScenarioSelect: (scenario: Scenario) => void;
  selectedScenario?: Scenario;
}

export function ScenarioDashboard({ onScenarioSelect, selectedScenario }: ScenarioDashboardProps) {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  
  // Auto-select the single scenario on component mount
  const scenario = scenarios[0];
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          Conversation Practice
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Practice your English conversation skills with AI guidance and real-time feedback
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
            selectedScenario?.id === scenario.id 
              ? 'ring-2 ring-primary ring-offset-2 shadow-xl border-primary/30 bg-primary/5' 
              : 'hover:shadow-lg hover:border-primary/20 border-border'
          } ${
            hoveredScenario === scenario.id ? 'scale-[1.02] -translate-y-1' : ''
          }`}
          onMouseEnter={() => setHoveredScenario(scenario.id)}
          onMouseLeave={() => setHoveredScenario(null)}
          onClick={() => onScenarioSelect(scenario)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {scenario.icon}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {scenario.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getLevelColor(scenario.level)} variant="secondary">
                      {scenario.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-medium">
                      ~{scenario.turns} turns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <CardDescription className="text-base leading-relaxed">
              {scenario.description}
            </CardDescription>
            
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Opening line:
              </p>
              <p className="text-sm text-foreground italic leading-relaxed">
                "{scenario.greeting}"
              </p>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              variant="default"
              onClick={(e) => { e.stopPropagation(); onScenarioSelect(scenario); }}
            >
              Start Conversation
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedScenario && (
        <Card className="mt-8 border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Badge variant="default" className="text-sm px-3 py-1">
                Ready to Start
              </Badge>
              <span className="text-lg">{selectedScenario.icon}</span>
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">
              {selectedScenario.name}
            </h3>
            <p className="text-muted-foreground">
              Voice practice session will begin automatically when you're connected.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}