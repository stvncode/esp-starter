import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
}

interface ProgressState {
  completedLevels: string[]
  currentLevel: string | null
  streak: number
  lastActivityDate: string | null
  achievements: Achievement[]

  // Actions
  completeLevel: (levelId: string) => void
  setCurrentLevel: (levelId: string) => void
  unlockAchievement: (achievement: Achievement) => void
  updateStreak: () => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLevels: [],
      currentLevel: null,
      streak: 1,
      lastActivityDate: null,
      achievements: [],

      completeLevel: (levelId: string) => {
        const { completedLevels, updateStreak } = get()
        if (!completedLevels.includes(levelId)) {
          set({ completedLevels: [...completedLevels, levelId] })
          updateStreak()
        }
      },

      setCurrentLevel: (levelId: string) => {
        set({ currentLevel: levelId })
      },

      unlockAchievement: (achievement: Achievement) => {
        const { achievements } = get()
        if (!achievements.find((a) => a.id === achievement.id)) {
          set({
            achievements: [
              ...achievements,
              { ...achievement, unlockedAt: new Date() },
            ],
          })
        }
      },

      updateStreak: () => {
        const today = new Date().toDateString()
        const { lastActivityDate, streak } = get()

        if (lastActivityDate === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastActivityDate === yesterday.toDateString()) {
          set({ streak: streak + 1, lastActivityDate: today })
        } else if (lastActivityDate !== today) {
          set({ streak: 1, lastActivityDate: today })
        }
      },

      resetProgress: () => {
        set({
          completedLevels: [],
          currentLevel: null,
          streak: 1,
          lastActivityDate: null,
          achievements: [],
        })
      },
    }),
    {
      name: "esphome-progress",
    }
  )
)
