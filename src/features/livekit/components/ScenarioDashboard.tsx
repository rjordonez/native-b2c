import React, { useState } from 'react';
import { Play, Clock, ChatCircle, BookOpen } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/layout/ui/card';
import { Button } from '../../../shared/components/layout/ui/button';
import { IELTS_SCENARIOS, getScenariosByLevel } from '../constants/scenarios';
import type { IELTSScenario } from '../types';

interface ScenarioDashboardProps {
  onScenarioSelect?: (scenario: IELTSScenario) => void;
}

const ScenarioDashboard: React.FC<ScenarioDashboardProps> = ({ onScenarioSelect }) => {
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | IELTSScenario['level']>('ALL');
  const [selectedScenario, setSelectedScenario] = useState<IELTSScenario | null>(null);

  const filteredScenarios = selectedLevel === 'ALL' 
    ? IELTS_SCENARIOS 
    : getScenariosByLevel(selectedLevel);

  const handleScenarioClick = (scenario: IELTSScenario) => {
    setSelectedScenario(scenario);
  };

  const handleStartSession = () => {
    if (selectedScenario && onScenarioSelect) {
      onScenarioSelect(selectedScenario);
    }
  };

  const getLevelColor = (level: IELTSScenario['level']) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-700';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-700';
      case 'ADVANCED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">IELTS Speaking Practice</h1>
        <p className="text-gray-600">Choose a scenario to practice your speaking skills with our AI examiner</p>
      </div>

      {/* Level Filter */}
      <div className="flex gap-3 flex-wrap">
        {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {level === 'ALL' ? 'All Levels' : level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black">Available Scenarios</h2>
          
          {filteredScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedScenario?.id === scenario.id 
                  ? 'ring-2 ring-blue-500 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleScenarioClick(scenario)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(scenario.level)}`}>
                        {scenario.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{scenario.turns} turns</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChatCircle size={14} />
                        <span>Speaking Practice</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredScenarios.length === 0 && (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No scenarios found for the selected level</p>
            </div>
          )}
        </div>

        {/* Scenario Details */}
        <div className="lg:sticky lg:top-4">
          {selectedScenario ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{selectedScenario.icon}</span>
                  <div>
                    <h3 className="text-lg">{selectedScenario.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedScenario.level)}`}>
                      {selectedScenario.level}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Opening Question</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    "{selectedScenario.greeting}"
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                  <p className="text-sm text-gray-600">{selectedScenario.instructions}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Conversation Flow</h4>
                  <div className="space-y-2">
                    {selectedScenario.conversationScript.map((turn, index) => (
                      <div key={turn.turn} className="text-xs">
                        <div className="font-medium text-gray-800">
                          Turn {turn.turn}: {turn.agent}
                        </div>
                        <div className="text-gray-600 ml-4 mt-1">
                          Sample: "{turn.suggestedResponse.substring(0, 100)}..."
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleStartSession}
                  className="w-full"
                  size="lg"
                >
                  <Play size={16} className="mr-2" />
                  Start Practice Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Scenario</h3>
                <p className="text-sm text-gray-600">
                  Choose a scenario from the list to see details and start practicing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioDashboard;