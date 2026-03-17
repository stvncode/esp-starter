import type { Node } from "@xyflow/react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

type SetNodes = React.Dispatch<React.SetStateAction<Node[]>>

export function useSimulation(nodes: Node[], setNodes: SetNodes, edges: { source: string; target: string }[]) {
  const [isSimulating, setIsSimulating] = useState(false)

  const getConnectedNodes = useCallback(
    (sourceId: string) => edges.filter((e) => e.source === sourceId).map((e) => e.target),
    [edges],
  )

  const runSimulation = useCallback(() => {
    if (nodes.length === 0) {
      toast.error("Add some nodes first!")
      return
    }
    const inputNodes = nodes.filter((n) => n.type === "button")
    if (inputNodes.length === 0) {
      toast.error("Add an input node to start simulation")
      return
    }
    setIsSimulating(true)
    const visited = new Set<string>()
    const queue: { nodeId: string; delay: number }[] = []
    inputNodes.forEach((node) => queue.push({ nodeId: node.id, delay: 0 }))
    let currentDelay = 0
    const processQueue = () => {
      const toProcess = [...queue]
      queue.length = 0
      toProcess.forEach(({ nodeId, delay }) => {
        if (visited.has(nodeId)) return
        visited.add(nodeId)
        const node = nodes.find((n) => n.id === nodeId)
        if (!node) return
        setTimeout(() => {
          setNodes((prev) =>
            prev.map((n) => {
              if (n.id !== nodeId) return n
              if (n.type === "button") return { ...n, data: { ...n.data, isActive: true } }
              if (n.type === "light") return { ...n, data: { ...n.data, isOn: true } }
              return { ...n, data: { ...n.data, isActive: true } }
            }),
          )
          const connected = getConnectedNodes(nodeId)
          connected.forEach((id) => {
            if (!visited.has(id)) queue.push({ nodeId: id, delay: 0 })
          })
          if (queue.length > 0) processQueue()
        }, delay + currentDelay)
        currentDelay += 500
      })
    }
    processQueue()
    setTimeout(
      () => {
        setIsSimulating(false)
        setNodes((prev) =>
          prev.map((n) => ({
            ...n,
            data: { ...n.data, isActive: false, isOn: n.type === "light" ? false : undefined },
          })),
        )
        toast.success("Simulation complete!")
      },
      nodes.length * 600 + 1000,
    )
  }, [nodes, getConnectedNodes, setNodes])

  const stopSimulation = useCallback(() => {
    setIsSimulating(false)
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...n.data, isActive: false, isOn: n.type === "light" ? false : undefined },
      })),
    )
  }, [setNodes])

  return { isSimulating, runSimulation, stopSimulation }
}
