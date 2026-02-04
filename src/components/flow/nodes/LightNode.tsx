import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Lightbulb, LightbulbOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LightNodeData {
  label: string
  pin?: string
  isOn?: boolean
}

export const LightNode = memo(function LightNode({
  data,
  selected,
}: NodeProps & { data: LightNodeData }) {
  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col items-center rounded-xl border-2 bg-gradient-to-b p-4 transition-all",
        data.isOn
          ? "border-amber-400 from-amber-200 to-amber-300 dark:from-amber-950 dark:to-amber-900 shadow-lg shadow-amber-500/20"
          : selected
            ? "border-amber-500 from-amber-100 to-amber-200 dark:from-amber-950/50 dark:to-amber-900/50 shadow-lg shadow-amber-500/10"
            : "border-amber-300 dark:border-amber-800/50 from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 hover:border-amber-400 dark:hover:border-amber-700"
      )}
    >
      {/* Glow effect when on */}
      {data.isOn && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-amber-400/40 blur-xl" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
          data.isOn ? "bg-amber-400/30" : "bg-amber-500/10"
        )}
      >
        {data.isOn ? (
          <Lightbulb className="h-6 w-6 text-amber-300" />
        ) : (
          <LightbulbOff className="h-6 w-6 text-amber-600" />
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          data.isOn ? "text-amber-900 dark:text-amber-100" : "text-amber-700 dark:text-amber-300/70"
        )}
      >
        {data.label}
      </span>

      {/* Pin info */}
      {data.pin && (
        <span className="mt-1 font-mono text-xs text-amber-600/70 dark:text-amber-500/70">
          {data.pin}
        </span>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-amber-400 !bg-amber-500"
      />

      {/* Category badge */}
      <div
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white transition-colors",
          data.isOn ? "bg-amber-500" : "bg-amber-700"
        )}
      >
        Output
      </div>
    </div>
  )
})
