'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';
import {
  Microphone,
  MicrophoneSlash,
  Monitor,
  Spinner,
  VideoCamera,
  VideoCameraSlash,
} from 'phosphor-react';
import { Toggle } from '../../../shared/components/layout/ui/toggle';
import { cn } from '../../../utils/cn';

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Parameters<typeof useTrackToggle>[0]['source'];
  pending?: boolean;
};

function getSourceIcon(source: Track.Source, enabled: boolean, pending = false) {
  if (pending) {
    return Spinner;
  }

  switch (source) {
    case Track.Source.Microphone:
      return enabled ? Microphone : MicrophoneSlash;
    case Track.Source.Camera:
      return enabled ? VideoCamera : VideoCameraSlash;
    case Track.Source.ScreenShare:
      return Monitor;
    default:
      return React.Fragment;
  }
}

export function TrackToggle({ source, pressed, pending, className, ...props }: TrackToggleProps) {
  const IconComponent = getSourceIcon(source, pressed ?? false, pending);

  return (
    <Toggle pressed={pressed} aria-label={`Toggle ${source}`} className={cn(className)} {...props}>
      <IconComponent weight="bold" className={cn(pending && 'animate-spin')} />
      {props.children}
    </Toggle>
  );
}
