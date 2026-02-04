import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { MousePointerClick, MousePointer } from "lucide-react"
import { cn } from "@/lib/utils"

export type TriggerType = "on_press" | "on_release"

export interface TriggerNodeData {
  label: string
  triggerType: TriggerType
  isActive?: boolean
}

const triggerConfig: Record<
  TriggerType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  on_press: {
    icon: MousePointerClick,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
  },
  on_release: {
    icon: MousePointer,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
  },
}

export const TriggerNode = memo(function TriggerNode({
  data,
  selected,
}: NodeProps & { data: TriggerNodeData }) {
  const config = triggerConfig[data.triggerType] ?? triggerConfig.on_press
  const Icon = config.icon

  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col items-center rounded-xl border-2 bg-gradient-to-b from-cyan-100 to-cyan-200 dark:from-cyan-950 dark:to-cyan-900 p-4 transition-all",
        selected
          ? "border-cyan-400 shadow-lg shadow-cyan-500/20"
          : "border-cyan-300 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600"
      )}
    >
      {/* Glow effect */}
      {data.isActive && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-cyan-400/30 blur-xl" />
      )}

      {/* Icon */}
      <div className={cn("mb-2 flex h-12 w-12 items-center justify-center rounded-lg", config.bgColor)}>
        <Icon className={cn("h-6 w-6", config.color)} />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-cyan-900 dark:text-cyan-100">{data.label}</span>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-cyan-400 !bg-cyan-500"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-cyan-400 !bg-cyan-500"
      />

      {/* Category badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-cyan-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
        When
      </div>
    </div>
  )
})
