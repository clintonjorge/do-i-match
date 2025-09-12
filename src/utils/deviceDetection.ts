// Mobile and browser detection utilities

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isIOSSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isIOS() || isAndroid() || /Mobile|Tablet/.test(navigator.userAgent);
};

export const supportsWebSpeechAPI = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hasAPI = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  
  // iOS Safari has limited Web Speech API support
  if (isIOSSafari()) {
    return false; // Disable for now due to reliability issues
  }
  
  return hasAPI;
};

export const supportsAudioContext = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'AudioContext' in window || 'webkitAudioContext' in window;
};

export const createAudioContext = (): AudioContext | null => {
  if (!supportsAudioContext()) return null;
  
  try {
    // @ts-ignore - webkitAudioContext for Safari compatibility
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    return new AudioContextClass();
  } catch (error) {
    console.warn('Failed to create AudioContext:', error);
    return null;
  }
};

export const unlockAudioContext = async (audioContext: AudioContext): Promise<void> => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (error) {
      console.warn('Failed to resume AudioContext:', error);
    }
  }
};