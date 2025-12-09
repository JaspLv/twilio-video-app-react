// AudioSource.ts
export abstract class AudioSource {
  /** The audio context */
  protected readonly audioContext: AudioContext;

  /** Output node */
  protected outputNode: GainNode | null;

  protected constructor(audioContext: AudioContext) {
    if (new.target === AudioSource) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.audioContext = audioContext;
    this.outputNode = new GainNode(this.audioContext);
  }

  /** Connect downstream */
  connect(destinationNode: AudioNode, output: number = 0, input: number = 0): AudioNode {
    if (!this.outputNode) throw new Error('Output node must be instantiated.');
    return this.outputNode.connect(destinationNode, output, input);
  }

  /** Sample rate */
  get sampleRate(): number {
    return this.audioContext.sampleRate;
  }

  /** Output node getter */
  get output(): AudioNode {
    if (!this.outputNode) throw new Error('Output node must be instantiated.');
    return this.outputNode;
  }

  /** Destroy */
  destroy(): void {
    this.outputNode?.disconnect();
    this.outputNode = null;
  }
}
