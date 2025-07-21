'use client';

import React, { useEffect, useState, forwardRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '../../../shared/components/ui/alert-toast';
import { AgentControlBar } from '../../../livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '../../../livekit/chat/chat-entry';
import { ChatMessageView } from '../../../livekit/chat/chat-message-view';
import { MediaTiles } from '../../../livekit/media-tiles';
import useChatAndTranscription from '../../../shared/hooks/useChatAndTranscription';
import { useDebugMode } from '../../../shared/hooks/useDebug';
import type { AppConfig } from '../types';
import { cn } from '../../../utils/cn';
import { ConversationProgress } from '../../../livekit/conversation-progress';
import { SettingsDropdown } from '../../../shared/components/ui/settings-dropdown';
import type { IELTSScenario } from '../types';
import { useAgentControlBar } from '../../../livekit/agent-control-bar/hooks/use-agent-control-bar';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
  selectedScenario?: IELTSScenario;
  assignmentId?: string;
  onConversationCompleted?: () => void;
}

export const SessionView = forwardRef<HTMLElement, SessionViewProps>(({
  appConfig,
  disabled,
  sessionStarted,
  selectedScenario,
  assignmentId,
  onConversationCompleted,
}, ref) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const [scriptAwareTurns, setScriptAwareTurns] = useState<number>(0);
  const [completionTracked, setCompletionTracked] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  const { pushToTalk } = useAgentControlBar();

  useDebugMode();

  // Helper function to track assignment completion
  const trackAssignmentCompletion = async (reason: string) => {
    if (assignmentId && selectedScenario && !completionTracked) {
      console.log(`🎯 ${reason} - Tracking assignment completion...`);
      try {
        // You can implement completion tracking here
        console.log(`✅ Assignment completion tracked (${reason})`);
        setCompletionTracked(true);
        onConversationCompleted?.();
      } catch (error) {
        console.error(`❌ Error tracking completion (${reason}):`, error);
      }
    }
  };

  async function handleSendMessage(message: string) {
    await send(message);
  }

  const handleSuggestedResponse = async (response: string) => {
    await handleSendMessage(response);
  }

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: (
              <p className="w-full">
                {reason}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="whitespace-nowrap underline"
                >
                  See quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 100_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  // Handle edge case: agent connected but hasn't triggered greeting
  useEffect(() => {
    if (sessionStarted && selectedScenario) {
      const greetingTimeout = setTimeout(() => {
        // Check if agent is available but no messages yet (hasn't spoken greeting)
        if (isAgentAvailable(agentState) && messages.length === 0) {
          console.log('🔄 Agent connected but no greeting detected, reconnecting...');
          
          toastAlert({
            title: 'Reconnecting...',
            description: 'Agent connection issue detected, attempting to reconnect.',
          });
          
          // Trigger reconnection by disconnecting and letting app.tsx handle reconnection
          room.disconnect();
        }
      }, 15_000); // Check after 15 seconds - enough time for agent to trigger greeting

      return () => clearTimeout(greetingTimeout);
    }
  }, [agentState, sessionStarted, selectedScenario, messages.length, room]);

  // Auto-end conversation when we reach the final turn (or beyond)
  useEffect(() => {
    if (selectedScenario && scriptAwareTurns >= selectedScenario.turns && !completionTracked) {
      console.log(`🎯 Conversation completed! Reached turn ${scriptAwareTurns}/${selectedScenario.turns}, ending call...`);
      
      // Track assignment completion
      trackAssignmentCompletion("Final turn reached");
      
      // Disconnect immediately after completion
      if (room.state === 'connected') {
        console.log(`🔚 Disconnecting from room after conversation completion`);
        toastAlert({
          title: 'Conversation Completed!',
          description: `Great job completing ${selectedScenario.name}!`,
        });
        room.disconnect();
      }
    }
    
    // Also track completion if we've gone significantly beyond expected turns
    if (selectedScenario && scriptAwareTurns > selectedScenario.turns + 2 && !completionTracked) {
      console.log(`🎯 Conversation went beyond expected turns (${scriptAwareTurns}/${selectedScenario.turns}), marking as complete anyway...`);
      trackAssignmentCompletion("Exceeded expected turns");
    }
  }, [scriptAwareTurns, selectedScenario, room, completionTracked, trackAssignmentCompletion]);

  // Track completion when user disconnects if they've done enough turns
  useEffect(() => {
    const handleDisconnect = () => {
      // If user has done at least 70% of expected turns, mark as complete
      if (selectedScenario && scriptAwareTurns >= Math.ceil(selectedScenario.turns * 0.7) && !completionTracked) {
        console.log(`🎯 User disconnected after ${scriptAwareTurns}/${selectedScenario.turns} turns, marking as complete...`);
        trackAssignmentCompletion("User disconnected with sufficient progress");
      }
    };

    room.on('disconnected', handleDisconnect);
    return () => {
      room.off('disconnected', handleDisconnect);
    };
  }, [room, selectedScenario, scriptAwareTurns, completionTracked, trackAssignmentCompletion]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  return (
    <>
      {/* Settings Gear - OUTSIDE main container to avoid z-index issues */}
      <div className="fixed top-4 right-4 z-[9999]">
        <SettingsDropdown 
          onDisconnect={() => room.disconnect()}
        />
      </div>

      <main
        ref={ref}
        {...(disabled ? { inert: "" as any } : {})}
        className={
          // prevent page scrollbar
          // when !chatOpen due to 'translate-y-20'
          cn(!chatOpen && 'max-h-svh overflow-y-hidden overflow-x-visible')
        }
      >
      <ChatMessageView
        className={cn(
          'mx-auto min-h-svh w-full max-w-2xl px-3 pt-32 pb-40 transition-[opacity,translate] duration-300 ease-out md:px-0 md:pt-36 md:pb-48',
          chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-20 opacity-0'
        )}
      >
        <div className="space-y-3 whitespace-pre-wrap">
          <AnimatePresence>
            {messages.map((message: ReceivedChatMessage) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 1, height: 'auto', translateY: 0.001 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <ChatEntry hideName key={message.id} entry={message} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ChatMessageView>

      <div className="bg-background mp-12 fixed top-0 right-0 left-0 h-32 md:h-36">
        {/* Room name display */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white/80">
            Room: {room.name || 'Connecting...'} | State: {room.state}
          </div>
        </div>
        
        {/* Conversation Progress in header */}
        {selectedScenario && sessionStarted && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <ConversationProgress 
              scenario={selectedScenario} 
              scriptAwareTurns={scriptAwareTurns}
            />
          </div>
        )}
        
        
        {/* skrim */}
        <div className="from-background absolute bottom-0 left-0 h-12 w-full translate-y-full bg-gradient-to-b to-transparent" />
      </div>

      <MediaTiles 
        chatOpen={chatOpen} 
        selectedScenario={selectedScenario}
        sessionStarted={sessionStarted}
        onResponseSelect={handleSuggestedResponse}
        onTurnChange={setScriptAwareTurns}
        isPttActive={pushToTalk.isPttActive}
      />

      <div className="bg-background fixed right-0 bottom-0 left-0 z-50 px-3 pt-2 pb-3 md:px-12 md:pb-12">
        <motion.div
          key="control-bar"
          initial={{ opacity: 0, translateY: '100%' }}
          animate={{
            opacity: sessionStarted ? 1 : 0,
            translateY: sessionStarted ? '0%' : '100%',
          }}
          transition={{ duration: 0.3, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
        >
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            {appConfig.isPreConnectBufferEnabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: sessionStarted && messages.length === 0 ? 1 : 0,
                  transition: {
                    ease: 'easeIn',
                    delay: messages.length > 0 ? 0 : 0.8,
                    duration: messages.length > 0 ? 0.2 : 0.5,
                  },
                }}
                aria-hidden={messages.length > 0}
                className={cn(
                  'absolute inset-x-0 -top-12 text-center',
                  sessionStarted && messages.length === 0 && 'pointer-events-none'
                )}
              >
                <p className="animate-text-shimmer inline-block !bg-clip-text text-sm font-semibold text-transparent">
                  Agent is listening, ask it a question
                </p>
              </motion.div>
            )}

            <AgentControlBar
              capabilities={capabilities}
              onChatOpenChange={setChatOpen}
              onSendMessage={handleSendMessage}
            />
          </div>
          {/* skrim */}
          <div className="from-background border-background absolute top-0 left-0 h-12 w-full -translate-y-full bg-gradient-to-t to-transparent z-10" />
        </motion.div>
      </div>
    </main>
    </>
  );
});

SessionView.displayName = 'SessionView';