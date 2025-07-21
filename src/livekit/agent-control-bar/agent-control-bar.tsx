'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { useTranscriptions } from '@livekit/components-react';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
  onChatOpenChange?: (open: boolean) => void;
  onSendMessage?: (message: string) => Promise<void>;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
  className,
  onSendMessage,
  onChatOpenChange,
  onDisconnect,
  onDeviceError,
  ...props
}: AgentControlBarProps) {
  const [chatOpen] = React.useState(false);
  const transcriptions = useTranscriptions();
  
  // Get the latest agent transcript only
  const latestAgentTranscript = React.useMemo(() => {
    // Look for transcripts that are likely from the agent
    const agentTranscripts = transcriptions.filter((t: any) => {
      const text = t.text.trim();
      const participantIdentity = t.participantInfo?.identity || '';
      
      // Skip empty text
      if (!text) return false;
      
      // Agent typically has identity that doesn't include "user" or is system-generated
      const isLikelyAgent = !participantIdentity.includes('user') && 
                           (participantIdentity.includes('agent') || 
                            participantIdentity.length === 0 ||
                            participantIdentity.startsWith('lk-'));
      
      return isLikelyAgent;
    });
    
    return agentTranscripts[agentTranscripts.length - 1]?.text || '';
  }, [transcriptions]);

  const {
    pushToTalk,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
  });



  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  return (
    <>
      {/* Agent Captions - above control bar */}
      {latestAgentTranscript && !chatOpen && (
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-800 leading-relaxed w-96 mx-auto font-medium">
            {latestAgentTranscript}
          </p>
        </div>
      )}
      
      <div
        aria-label="Voice assistant controls"
        className={cn(
          'bg-background border-bg2 dark:border-separator1 flex flex-col rounded-[31px] border p-3 drop-shadow-md/3',
          className
        )}
        {...props}
      >
      {/* Chat Input - COMMENTED OUT */}
      {/* {capabilities.supportsChatInput && (
        <div
          {...(!chatOpen ? { inert: "" as any } : {})}
          className={cn(
            'overflow-hidden transition-[height] duration-300 ease-out',
            chatOpen ? 'h-[57px]' : 'h-0'
          )}
        >
          <div className="flex h-8 w-full">
            <ChatInput onSend={handleSendMessage} disabled={isInputDisabled} className="w-full" />
          </div>
          <hr className="border-bg2 my-3" />
        </div>
      )} */}

      {/* Main controls row - COMMENTED OUT since all controls are disabled */}
      {/* <div className="flex flex-row justify-between gap-1">
        <div className="flex gap-1">
          [All controls commented out]
        </div>
      </div> */}
      
      {/* Space key indicator - always visible */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {pushToTalk.isPttActive ? (
          <>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-600 dark:text-red-400 font-medium">🎤 Recording - Release SPACE to stop</span>
          </>
        ) : (
          <>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border">SPACE</div>
            <span className="text-gray-600 dark:text-gray-400">Press and hold to talk</span>
          </>
        )}
      </div>
    </div>
    </>
  );
}
