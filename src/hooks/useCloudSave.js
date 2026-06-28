import { useEffect, useRef, useCallback } from 'react'

// How far ahead is a given save state? Higher = further in the game.
function progressScore(s) {
  if (!s) return -1
  let n = 0
  n += (s.chaptersCompleted || []).filter(Boolean).length * 1000
  const ch1Order = ['meadow', 'forest', 'sunnyhill']
  n += ch1Order.indexOf(s.phase || 'meadow') * 10
  const ch2Order = ['bedroom-morning','village-path','lakeshore','lake-shallows','deep-lake','bedroom-night']
  n += ch2Order.indexOf(s.ch2Phase || 'bedroom-morning') * 10
  n += (s.rewards || []).length * 5
  return n
}

export function useCloudSave({ pin, questState, playerState, onLoadState }) {
  const saveTimer = useRef(null)
  const lastSavedRef = useRef(null)

  // Auto-save whenever quest state changes (debounced 3s)
  useEffect(() => {
    if (!pin) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const payload = { quest: questState, player: playerState }
      const payloadStr = JSON.stringify(payload)
      if (payloadStr === lastSavedRef.current) return // no change
      try {
        await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin, state: payload }),
        })
        lastSavedRef.current = payloadStr
      } catch (e) {
        // Silently ignore — local state is still intact
      }
    }, 3000)
    return () => clearTimeout(saveTimer.current)
  }, [pin, questState, playerState]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load from cloud — takes the furthest-ahead save
  const loadFromCloud = useCallback(async (pinToLoad) => {
    try {
      const res = await fetch(`/api/load?pin=${pinToLoad}`)
      if (!res.ok) return { ok: false, message: res.status === 404 ? 'No save found for that PIN.' : 'Cloud error.' }
      const { state } = await res.json()

      // Only apply cloud save if it's further ahead than current local state
      const localScore = progressScore(questState)
      const cloudScore = progressScore(state?.quest)
      if (cloudScore > localScore) {
        onLoadState(state)
        return { ok: true, message: 'Progress loaded from cloud!' }
      } else {
        return { ok: true, message: 'Your local save is already up to date.' }
      }
    } catch {
      return { ok: false, message: 'Could not reach cloud. Check your connection.' }
    }
  }, [questState, onLoadState])

  // Force push local state to cloud immediately
  const forceSave = useCallback(async () => {
    if (!pin) return
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, state: { quest: questState, player: playerState } }),
      })
      lastSavedRef.current = JSON.stringify({ quest: questState, player: playerState })
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }, [pin, questState, playerState])

  return { loadFromCloud, forceSave }
}
