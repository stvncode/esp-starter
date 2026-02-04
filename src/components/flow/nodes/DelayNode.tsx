import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DelayNodeData {
  label: string
  duration: string
  isActive?: boolean
}

export const DelayNode = memo(function DelayNode({
  data,
  selected,
}: NodeProps & { data: DelayNodeData }) {
  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col items-center rounded-xl border-2 bg-gradient-to-b from-orange-100 to-orange-200 dark:from-orange-950 dark:to-orange-900 p-4 transition-all",
        selected
          ? "border-orange-400 shadow-lg shadow-orange-500/20"
          : "border-orange-300 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600"
      )}
    >
      {/* Glow effect */}
      {data.isActive && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-orange-400/30 blur-xl" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
          data.isActive ? "bg-orange-400/30" : "bg-orange-500/20"
        )}
      >
        <Clock
          className={cn(
            "h-6 w-6 transition-colors",
            data.isActive ? "text-orange-300 animate-pulse" : "text-orange-500 dark:text-orange-400"
          )}
        />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-orange-900 dark:text-orange-100">{data.label}</span>

      {/* Duration */}
      <span className="mt-1 font-mono text-xs text-orange-600 dark:text-orange-400/70">
        {data.duration}
      </span>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-orange-400 !bg-orange-500"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-orange-400 !bg-orange-500"
      />

      {/* Category badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
        Wait
      </div>
    </div>
  )
})
