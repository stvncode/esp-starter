import type { Node } from "@xyflow/react"
import { AnimatePresence } from "framer-motion"
import { Copy, Trash2 } from "lucide-react"
import type React from "react"
import { createPortal } from "react-dom"
import { CANVAS_CATEGORIES, LOGIC_CATEGORIES } from "./constants"
import { NodePalette } from "./NodePalette"
import type { ComponentItem, ConnectMenu, NodeMenu } from "./types"

interface WorkspaceContextMenusProps {
  connectMenu: ConnectMenu | null
  connectMenuSearch: string
  connectMenuRef: React.RefObject<HTMLDivElement | null>
  filteredConnectNodes: ComponentItem[]
  filteredCanvasNodes: ComponentItem[]
  onConnectMenuSearchChange: (v: string) => void
  onAddContextualNode: (item: ComponentItem) => void
  onConnectMenuClose: () => void
  nodeMenu: NodeMenu | null
  selectedNode: Node | null
  nodeMenuSearch: string
  nodeMenuRef: React.RefObject<HTMLDivElement | null>
  filteredNodeMenuNodes: ComponentItem[]
  onNodeMenuSearchChange: (v: string) => void
  onAddContextualNodeFromNodeMenu: (item: ComponentItem) => void
  onNodeMenuClose: () => void
  onDuplicateNode: () => void
  onDeleteNode: () => void
}

export function WorkspaceContextMenus({
  connectMenu,
  connectMenuSearch,
  connectMenuRef,
  filteredConnectNodes,
  filteredCanvasNodes,
  onConnectMenuSearchChange,
  onAddContextualNode,
  onConnectMenuClose,
  nodeMenu,
  selectedNode,
  nodeMenuSearch,
  nodeMenuRef,
  filteredNodeMenuNodes,
  onNodeMenuSearchChange,
  onAddContextualNodeFromNodeMenu,
  onNodeMenuClose,
  onDuplicateNode,
  onDeleteNode,
}: WorkspaceContextMenusProps) {
  return createPortal(
    <AnimatePresence>
      <>
        {connectMenu && (
          <NodePalette
            ref={connectMenuRef}
            x={connectMenu.screenX}
            y={connectMenu.screenY}
            title={connectMenu.menuType === "canvas" ? "Add to canvas" : "Add node"}
            subtitle={
              connectMenu.menuType === "canvas" ? "Right-click • no connection" : undefined
            }
            search={connectMenuSearch}
            onSearchChange={onConnectMenuSearchChange}
            filtered={connectMenu.menuType === "canvas" ? filteredCanvasNodes : filteredConnectNodes}
            categories={connectMenu.menuType === "canvas" ? CANVAS_CATEGORIES : LOGIC_CATEGORIES}
            onSelect={onAddContextualNode}
            onClose={onConnectMenuClose}
          />
        )}
        {nodeMenu && selectedNode && (
          <NodePalette
            ref={nodeMenuRef}
            x={nodeMenu.screenX}
            y={nodeMenu.screenY}
            title="Add connected node"
            subtitle={String(selectedNode.data.label ?? selectedNode.type)}
            search={nodeMenuSearch}
            onSearchChange={onNodeMenuSearchChange}
            filtered={filteredNodeMenuNodes}
            categories={LOGIC_CATEGORIES}
            onSelect={onAddContextualNodeFromNodeMenu}
            onClose={onNodeMenuClose}
            footer={
              <div className="border-t border-border/40 p-1.5">
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                  onClick={() => {
                    onDuplicateNode()
                    onNodeMenuClose()
                  }}
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  Duplicate node
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-destructive/10"
                  onClick={onDeleteNode}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete node
                </button>
              </div>
            }
          />
        )}
      </>
    </AnimatePresence>,
    document.body,
  )
}
