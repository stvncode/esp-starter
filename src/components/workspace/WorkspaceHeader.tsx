import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Code2, Copy, Download, Play, Redo2, Save, Square, Undo2 } from "lucide-react"

interface WorkspaceHeaderProps {
  deviceName: string
  onDeviceNameChange: (v: string) => void
  canUndo: boolean
  canRedo: boolean
  isSimulating: boolean
  nodesEmpty: boolean
  copied: boolean
  showYaml: boolean
  onUndo: () => void
  onRedo: () => void
  onSimulate: () => void
  onStopSimulation: () => void
  onSave: () => void
  onCopyYaml: () => void
  onDownloadYaml: () => void
  onToggleYaml: () => void
}

export function WorkspaceHeader({
  deviceName,
  onDeviceNameChange,
  canUndo,
  canRedo,
  isSimulating,
  nodesEmpty,
  copied,
  showYaml,
  onUndo,
  onRedo,
  onSimulate,
  onStopSimulation,
  onSave,
  onCopyYaml,
  onDownloadYaml,
  onToggleYaml,
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
      <div className="flex flex-wrap gap-2">
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
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button size="sm" onClick={onCopyYaml}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Copy YAML
        </Button>
        <Button size="sm" variant="secondary" onClick={onDownloadYaml}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" variant={showYaml ? "default" : "outline"} onClick={onToggleYaml}>
          <Code2 className="mr-2 h-4 w-4" />
          YAML
        </Button>
      </div>
    </div>
  )
}
