import {
  FlowCanvas,
  type ConnectionDroppedParams,
  type PaneContextMenuParams,
} from "@/components/flow"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutomationsTab } from "@/components/workspace/AutomationsTab"
import { buildYaml } from "@/components/workspace/buildYaml"
import { ComponentsTab } from "@/components/workspace/ComponentsTab"
import { ALL_COMPONENTS, ALL_LOGIC_NODES } from "@/components/workspace/constants"
import { DeviceSettingsTab } from "@/components/workspace/DeviceSettingsTab"
import { PropertiesPanel } from "@/components/workspace/PropertiesPanel"
import type {
  Automation,
  ComponentItem,
  ConnectMenu,
  NodeMenu,
  SavedProject,
} from "@/components/workspace/types"
import { useSimulation } from "@/components/workspace/useSimulation"
import { WorkspaceContextMenus } from "@/components/workspace/WorkspaceContextMenus"
import { WorkspaceHeader, type WorkspaceView } from "@/components/workspace/WorkspaceHeader"
import type { Edge, EdgeMouseHandler, Node, NodeMouseHandler } from "@xyflow/react"
import { Boxes, GitBranch, Settings } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"

interface WorkspaceInitState {
  deviceName?: string
  board?: string
  wifiSsid?: string
  wifiPassword?: string
  area?: string
  nodes?: Node[]
  edges?: Edge[]
  automations?: Automation[]
}

export function Workspace() {
  const location = useLocation()
  const init: WorkspaceInitState = (location.state as WorkspaceInitState) ?? {}

  const [nodes, setNodes] = useState<Node[]>(init.nodes ?? [])
  const [edges, setEdges] = useState<Edge[]>(init.edges ?? [])
  const [deviceName, setDeviceName] = useState(init.deviceName ?? "my-device")
  const [board, setBoard] = useState(init.board ?? "esp32dev")
  const [wifiSsid, setWifiSsid] = useState(init.wifiSsid ?? "")
  const [wifiPassword, setWifiPassword] = useState(init.wifiPassword ?? "")
  const [area, setArea] = useState(init.area ?? "")
  const [automations, setAutomations] = useState<Automation[]>(init.automations ?? [])
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem("workspace-projects")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [copied, setCopied] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generic")
  const [view, setView] = useState<WorkspaceView>("builder")
  const [connectMenu, setConnectMenu] = useState<ConnectMenu | null>(null)
  const connectMenuRef = useRef<HTMLDivElement>(null)
  const [connectMenuSearch, setConnectMenuSearch] = useState("")
  const [nodeMenu, setNodeMenu] = useState<NodeMenu | null>(null)
  const nodeMenuRef = useRef<HTMLDivElement>(null)
  const [nodeMenuSearch, setNodeMenuSearch] = useState("")
  const undoStackRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([])
  const redoStackRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const { isSimulating, runSimulation, stopSimulation } = useSimulation(nodes, setNodes, edges)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )
  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  )
  const outputNodes = useMemo(() => nodes.filter((n) => n.type === "light"), [nodes])

  const yaml = useMemo(
    () => buildYaml(nodes, deviceName, area, wifiSsid, wifiPassword, automations, board),
    [nodes, deviceName, area, wifiSsid, wifiPassword, automations, board],
  )

  const filteredConnectNodes = useMemo(() => {
    const q = connectMenuSearch.trim().toLowerCase()
    if (!q) return ALL_LOGIC_NODES
    return ALL_LOGIC_NODES.filter(
      (n) => n.label.toLowerCase().includes(q) || n.category.toLowerCase().includes(q),
    )
  }, [connectMenuSearch])

  const filteredNodeMenuNodes = useMemo(() => {
    const q = nodeMenuSearch.trim().toLowerCase()
    if (!q) return ALL_LOGIC_NODES
    return ALL_LOGIC_NODES.filter(
      (n) => n.label.toLowerCase().includes(q) || n.category.toLowerCase().includes(q),
    )
  }, [nodeMenuSearch])

  const filteredCanvasNodes = useMemo(() => {
    const q = connectMenuSearch.trim().toLowerCase()
    if (!q) return ALL_COMPONENTS
    return ALL_COMPONENTS.filter(
      (n) => n.label.toLowerCase().includes(q) || n.category.toLowerCase().includes(q),
    )
  }, [connectMenuSearch])

  // ── Outside-click dismissal ─────────────────────────────────────────────────
  useEffect(() => {
    if (!connectMenu) return
    const handleClick = (e: MouseEvent) => {
      if (connectMenuRef.current && !connectMenuRef.current.contains(e.target as globalThis.Node)) {
        setConnectMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [connectMenu])

  useEffect(() => {
    if (!nodeMenu) return
    const handleClick = (e: MouseEvent) => {
      if (nodeMenuRef.current && !nodeMenuRef.current.contains(e.target as globalThis.Node)) {
        setNodeMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [nodeMenu])

  // ── Node handle click → open node menu ────────────────────────────────────
  useEffect(() => {
    type HandleClickDetail = { nodeId: string; clientX: number; clientY: number }
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<HandleClickDetail>).detail
      if (!detail) return
      setSelectedNodeId(detail.nodeId)
      setSelectedEdgeId(null)
      setConnectMenu(null)
      setConnectMenuSearch("")
      setNodeMenuSearch("")
      setNodeMenu({ screenX: detail.clientX, screenY: detail.clientY, nodeId: detail.nodeId })
    }
    window.addEventListener("esp-node-handle-click", handler as EventListener)
    return () => window.removeEventListener("esp-node-handle-click", handler as EventListener)
  }, [])

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const pushToHistory = useCallback((prevNodes: Node[], prevEdges: Edge[]) => {
    undoStackRef.current = [
      ...undoStackRef.current.slice(-49),
      { nodes: prevNodes, edges: prevEdges },
    ]
    redoStackRef.current = []
    setCanUndo(true)
    setCanRedo(false)
  }, [])

  const handleUndo = useCallback(() => {
    const prev = undoStackRef.current.pop()
    if (!prev) return
    redoStackRef.current = [...redoStackRef.current, { nodes, edges }]
    setNodes(prev.nodes)
    setEdges(prev.edges)
    setCanUndo(undoStackRef.current.length > 0)
    setCanRedo(true)
  }, [nodes, edges])

  const handleRedo = useCallback(() => {
    const next = redoStackRef.current.pop()
    if (!next) return
    undoStackRef.current = [...undoStackRef.current, { nodes, edges }]
    setNodes(next.nodes)
    setEdges(next.edges)
    setCanUndo(true)
    setCanRedo(redoStackRef.current.length > 0)
  }, [nodes, edges])

  // ── Canvas handlers ────────────────────────────────────────────────────────
  const handleNodeClick = useCallback<NodeMouseHandler>((_event, node) => {
    setSelectedNodeId(node.id)
    setSelectedEdgeId(null)
    setConnectMenu(null)
    setConnectMenuSearch("")
    setNodeMenu(null)
  }, [])

  const handleEdgeClick = useCallback<EdgeMouseHandler>((_e, edge) => {
    setSelectedEdgeId(edge.id)
    setSelectedNodeId(null)
    setConnectMenu(null)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setConnectMenu(null)
    setConnectMenuSearch("")
    setNodeMenu(null)
    setNodeMenuSearch("")
  }, [])

  const handleConnectionDropped = useCallback(
    (params: ConnectionDroppedParams) => {
      if (!nodes.find((n) => n.id === params.sourceNodeId)) return
      setConnectMenuSearch("")
      setConnectMenu({ ...params, menuType: "connect" })
    },
    [nodes],
  )

  const handlePaneContextMenu = useCallback((params: PaneContextMenuParams) => {
    setConnectMenuSearch("")
    setNodeMenu(null)
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setConnectMenu({ ...params, sourceNodeId: "", menuType: "canvas" })
  }, [])

  // ── Node operations ────────────────────────────────────────────────────────
  const handleAddNode = useCallback(
    (component: ComponentItem) => {
      pushToHistory(nodes, edges)
      const newNode: Node = {
        id: `${component.id}-${Date.now()}`,
        type: component.type,
        position: { x: 150 + Math.random() * 300, y: 100 + Math.random() * 200 },
        data: { ...component.data },
      }
      setNodes((prev) => [...prev, newNode])
    },
    [nodes, edges, pushToHistory],
  )

  const handleAddContextualNode = useCallback(
    (option: ComponentItem) => {
      if (!connectMenu) return
      pushToHistory(nodes, edges)
      const newNode: Node = {
        id: `${option.id}-${Date.now()}`,
        type: option.type,
        position: { x: connectMenu.flowX, y: connectMenu.flowY },
        data: { ...option.data },
      }
      setNodes((prev) => [...prev, newNode])
      if (connectMenu.sourceNodeId) {
        setEdges((prev) => [
          ...prev,
          {
            id: `e-${connectMenu.sourceNodeId}-${newNode.id}`,
            source: connectMenu.sourceNodeId,
            target: newNode.id,
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
        ])
      }
      setConnectMenu(null)
      toast.success(`Added "${option.label}"`)
    },
    [connectMenu, nodes, edges, pushToHistory],
  )

  const handleAddContextualNodeFromNodeMenu = useCallback(
    (option: ComponentItem) => {
      if (!nodeMenu) return
      const sourceNode = nodes.find((n) => n.id === nodeMenu.nodeId)
      if (!sourceNode) return
      pushToHistory(nodes, edges)
      const newNode: Node = {
        id: `${option.id}-${Date.now()}`,
        type: option.type,
        position: { x: sourceNode.position.x + 180, y: sourceNode.position.y },
        data: { ...option.data },
      }
      setNodes((prev) => [...prev, newNode])
      setEdges((prev) => [
        ...prev,
        {
          id: `e-${sourceNode.id}-${newNode.id}`,
          source: sourceNode.id,
          target: newNode.id,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        },
      ])
      setNodeMenu(null)
      toast.success(`Added "${option.label}"`)
    },
    [nodeMenu, nodes, edges, pushToHistory],
  )

  const handleUpdateNodeData = useCallback(
    (field: string, value: string) => {
      if (!selectedNodeId) return
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId ? { ...n, data: { ...n.data, [field]: value } } : n,
        ),
      )
    },
    [selectedNodeId],
  )

  const handleDuplicateNode = useCallback(() => {
    if (!selectedNode) return
    pushToHistory(nodes, edges)
    const dup: Node = {
      id: `${selectedNode.type}-${Date.now()}`,
      type: selectedNode.type,
      position: { x: selectedNode.position.x + 40, y: selectedNode.position.y + 40 },
      data: { ...selectedNode.data },
    }
    setNodes((prev) => [...prev, dup])
    toast.success("Node duplicated")
  }, [selectedNode, nodes, edges, pushToHistory])

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return
    pushToHistory(nodes, edges)
    setEdges((prev) =>
      prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
    )
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId))
    setSelectedNodeId(null)
    setNodeMenu(null)
    toast.success("Node removed")
  }, [selectedNodeId, nodes, edges, pushToHistory])

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdgeId) return
    pushToHistory(nodes, edges)
    setEdges((prev) => prev.filter((e) => e.id !== selectedEdgeId))
    setSelectedEdgeId(null)
    toast.success("Connection removed")
  }, [selectedEdgeId, nodes, edges, pushToHistory])

  // ── YAML export / save ─────────────────────────────────────────────────────
  const copyYaml = useCallback(() => {
    navigator.clipboard.writeText(yaml)
    setCopied(true)
    toast.success("YAML copied!")
    setTimeout(() => setCopied(false), 2000)
  }, [yaml])

  const downloadYaml = useCallback(() => {
    const blob = new Blob([yaml], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(deviceName || "my-device").toLowerCase().replace(/\s+/g, "-")}.yaml`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("YAML downloaded!")
  }, [yaml, deviceName])

  const saveProject = useCallback(() => {
    const project: SavedProject = {
      name: deviceName,
      deviceName,
      board,
      wifiSsid,
      wifiPassword,
      area,
      nodes,
      edges,
      automations,
      createdAt: new Date().toISOString(),
    }
    const updated = [...savedProjects.filter((p) => p.name !== deviceName), project]
    setSavedProjects(updated)
    localStorage.setItem("workspace-projects", JSON.stringify(updated))
    toast.success("Project saved!")
  }, [deviceName, board, wifiSsid, wifiPassword, area, nodes, edges, automations, savedProjects])

  const addAutomation = useCallback((data: Omit<Automation, "id">) => {
    setAutomations((prev) => [...prev, { ...data, id: `auto-${Date.now()}` }])
    toast.success("Automation added")
  }, [])

  const removeAutomation = useCallback(
    (id: string) => setAutomations((prev) => prev.filter((a) => a.id !== id)),
    [],
  )

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      if (e.key === "Escape") {
        setConnectMenu(null)
        setConnectMenuSearch("")
        setNodeMenu(null)
        setNodeMenuSearch("")
        setSelectedNodeId(null)
        setSelectedEdgeId(null)
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !isEditing) {
        if (selectedNodeId) handleDeleteNode()
        else if (selectedEdgeId) handleDeleteEdge()
      }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault()
        handleUndo()
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault()
        handleRedo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d" && !isEditing) {
        e.preventDefault()
        if (selectedNodeId) handleDuplicateNode()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedNodeId,
    selectedEdgeId,
    handleDeleteNode,
    handleDeleteEdge,
    handleUndo,
    handleRedo,
    handleDuplicateNode,
  ])

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col p-6">
      <WorkspaceHeader
        deviceName={deviceName}
        onDeviceNameChange={setDeviceName}
        canUndo={canUndo}
        canRedo={canRedo}
        isSimulating={isSimulating}
        nodesEmpty={nodes.length === 0}
        copied={copied}
        view={view}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSimulate={runSimulation}
        onStopSimulation={stopSimulation}
        onSave={saveProject}
        onCopyYaml={copyYaml}
        onDownloadYaml={downloadYaml}
        onViewChange={setView}
      />

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden">
        {/* Canvas / YAML column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {view === "builder" ? (
            <div className="min-h-0 flex-1">
              <FlowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={setNodes}
                onEdgesChange={setEdges}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                onPaneClick={handlePaneClick}
                onConnectionDropped={handleConnectionDropped}
                onPaneContextMenu={handlePaneContextMenu}
                showControls
                showMinimap={false}
              />
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border/50 bg-gray-950 p-5">
              <pre className="font-mono text-sm leading-relaxed text-green-300 whitespace-pre">
                {yaml}
              </pre>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex w-88 flex-col gap-3 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
            <TabsList className="w-full shrink-0 justify-between">
              <TabsTrigger value="generic" className="flex-1 gap-1">
                <Settings className="h-3.5 w-3.5" />
                Generic
              </TabsTrigger>
              <TabsTrigger value="components" className="flex-1 gap-1">
                <Boxes className="h-3.5 w-3.5" />
                Components
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex-1 gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                Automations
              </TabsTrigger>
            </TabsList>
            <DeviceSettingsTab
              deviceName={deviceName}
              board={board}
              area={area}
              wifiSsid={wifiSsid}
              wifiPassword={wifiPassword}
              onDeviceNameChange={setDeviceName}
              onBoardChange={setBoard}
              onAreaChange={setArea}
              onWifiSsidChange={setWifiSsid}
              onWifiPasswordChange={setWifiPassword}
            />
            <ComponentsTab onAddComponent={handleAddNode} />
            <AutomationsTab
              nodes={nodes}
              outputNodes={outputNodes}
              automations={automations}
              onAddAutomation={addAutomation}
              onRemoveAutomation={removeAutomation}
            />
          </Tabs>

          <PropertiesPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNodeData={handleUpdateNodeData}
            onDuplicateNode={handleDuplicateNode}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            onClose={() => {
              setSelectedNodeId(null)
              setSelectedEdgeId(null)
            }}
          />

          {!selectedNode && !selectedEdge && (
            <Card className="shrink-0 border-border/50 bg-card/50">
              <CardContent className="py-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{nodes.length}</p>
                    <p className="text-xs text-muted-foreground">Nodes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{edges.length}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <WorkspaceContextMenus
        connectMenu={connectMenu}
        connectMenuSearch={connectMenuSearch}
        connectMenuRef={connectMenuRef}
        filteredConnectNodes={filteredConnectNodes}
        filteredCanvasNodes={filteredCanvasNodes}
        onConnectMenuSearchChange={setConnectMenuSearch}
        onAddContextualNode={handleAddContextualNode}
        onConnectMenuClose={() => {
          setConnectMenu(null)
          setConnectMenuSearch("")
        }}
        nodeMenu={nodeMenu}
        selectedNode={selectedNode}
        nodeMenuSearch={nodeMenuSearch}
        nodeMenuRef={nodeMenuRef}
        filteredNodeMenuNodes={filteredNodeMenuNodes}
        onNodeMenuSearchChange={setNodeMenuSearch}
        onAddContextualNodeFromNodeMenu={handleAddContextualNodeFromNodeMenu}
        onNodeMenuClose={() => {
          setNodeMenu(null)
          setNodeMenuSearch("")
        }}
        onDuplicateNode={handleDuplicateNode}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  )
}
