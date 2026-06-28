import { useState, useEffect } from 'react'

const CHAPTER_COUNT = 11
const QUEST_KEY = 'runas-quest'

const initial = {
  phase: 'meadow',
  butterfly: false,
  acorns: false,
  rewards: [],
  questBests: {},
  medalTotals: { bronze: 0, silver: 0, gold: 0 },
  chaptersCompleted: Array(CHAPTER_COUNT).fill(false),
  penaltyUnlocked: false,
}

function load() {
  try {
    const saved = localStorage.getItem(QUEST_KEY)
    return saved ? { ...initial, ...JSON.parse(saved) } : initial
  } catch { return initial }
}

function bestMedal(current, next) {
  if (!next) return current
  const rank = { bronze: 1, silver: 2, gold: 3 }
  if (!current) return next
  return rank[next] > rank[current] ? next : current
}

export function useQuest() {
  const [quest, setQuest] = useState(load)

  // Persist every change to localStorage
  useEffect(() => {
    try { localStorage.setItem(QUEST_KEY, JSON.stringify(quest)) } catch {}
  }, [quest])

  const advance = (update) => setQuest((q) => ({ ...q, ...update }))

  const completeSideQuest = (id, rewardId, medal) =>
    setQuest((q) => ({
      ...q,
      [id]: true,
      rewards: q.rewards.includes(rewardId) ? q.rewards : [...q.rewards, rewardId],
      questBests: { ...q.questBests, [id]: bestMedal(q.questBests[id], medal) },
      medalTotals: medal
        ? { ...q.medalTotals, [medal]: q.medalTotals[medal] + 1 }
        : q.medalTotals,
    }))

  const completeMain = () =>
    setQuest((q) => ({
      ...q,
      rewards: [...new Set([...q.rewards, 'flowerSticker', 'flowerCrown'])],
      chaptersCompleted: q.chaptersCompleted.map((v, i) => (i === 0 ? true : v)),
    }))

  const resetChapter = () =>
    setQuest((q) => ({
      ...q,
      phase: 'meadow',
      butterfly: false,
      acorns: false,
    }))

  const addReward = (id) =>
    setQuest((q) =>
      q.rewards.includes(id) ? q : { ...q, rewards: [...q.rewards, id] }
    )

  const unlockPenalty = () =>
    setQuest((q) => ({ ...q, penaltyUnlocked: true }))

  return { quest, advance, completeSideQuest, completeMain, resetChapter, addReward, unlockPenalty }
}
