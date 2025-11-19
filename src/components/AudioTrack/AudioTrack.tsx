import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';
import RemoteAudio from './RemoteAudio';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const { activeSinkId } = useAppState();
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = track.attach() as HTMLAudioElement;
    audioEl.current = el;
    el.setAttribute('data-cy-audio-track-name', track.name);
    el.muted = true;
    document.body.appendChild(el);

    const audioCtx = new AudioContext();
    const mediaStream = new MediaStream([track.mediaStreamTrack]);
    const remoteAudio = new RemoteAudio(audioCtx, { mediaStream });

    remoteAudio.connect(audioCtx.destination);

    return () => {
      remoteAudio.destroy();
      audioCtx.close();

      track.detach().forEach(element => {
        element.srcObject = null;
        element.remove();
      });

      audioEl.current = null;
    };
  }, [track]);

  useEffect(() => {
    if (audioEl.current?.setSinkId && activeSinkId) {
      audioEl.current.setSinkId(activeSinkId).catch(() => {});
    }
  }, [activeSinkId]);

  return null;
}
