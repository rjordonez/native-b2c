'use client';

import { useState, useCallback, useMemo } from 'react';
import { Gear, PhoneDisconnect, Microphone } from 'phosphor-react';
import { Button } from '../layout/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../layout/ui/card';
import { Track } from 'livekit-client';
import { useMediaDeviceSelect, useMaybeRoomContext } from '@livekit/components-react';
import { cn } from '../../../utils/cn';

interface SettingsDropdownProps {
  onAudioDeviceChange?: (deviceId: string) => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  onDisconnect?: () => void;
}

export function SettingsDropdown({ onAudioDeviceChange, onDeviceError, onDisconnect }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMicList, setShowMicList] = useState(false);
  const room = useMaybeRoomContext();
  
  // Memoize the error handler to prevent re-renders
  const handleError = useCallback((error: Error) => {
    onDeviceError?.({ source: Track.Source.Microphone, error });
  }, [onDeviceError]);
  
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind: 'audioinput',
    room,
    onError: handleError,
  });

  // Memoize the active device to prevent recalculation on every render
  const activeDevice = useMemo(() => 
    devices.find((device: any) => device.deviceId === activeDeviceId),
    [devices, activeDeviceId]
  );

  const handleDisconnect = useCallback(() => {
    onDisconnect?.();
    setIsOpen(false);
  }, [onDisconnect]);

  const handleDeviceSelect = useCallback((deviceId: string) => {
    setActiveMediaDevice(deviceId);
    onAudioDeviceChange?.(deviceId);
    setShowMicList(false);
  }, [setActiveMediaDevice, onAudioDeviceChange]);

  return (
    <div className="relative z-[100]">
      {/* Settings Gear Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Gear clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background pointer-events-auto relative z-[100]"
        aria-label="Settings"
      >
        <Gear 
          weight="bold" 
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isOpen && "rotate-90"
          )} 
        />
      </Button>

      {/* Settings Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Settings Panel */}
          <Card className="absolute top-12 right-0 w-64 z-50 border border-border/50 bg-background/95 backdrop-blur-md" 
                onClick={(e) => e.stopPropagation()}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gear weight="bold" className="h-4 w-4" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wide">
                  Microphone
                </label>
                
                {/* Current Microphone Display */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMicList(!showMicList)}
                  className="w-full text-xs h-8 justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Microphone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate text-xs">
                      {activeDevice?.label || 'Default Microphone'}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs transition-transform flex-shrink-0",
                    showMicList && "rotate-180"
                  )}>
                    ▼
                  </span>
                </Button>
                
                {/* Inline Microphone List */}
                {showMicList && (
                  <div className="mt-1 space-y-1 max-h-32 overflow-y-auto border border-border/50 rounded bg-background/50 p-1">
                    {devices.map((device: any) => (
                      <button
                        key={device.deviceId}
                        onClick={() => handleDeviceSelect(device.deviceId)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded text-xs hover:bg-muted transition-colors truncate",
                          device.deviceId === activeDeviceId && "bg-primary/10 text-primary"
                        )}
                        title={device.label}
                      >
                        {device.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t border-border/50">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDisconnect}
                  className="w-full text-xs h-8"
                >
                  <PhoneDisconnect weight="bold" className="h-3 w-3 mr-1" />
                  End Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}