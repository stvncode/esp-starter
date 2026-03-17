import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Edge, Node } from "@xyflow/react"
import { AnimatePresence, motion } from "framer-motion"
import { Copy, Trash2, X } from "lucide-react"

interface PropertiesPanelProps {
  selectedNode: Node | null
  selectedEdge: Edge | null
  onUpdateNodeData: (field: string, value: string) => void
  onDuplicateNode: () => void
  onDeleteNode: () => void
  onDeleteEdge: () => void
  onClose: () => void
}

export function PropertiesPanel({
  selectedNode,
  selectedEdge,
  onUpdateNodeData,
  onDuplicateNode,
  onDeleteNode,
  onDeleteEdge,
  onClose,
}: PropertiesPanelProps) {
  return (
    <AnimatePresence>
      {(selectedNode || selectedEdge) && (
        <motion.div
          key="properties-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="shrink-0"
        >
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs capitalize">
                  {selectedNode ? `${selectedNode.type} node` : "Connection"}
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              {selectedNode && (
                <>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">Label</p>
                    <Input
                      value={String(selectedNode.data.label ?? "")}
                      onChange={(e) => onUpdateNodeData("label", e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  {selectedNode.data.pin !== undefined && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground">GPIO Pin</p>
                      <Input
                        value={String(selectedNode.data.pin ?? "")}
                        onChange={(e) => onUpdateNodeData("pin", e.target.value)}
                        className="h-7 font-mono text-xs"
                        placeholder="GPIO4"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 text-xs"
                      onClick={onDuplicateNode}
                    >
                      <Copy className="mr-1.5 h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 flex-1 text-xs"
                      onClick={onDeleteNode}
                    >
                      <Trash2 className="mr-1.5 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
              {selectedEdge && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 w-full text-xs"
                  onClick={onDeleteEdge}
                >
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Delete Connection
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
