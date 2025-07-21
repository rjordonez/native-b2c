import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface AgentAudioTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
}

export const AgentTile = forwardRef<HTMLDivElement, AgentAudioTileProps>(({
  state,
  audioTrack,
  className,
}, ref) => {
  // const transcriptions = useTranscriptions();
  
  // Get the latest agent transcript only
  // const latestAgentTranscript = useMemo(() => {
  //   // Look for transcripts that are likely from the agent
  //   // Agents usually have different participant identity patterns
  //   const agentTranscripts = transcriptions.filter(t => {
  //     const text = t.text.trim();
  //     const participantIdentity = t.participantInfo?.identity || '';
  //     
  //     // Skip empty text
  //     if (!text) return false;
  //     
  //     // Agent typically has identity that doesn't include "user" or is system-generated
  //     const isLikelyAgent = !participantIdentity.includes('user') && 
  //                          (participantIdentity.includes('agent') || 
  //                           participantIdentity.length === 0 ||
  //                           participantIdentity.startsWith('lk-'));
  //     
  //     return isLikelyAgent;
  //   });
  //   
  //   return agentTranscripts[agentTranscripts.length - 1]?.text || '';
  // }, [transcriptions]);


  return (
    <div ref={ref} className={cn('flex flex-col items-center', className)}>
      {/* Bar Visualizer */}
      <BarVisualizer
        barCount={5}
        state={state}
        options={{ minHeight: 5 }}
        trackRef={audioTrack}
        className={cn('flex aspect-video w-40 items-center justify-center gap-1 mb-4')}
      >
        <span
          className={cn([
            'bg-muted min-h-4 w-4 rounded-full',
            'origin-center transition-colors duration-250 ease-linear',
            'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
          ])}
        />
      </BarVisualizer>
      
    </div>
  );
});
