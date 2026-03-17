import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, Code2, Copy, Download, Play, Redo2, Save, Square, Undo2, Workflow } from "lucide-react"

export type WorkspaceView = "builder" | "yaml"

interface WorkspaceHeaderProps {
  deviceName: string
  onDeviceNameChange: (v: string) => void
  canUndo: boolean
  canRedo: boolean
  isSimulating: boolean
  nodesEmpty: boolean
  copied: boolean
  view: WorkspaceView
  onUndo: () => void
  onRedo: () => void
  onSimulate: () => void
  onStopSimulation: () => void
  onSave: () => void
  onCopyYaml: () => void
  onDownloadYaml: () => void
  onViewChange: (v: WorkspaceView) => void
}

export function WorkspaceHeader({
  deviceName,
  onDeviceNameChange,
  canUndo,
  canRedo,
  isSimulating,
  nodesEmpty,
  copied,
  view,
  onUndo,
  onRedo,
  onSimulate,
  onStopSimulation,
  onSave,
  onCopyYaml,
  onDownloadYaml,
  onViewChange,
}: WorkspaceHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge className="shrink-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400">
          Workspace
        </Badge>
        <Input
          value={deviceName}
          onChange={(e) => onDeviceNameChange(e.target.value)}
          className="h-8 w-48 border-none bg-transparent p-0 text-xl font-bold focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* View switcher */}
        <div className="flex h-8 overflow-hidden rounded-md border border-border/60">
          <button
            onClick={() => onViewChange("builder")}
            className={cn(
              "flex items-center gap-1.5 px-3 text-sm transition-colors",
              view === "builder"
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <Workflow className="h-3.5 w-3.5" />
            Builder
          </button>
          <div className="w-px bg-border/60" />
          <button
            onClick={() => onViewChange("yaml")}
            className={cn(
              "flex items-center gap-1.5 px-3 text-sm transition-colors",
              view === "yaml"
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            YAML
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {view === "builder" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo || isSimulating}
                title="Undo (⌘Z)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo || isSimulating}
                title="Redo (⌘⇧Z)"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              {isSimulating ? (
                <Button size="sm" variant="destructive" onClick={onStopSimulation}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button size="sm" onClick={onSimulate} disabled={nodesEmpty}>
                  <Play className="mr-2 h-4 w-4" />
                  Simulate
                </Button>
              )}
            </>
          )}
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={onCopyYaml}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {view === "yaml" ? "Copy" : "Copy YAML"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onDownloadYaml}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
