import React, { useState } from 'react';
import ScenarioDashboard from './components/ScenarioDashboard';
import type { IELTSScenario } from './types';

const LiveKitPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<IELTSScenario | null>(null);

  const handleScenarioSelect = (scenario: IELTSScenario) => {
    console.log('🎭 Selected scenario:', scenario);
    setActiveScenario(scenario);
    
    // Here you could integrate with your LiveKit connection
    // For now, we'll just log the scenario selection
    console.log('Starting LiveKit session with scenario:', {
      scenarioId: scenario.id,
      greeting: scenario.greeting,
      turns: scenario.turns,
      conversationScript: scenario.conversationScript
    });
    
    // You could call your backend endpoint here:
    // const connectionDetails = await fetch(`http://localhost:3001/api/connection-details?${new URLSearchParams({
    //   greeting: scenario.greeting,
    //   scenario: scenario.id,
    //   scenarioLevel: scenario.level,
    //   scenarioTurns: scenario.turns.toString(),
    //   conversationScript: JSON.stringify(scenario.conversationScript)
    // })}`);
  };

  const handleBackToDashboard = () => {
    setActiveScenario(null);
  };

  return (
    <div className="h-full">
      {!activeScenario ? (
        <ScenarioDashboard onScenarioSelect={handleScenarioSelect} />
      ) : (
        <div className="space-y-6">
          {/* Practice Session View - Placeholder for now */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeScenario.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-black">{activeScenario.name}</h2>
                  <p className="text-sm text-gray-600">{activeScenario.level} Level</p>
                </div>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{activeScenario.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Session Ready</h3>
              <p className="text-gray-600 mb-6">
                Ready to practice "{activeScenario.name}" scenario
              </p>
              <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  <strong>Opening question:</strong> "{activeScenario.greeting}"
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                LiveKit integration would be implemented here to start the voice session
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveKitPage;