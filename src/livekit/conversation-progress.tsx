import { type AgentState, useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Scenario } from '../scenario-dashboard';


interface ConversationProgressProps {
  className?: string;
  scenario?: Scenario;
  scriptAwareTurns?: number; // For BEGINNER scenarios, sync with SuggestedResponses turn count
}

export function ConversationProgress({ className, scenario, scriptAwareTurns }: ConversationProgressProps) {
  const { state } = useVoiceAssistant();
  const [conversationTurns, setConversationTurns] = useState(0);
  const [lastState, setLastState] = useState<AgentState>('disconnected');
  const [animatingTurn, setAnimatingTurn] = useState<number | null>(null);
  
  // Use scenario turns or default to 10
  const maxTurns = scenario?.turns || 10;
  
  // Debug render (commented out to reduce log noise during session end)
  // console.log('🎨 ConversationProgress render: state=', state, 'turns=', conversationTurns);
  

  useEffect(() => {
    console.log('🔄 ConversationProgress: state changed from', lastState, 'to', state);
    
      // For BEGINNER scenarios, sync with scriptAwareTurns from SuggestedResponses
    if (scenario?.level === 'BEGINNER' && scriptAwareTurns !== undefined && scriptAwareTurns !== conversationTurns) {
      console.log('🔄 ConversationProgress: Syncing with SuggestedResponses turns:', scriptAwareTurns);
      setConversationTurns(scriptAwareTurns);
      setAnimatingTurn(scriptAwareTurns - 1);
      setTimeout(() => setAnimatingTurn(null), 600);
    }
    // For non-BEGINNER scenarios, use simple turn counting
    else if (scenario?.level !== 'BEGINNER' && state === 'thinking' && lastState === 'listening') {
      const newTurn = Math.min(conversationTurns + 1, maxTurns);
      if (newTurn > conversationTurns) {
        console.log('🎯 ConversationProgress: Basic turn advancement:', newTurn);
        setAnimatingTurn(newTurn - 1);
        setConversationTurns(newTurn);
        
        setTimeout(() => setAnimatingTurn(null), 600);
      }
    }
    
    setLastState(state);
  }, [state, lastState, conversationTurns, maxTurns, scriptAwareTurns, scenario]);

  // Reset conversation turns when scenario changes
  useEffect(() => {
    setConversationTurns(0);
    setAnimatingTurn(null);
  }, [scenario]);
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {Array.from({ length: maxTurns }, (_, i) => {
        const isFilled = i < conversationTurns;
        const isAnimating = animatingTurn === i;
        
        return (
          <div key={i} className="flex items-center">
            <div 
              className={cn([
                'h-4 w-4 rounded-full transition-all duration-500 ease-out border-2',
                isFilled 
                  ? 'bg-primary border-primary shadow-sm shadow-primary/50' 
                  : 'bg-muted border-border'
              ])} 
            />
            {i < maxTurns - 1 && (
              <div 
                className={cn([
                  'h-1 w-4 relative overflow-hidden bg-muted rounded-full'
                ])}
              >
                <div
                  className={cn([
                    'h-full bg-primary transition-all duration-500 ease-out rounded-full',
                    isFilled ? 'w-full' : 'w-0'
                  ])}
                  style={{
                    transitionDelay: isAnimating ? '100ms' : '0ms'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}