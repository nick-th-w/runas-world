import { useState } from 'react'

const initial = {
  phase: 'meadow', // meadow | forest | sunnyhill
  butterfly: false,
  acorns: false,
  rewards: [],
}

export function useQuest() {
  const [quest, setQuest] = useState(initial)

  const advance = (update) => setQuest((q) => ({ ...q, ...update }))

  const completeSideQuest = (id, rewardId) =>
    setQuest((q) => ({
      ...q,
      [id]: true,
      rewards: q.rewards.includes(rewardId) ? q.rewards : [...q.rewards, rewardId],
    }))

  const completeMain = () =>
    setQuest((q) => ({
      ...q,
      rewards: [...new Set([...q.rewards, 'flowerSticker', 'flowerCrown'])],
    }))

  return { quest, advance, completeSideQuest, completeMain }
}
