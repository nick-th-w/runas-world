// Audio disabled — will be re-enabled in a future update with pre-recorded audio files.
// The speak/stop interface is preserved so no other files need changing.
export function useSpeech() {
  const speak = () => {}
  const stop  = () => {}
  return { speak, stop }
}
