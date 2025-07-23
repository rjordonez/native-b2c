/**
 * Audio utility functions for processing audio data
 */

/**
 * Convert AudioBuffer to WAV format blob
 * @param audioBuffer - The AudioBuffer to convert
 * @returns Promise<Blob> - WAV format blob
 */
export function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numberOfChannels * 2; // 16-bit samples
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    // RIFF identifier
    writeString(0, 'RIFF');
    // File length minus first 8 bytes
    view.setUint32(4, 36 + length, true);
    // WAVE identifier
    writeString(8, 'WAVE');
    // Format chunk identifier
    writeString(12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (PCM)
    view.setUint16(20, 1, true);
    // Channel count
    view.setUint16(22, numberOfChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    // Block align (channel count * bytes per sample)
    view.setUint16(32, numberOfChannels * 2, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(36, 'data');
    // Data chunk length
    view.setUint32(40, length, true);
    
    // Convert audio data to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        let sample = channelData[i];
        
        // Clamp sample to [-1, 1] range
        sample = Math.max(-1, Math.min(1, sample));
        
        // Convert to 16-bit integer
        const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, int16Sample, true);
        offset += 2;
      }
    }
    
    resolve(new Blob([buffer], { type: 'audio/wav' }));
  });
}

/**
 * Convert blob to base64 string
 * @param blob - The blob to convert
 * @returns Promise<string> - Base64 encoded string (without data URL prefix)
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/wav;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}