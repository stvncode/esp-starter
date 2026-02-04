import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Play, ToggleLeft, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"

export type ActionType = "turn_on" | "turn_off" | "toggle"

export interface ActionNodeData {
  label: string
  actionType: ActionType
  isActive?: boolean
}

const actionIcons: Record<ActionType, React.ElementType> = {
  turn_on: Power,
  turn_off: PowerOff,
  toggle: ToggleLeft,
}

const actionColors: Record<ActionType, { border: string; bg: string; text: string }> = {
  turn_on: {
    border: "border-green-500",
    bg: "bg-green-500/20",
    text: "text-green-400",
  },
  turn_off: {
    border: "border-red-500",
    bg: "bg-red-500/20",
    text: "text-red-400",
  },
  toggle: {
    border: "border-purple-500",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
}

export const ActionNode = memo(function ActionNode({
  data,
  selected,
}: NodeProps & { data: ActionNodeData }) {
  const Icon = actionIcons[data.actionType] ?? Play
  const colors = actionColors[data.actionType] ?? actionColors.toggle

  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col items-center rounded-xl border-2 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-4 transition-all",
        selected
          ? `${colors.border} shadow-lg`
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
      )}
    >
      {/* Pulse effect when active */}
      {data.isActive && (
        <div
          className={cn(
            "absolute inset-0 -z-10 animate-pulse rounded-xl blur-xl",
            colors.bg
          )}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-lg",
          colors.bg
        )}
      >
        <Icon className={cn("h-6 w-6", colors.text)} />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.label}</span>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-gray-400 !bg-gray-500"
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-gray-400 !bg-gray-500"
      />

      {/* Category badge */}
      <div
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white",
          data.actionType === "turn_on"
            ? "bg-green-600"
            : data.actionType === "turn_off"
              ? "bg-red-600"
              : "bg-purple-600"
        )}
      >
        Action
      </div>
    </div>
  )
})
