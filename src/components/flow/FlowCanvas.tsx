import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeMouseHandler,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTheme } from "next-themes"
import { useCallback, useMemo, useRef } from "react"
import { ActionNode } from "./nodes/ActionNode"
import { ButtonNode } from "./nodes/ButtonNode"
import { DelayNode } from "./nodes/DelayNode"
import { LightNode } from "./nodes/LightNode"
import { TriggerNode } from "./nodes/TriggerNode"

export interface ConnectionDroppedParams {
  screenX: number
  screenY: number
  flowX: number
  flowY: number
  sourceNodeId: string
}

export interface PaneContextMenuParams {
  screenX: number
  screenY: number
  flowX: number
  flowY: number
}

interface FlowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (nodes: Node[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onConnect?: (connection: Connection) => void
  onNodeClick?: NodeMouseHandler
  onEdgeClick?: EdgeMouseHandler
  onPaneClick?: (event: React.MouseEvent) => void
  onConnectionDropped?: (params: ConnectionDroppedParams) => void
  onPaneContextMenu?: (params: PaneContextMenuParams) => void
  readonly?: boolean
  showMinimap?: boolean
  showControls?: boolean
}

// Inner component — rendered inside ReactFlowProvider so it can call useReactFlow
function FlowCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onConnectionDropped,
  onPaneContextMenu,
  readonly = false,
  showMinimap = false,
  showControls = true,
}: FlowCanvasProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { screenToFlowPosition } = useReactFlow()

  // Track the source node when a connection drag starts
  const connectingSourceRef = useRef<string | null>(null)
  const justConnectedRef = useRef(false)

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      button: ButtonNode,
      light: LightNode,
      action: ActionNode,
      trigger: TriggerNode,
      delay: DelayNode,
    }),
    [],
  )

  const handleNodesChangeInternal = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(applyNodeChanges(changes, nodes) as Node[])
    },
    [nodes, onNodesChange],
  )

  const handleEdgesChangeInternal = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(applyEdgeChanges(changes, edges) as Edge[])
    },
    [edges, onEdgesChange],
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      justConnectedRef.current = true
      const newEdges = addEdge({ ...connection, animated: true }, edges)
      onEdgesChange(newEdges)
      onConnect?.(connection)
    },
    [edges, onEdgesChange, onConnect],
  )

  const handleConnectStart = useCallback(
    (_event: MouseEvent | TouchEvent, params: { nodeId: string | null }) => {
      connectingSourceRef.current = params.nodeId
      justConnectedRef.current = false
    },
    [],
  )

  const handlePaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      event.preventDefault()
      const clientX = "clientX" in event ? event.clientX : 0
      const clientY = "clientY" in event ? event.clientY : 0
      const flowPos = screenToFlowPosition({ x: clientX, y: clientY })
      onPaneContextMenu?.({
        screenX: clientX,
        screenY: clientY,
        flowX: flowPos.x,
        flowY: flowPos.y,
      })
    },
    [screenToFlowPosition, onPaneContextMenu],
  )

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Give onConnect a chance to set the flag first (they fire in the same tick)
      const sourceId = connectingSourceRef.current
      connectingSourceRef.current = null

      if (justConnectedRef.current || !sourceId || !onConnectionDropped) {
        justConnectedRef.current = false
        return
      }
      justConnectedRef.current = false

      const clientX = "clientX" in event ? event.clientX : (event.touches?.[0]?.clientX ?? 0)
      const clientY = "clientY" in event ? event.clientY : (event.touches?.[0]?.clientY ?? 0)
      const flowPos = screenToFlowPosition({ x: clientX, y: clientY })

      onConnectionDropped({
        screenX: clientX,
        screenY: clientY,
        flowX: flowPos.x,
        flowY: flowPos.y,
        sourceNodeId: sourceId,
      })
    },
    [screenToFlowPosition, onConnectionDropped],
  )

  return (
    <div className="h-full w-full rounded-xl border border-border/50 bg-gray-100 dark:bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeInternal}
        onEdgesChange={handleEdgesChangeInternal}
        onConnect={handleConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu ? handlePaneContextMenu : undefined}
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
          interactionWidth: 20,
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

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
