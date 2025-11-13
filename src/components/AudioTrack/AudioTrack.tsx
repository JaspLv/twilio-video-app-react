import { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';
import RemoteAudio from './RemoteAudio';

interface AudioTrackProps {
  track: IAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const { activeSinkId } = useAppState();
  const audioEl = useRef<HTMLAudioElement>();
  const audioCtx = useRef<AudioContext>();
  const remoteAudio = useRef<RemoteAudio>();

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    audioEl.current.muted = true;

    document.body.appendChild(audioEl.current);

    audioCtx.current = new AudioContext();

    const mediaStream = new MediaStream([track.mediaStreamTrack]);

    remoteAudio.current = new RemoteAudio(audioCtx.current, { mediaStream });
    remoteAudio.current.connect(audioCtx.current.destination);

    return () => {
      remoteAudio.current?.destroy();
      remoteAudio.current = undefined;
      audioCtx.current?.close();
      audioCtx.current = undefined;

      track.detach().forEach(el => {
        el.remove();

        // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
        // See: https://github.com/twilio/twilio-video.js/issues/1528
        el.srcObject = null;
      });
    };
  }, [track]);

  useEffect(() => {
    audioEl.current?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);

  return null;
}
