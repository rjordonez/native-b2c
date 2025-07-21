import { useEffect, useMemo, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '../../shared/components/ui/alert-toast';
import { SessionView } from './components/SessionView';
import { Toaster } from '../../shared/components/ui/sonner';
import { ScenarioDashboard, type Scenario } from '../../livekit/scenario-dashboard';
import useConnectionDetails from '../../shared/hooks/useConnectionDetails';
import type { AppConfig } from './types';
import { APP_CONFIG_DEFAULTS } from './app-config';

const LiveKitPage: React.FC = () => {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const { connectionDetails, refreshConnectionDetails } = useConnectionDetails(selectedScenario);
  const appConfig: AppConfig = APP_CONFIG_DEFAULTS;

  // Auto-start session when connection details are ready and scenario is selected
  useEffect(() => {
    if (connectionDetails && selectedScenario && !sessionStarted) {
      setSessionStarted(true);
    }
  }, [connectionDetails, selectedScenario, sessionStarted]);

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  // Room event handlers
  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };

    const onMediaDevicesError = (error: Error) => {
      toastAlert({
        title: 'Media device error',
        description: `${error.name}: ${error.message}`,
      });
    };

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  // Connect to room when session starts
  useEffect(() => {
    if (sessionStarted && connectionDetails) {
      connectToRoom();
    }
    return () => {
      if (room.state !== 'disconnected') {
        room.disconnect();
      }
    };
  }, [sessionStarted, connectionDetails]);

  const connectToRoom = async () => {
    if (!connectionDetails) return;

    try {
      await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (error) {
      console.error('Connection failed:', error);
      toastAlert({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Show scenario selection if no scenario is selected
  if (!selectedScenario) {
    return (
      <div className="h-full">
        <ScenarioDashboard 
          onScenarioSelect={handleScenarioSelect}
          selectedScenario={selectedScenario}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer />
      <StartAudio label="Start Audio" />

      <SessionView
        appConfig={appConfig}
        disabled={!sessionStarted}
        sessionStarted={sessionStarted}
        selectedScenario={selectedScenario}
      />

      <Toaster />
    </RoomContext.Provider>
  );
};

export default LiveKitPage;