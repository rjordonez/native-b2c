import { useCallback, useEffect, useState } from 'react';
import { ConnectionDetails } from '@/components/server/index';
import type { Scenario } from '@/components/scenario-dashboard';

export default function useConnectionDetails(selectedScenario?: Scenario) {
  // Generate room connection details, including:
  //   - A random Room name
  //   - A random Participant name
  //   - An Access Token to permit the participant to join the room
  //   - The URL of the LiveKit server to connect to
  //
  // In real-world application, you would likely allow the user to specify their
  // own participant name, and possibly to choose from existing rooms to join.

  // Use scenario greeting or fallback to custom greeting
  const CUSTOM_GREETING = selectedScenario?.greeting || "Hi I am jeffry";

  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  const fetchConnectionDetails = useCallback(() => {
    setConnectionDetails(null);
    const baseUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:3001';
    const endpoint = import.meta.env.VITE_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';
    const url = new URL(endpoint, baseUrl);
    url.searchParams.set('greeting', CUSTOM_GREETING);
    if (selectedScenario) {
      console.log('🔍 Fetching connection details with scenario:', selectedScenario.id);
      url.searchParams.set('scenario', selectedScenario.id);
      url.searchParams.set('instructions', selectedScenario.instructions);
      // Send the full conversation script for agent to follow
      url.searchParams.set('conversationScript', JSON.stringify(selectedScenario.conversationScript));
      url.searchParams.set('scenarioLevel', selectedScenario.level);
      url.searchParams.set('scenarioTurns', selectedScenario.turns.toString());
    } else {
      console.log('🔍 Fetching connection details WITHOUT scenario');
    }
    fetch(url.toString())
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Backend API not available - received HTML instead of JSON');
        }
        
        return res.json();
      })
      .then((data) => {
        console.log('✅ Connection details received:', data);
        setConnectionDetails(data);
      })
      .catch((error) => {
        // Suppress console error if backend is not available (common in dev)
        if (error.message.includes('SyntaxError') || 
            error.message.includes('HTTP 404') ||
            error.message.includes('Backend API not available') ||
            error.message.includes('Unexpected token')) {
          console.warn('Backend API not available - this is expected when running frontend only');
        } else {
          console.error('Error fetching connection details:', error);
        }
      });
  }, [CUSTOM_GREETING, selectedScenario]);

  useEffect(() => {
    // Only fetch connection details if we have a scenario
    if (selectedScenario) {
      fetchConnectionDetails();
    }
  }, [fetchConnectionDetails, selectedScenario]);

  return { connectionDetails, refreshConnectionDetails: fetchConnectionDetails };
}
