import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceAssistant, useTranscriptions, useRoomContext, type AgentState } from '@livekit/components-react';
import { Button } from '../shared/components/layout/ui/button';
import { Card, CardContent } from '../shared/components/layout/ui/card';
import type { Scenario } from './scenario-dashboard';

interface SuggestedResponsesProps {
  scenario?: Scenario;
  onResponseSelect: (response: string) => void;
  disabled?: boolean;
  onTurnChange?: (turns: number) => void; // Callback to notify parent of turn changes
  agentState?: AgentState;
  isPttActive?: boolean; // Whether user is actively holding space to talk
}

export function SuggestedResponses({ 
  scenario, 
  onResponseSelect, 
  disabled,
  onTurnChange,
  agentState,
  isPttActive 
}: SuggestedResponsesProps) {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [lastEvaluatedTranscript, setLastEvaluatedTranscript] = useState<string>('');
  const [isHidden, setIsHidden] = useState(false);
  const [lastAgentState, setLastAgentState] = useState<AgentState>('disconnected');
  const [wasActivelySpeaking, setWasActivelySpeaking] = useState(false);
  const { state } = useVoiceAssistant();
  const transcriptions = useTranscriptions();
  const room = useRoomContext();

  // Get latest user transcription
  const latestUserTranscript = transcriptions
    .filter((t: any) => {
      const participantIdentity = t.participantInfo?.identity || '';
      return participantIdentity.includes('user') && t.text.trim();
    })
    .slice(-1)[0]?.text || '';

  // Debug transcriptions
  console.log('🔍 All transcriptions:', transcriptions);
  console.log('🔍 Latest user transcript:', latestUserTranscript);

  // Track agent state changes to show/hide component
  useEffect(() => {
    const currentAgentState = agentState || state;
    
    // Show component again when agent stops speaking (goes from speaking to listening/thinking)
    if (lastAgentState === 'speaking' && (currentAgentState === 'listening' || currentAgentState === 'thinking')) {
      console.log('🎭 Agent stopped speaking, showing suggestions again');
      setIsHidden(false);
    }
    
    setLastAgentState(currentAgentState);
  }, [agentState, state, lastAgentState]);

  // Listen for turn advancement messages from agent
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === 'turn_advancement' && typeof data.turn === 'number') {
          console.log('🔔 SuggestedResponses: Received turn advancement from agent:', data.turn);
          
          // Hide component briefly when turn advances (AI accepted response)
          setIsHidden(true);
          
          // Show component again for new turn after brief delay
          setTimeout(() => {
            setCurrentTurn(data.turn);
            setLastEvaluatedTranscript('');
            setWasActivelySpeaking(false);
            setIsHidden(false);
            console.log('🔄 Showing component for new turn');
          }, 500);
          
          // Notify parent of turn advancement for progress tracking
          onTurnChange?.(data.turn - 1); // ConversationProgress expects 0-based turn count
        }
      } catch (e) {
        // Ignore non-JSON data messages
      }
    };

    room.on('dataReceived', handleDataReceived);
    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room, onTurnChange]);

  // Track when user starts/stops speaking (push-to-talk)
  useEffect(() => {
    if (isPttActive && !wasActivelySpeaking) {
      // User just started speaking - show component
      console.log('🎤 User started speaking');
      setIsHidden(false);
      setWasActivelySpeaking(true);
    } else if (!isPttActive && wasActivelySpeaking) {
      // User just stopped speaking
      console.log('🎤 User stopped speaking');
      setWasActivelySpeaking(false);
    }
  }, [isPttActive, wasActivelySpeaking]);

  // Let the AI agent be the sole decision maker for script adherence
  // Keep component visible unless AI explicitly advances turn
  useEffect(() => {
    if (!latestUserTranscript || !scenario || latestUserTranscript === lastEvaluatedTranscript) return;
    
    // Don't evaluate while user is actively speaking (holding space)
    if (isPttActive || wasActivelySpeaking) {
      console.log('🎤 User is speaking, keeping component visible');
      return;
    }
    
    // Mark this transcription as evaluated but don't hide - let AI decide by advancing turn
    setLastEvaluatedTranscript(latestUserTranscript);
    console.log('✅ User finished speaking, waiting for AI decision');
    
  }, [latestUserTranscript, scenario?.conversationScript, currentTurn, lastEvaluatedTranscript, isPttActive, wasActivelySpeaking]);

  // Reset turn when scenario changes
  useEffect(() => {
    setCurrentTurn(1);
    setSelectedResponse(null);
    setIsHidden(false);
    setLastEvaluatedTranscript('');
    setWasActivelySpeaking(false);
  }, [scenario]);

  if (!scenario) {
    return null;
  }

  // Only show for BEGINNER (all turns) or INTERMEDIATE (turn 1 only)
  if (scenario.level === 'ADVANCED') {
    return null;
  }

  // For INTERMEDIATE, only show on turn 1
  if (scenario.level === 'INTERMEDIATE' && currentTurn > 1) {
    return null;
  }

  const currentScript = scenario.conversationScript.find(script => script.turn === currentTurn);
  const suggestedResponse = currentScript?.suggestedResponse;

  if (!suggestedResponse || currentTurn > scenario.turns || isHidden) {
    return null;
  }

  const handleResponseClick = (response: string) => {
    setSelectedResponse(response);
    onResponseSelect(response);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-w-80 max-w-2xl"
      >
        <div className="min-w-80 max-w-2xl">
          <Card className="backdrop-blur-sm border-2 transition-all duration-300 border-primary/20 bg-background/95 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Say:
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponseClick(suggestedResponse)}
                  disabled={disabled}
                  className={`min-w-80 max-w-2xl whitespace-normal text-left justify-start h-auto p-3 text-sm font-medium transition-all hover:scale-[1.02] ${
                    selectedResponse === suggestedResponse 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : ''
                  }`}
                >
                  <span className="text-foreground">"{suggestedResponse}"</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}