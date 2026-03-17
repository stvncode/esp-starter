import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ButtonNodeData {
  label: string
  pin?: string
  isActive?: boolean
}

export const ButtonNode = memo(function ButtonNode({
  id,
  data,
  selected,
}: NodeProps & { data: ButtonNodeData }) {
  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col items-center rounded-xl border-2 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 p-4 transition-all",
        selected
          ? "border-blue-400 shadow-lg shadow-blue-500/20"
          : "border-blue-300 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
      )}
    >
      {/* Glow effect */}
      {data.isActive && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-blue-400/30 blur-xl" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
          data.isActive ? "bg-blue-400/30" : "bg-blue-500/20"
        )}
      >
        <CircleDot
          className={cn(
            "h-6 w-6 transition-colors",
            data.isActive ? "text-blue-300" : "text-blue-400"
          )}
        />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{data.label}</span>

      {/* Pin info */}
      {data.pin && (
        <span className="mt-1 font-mono text-xs text-blue-600/70 dark:text-blue-400/70">
          {data.pin}
        </span>
      )}

      {/* Output handle (click to open add-node palette) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-blue-400 !bg-blue-500 cursor-pointer"
        onClick={(event) => {
          // Mark this node as the one whose handle was clicked so the workspace
          // can open the palette at the handle position.
          event.stopPropagation()
          const customEvent = new CustomEvent("esp-node-handle-click", {
            detail: {
              nodeId: id,
              clientX: (event as React.MouseEvent).clientX,
              clientY: (event as React.MouseEvent).clientY,
            },
          })
          window.dispatchEvent(customEvent)
        }}
      />

      {/* Category badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
        Input
      </div>
    </div>
  )
})
