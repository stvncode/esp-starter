import { useCallback, useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
  type NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTheme } from "next-themes"
import { ButtonNode } from "./nodes/ButtonNode"
import { LightNode } from "./nodes/LightNode"
import { ActionNode } from "./nodes/ActionNode"
import { TriggerNode } from "./nodes/TriggerNode"

interface FlowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (nodes: Node[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onConnect?: (connection: Connection) => void
  readonly?: boolean
  showMinimap?: boolean
  showControls?: boolean
}

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  readonly = false,
  showMinimap = false,
  showControls = true,
}: FlowCanvasProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      button: ButtonNode,
      light: LightNode,
      action: ActionNode,
      trigger: TriggerNode,
    }),
    []
  )

  const handleNodesChangeInternal = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes)
      onNodesChange(updatedNodes as Node[])
    },
    [nodes, onNodesChange]
  )

  const handleEdgesChangeInternal = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges)
      onEdgesChange(updatedEdges as Edge[])
    },
    [edges, onEdgesChange]
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge({ ...connection, animated: true }, edges)
      onEdgesChange(newEdges)
      onConnect?.(connection)
    },
    [edges, onEdgesChange, onConnect]
  )

  return (
    <div className="h-full w-full rounded-xl border border-border/50 bg-gray-100 dark:bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeInternal}
        onEdgesChange={handleEdgesChangeInternal}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={!readonly}
        nodesConnectable={!readonly}
        elementsSelectable={!readonly}
        edgesFocusable={!readonly}
        deleteKeyCode={readonly ? null : ["Backspace", "Delete"]}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
          interactionWidth: 20, // Makes edges easier to click
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDark ? "#374151" : "#d1d5db"}
        />
        {showControls && (
          <Controls className="!border-border/50 !bg-card [&>button]:!border-border/50 [&>button]:!bg-card [&>button]:!text-foreground [&>button:hover]:!bg-accent" />
        )}
        {showMinimap && (
          <MiniMap
            className="!border-border/50 !bg-card"
            nodeColor={(node) => {
              switch (node.type) {
                case "button":
                  return "#3b82f6"
                case "light":
                  return "#f59e0b"
                case "action":
                  return "#8b5cf6"
                case "trigger":
                  return "#06b6d4"
                default:
                  return "#6b7280"
              }
            }}
          />
        )}
      </ReactFlow>
    </div>
  )
}
