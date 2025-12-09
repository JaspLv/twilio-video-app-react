// RemoteAudio.ts
import { AudioSource } from "./AudioSource";

export interface RemoteAudioOptions {
  mediaStream?: MediaStream;
}

export default class RemoteAudio extends AudioSource {
  private mediaStream: MediaStream | undefined;
  private source: MediaStreamAudioSourceNode | undefined;

  constructor(context: AudioContext, options: RemoteAudioOptions = {}) {
    super(context);

    const { mediaStream } = options;
    this.mediaStream = mediaStream;

    if (this.mediaStream) {
      this.createSource(this.mediaStream);
    }
  }

  private createSource(mediaStream: MediaStream): void {
    this.source?.disconnect();
    this.source = new MediaStreamAudioSourceNode(this.audioContext, { mediaStream });
    this.source.connect(this.output);
  }

  setRemoteStream(mediaStream: MediaStream): void {
    this.mediaStream = mediaStream;
    this.createSource(mediaStream);
  }

  override destroy(): void {
    super.destroy();
    this.source?.disconnect();
    this.source = undefined;
    this.mediaStream = undefined;
  }
}
