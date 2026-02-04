import { create } from "zustand"
import type { Node, Edge } from "@xyflow/react"

export interface LevelState {
  // Flow editor state
  nodes: Node[]
  edges: Edge[]
  
  // YAML editor state
  yaml: string
  
  // Challenge state
  challengeCompleted: boolean
  hints: string[]
  currentHintIndex: number
  
  // Actions
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setYaml: (yaml: string) => void
  completeChallenge: () => void
  showNextHint: () => void
  resetLevel: () => void
  initializeLevel: (config: Partial<LevelState>) => void
}

export const useLevelStore = create<LevelState>((set) => ({
  nodes: [],
  edges: [],
  yaml: "",
  challengeCompleted: false,
  hints: [],
  currentHintIndex: -1,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setYaml: (yaml) => set({ yaml }),
  
  completeChallenge: () => set({ challengeCompleted: true }),
  
  showNextHint: () =>
    set((state) => ({
      currentHintIndex: Math.min(state.currentHintIndex + 1, state.hints.length - 1),
    })),
  
  resetLevel: () =>
    set({
      nodes: [],
      edges: [],
      yaml: "",
      challengeCompleted: false,
      currentHintIndex: -1,
    }),
  
  initializeLevel: (config) =>
    set({
      nodes: config.nodes ?? [],
      edges: config.edges ?? [],
      yaml: config.yaml ?? "",
      challengeCompleted: false,
      hints: config.hints ?? [],
      currentHintIndex: -1,
    }),
}))
