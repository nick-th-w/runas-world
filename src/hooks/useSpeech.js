import { useRef, useCallback } from 'react'

// Swap out the speak/stop functions below to use pre-recorded audio files later.
// The rest of the app (DialogueBox, scenes) only calls speak(text) and stop().
export function useSpeech() {
  const synth = useRef(window.speechSynthesis)

  const speak = useCallback((text) => {
    synth.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.85
    utt.pitch = 1.1
    const voices = synth.current.getVoices()
    utt.voice =
      voices.find((v) => v.lang.startsWith('en-AU')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null
    synth.current.speak(utt)
  }, [])

  const stop = useCallback(() => synth.current.cancel(), [])

  return { speak, stop }
}
