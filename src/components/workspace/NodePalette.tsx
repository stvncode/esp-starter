import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { forwardRef } from "react"
import type { ComponentItem } from "./types"

interface NodePaletteProps {
  x: number
  y: number
  title: string
  subtitle?: string
  search: string
  onSearchChange: (v: string) => void
  filtered: ComponentItem[]
  categories: readonly string[]
  onSelect: (item: ComponentItem) => void
  onClose: () => void
  footer?: React.ReactNode
}

export const NodePalette = forwardRef<HTMLDivElement, NodePaletteProps>(function NodePalette(
  { x, y, title, subtitle, search, onSearchChange, filtered, categories, onSelect, onClose, footer },
  ref,
) {
  const top = Math.max(8, Math.min(y, window.innerHeight - 480))
  const left = Math.max(8, Math.min(x, window.innerWidth - 240))
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      style={{ top, left }}
      className="fixed z-[9999] w-56 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold">{title}</p>
          {subtitle && <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="ml-2 shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="border-b border-border/40 px-2 py-1.5">
        <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-1">
          <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <ScrollArea className="max-h-[130px] overflow-y-auto">
        <div className="p-1.5">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">No results</p>
          ) : (
            categories.map((cat) => {
              const items = filtered.filter((n) => n.category === cat)
              if (items.length === 0) return null
              return (
                <div key={cat} className="mb-1 last:mb-0">
                  <p className="mb-0.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </p>
                  {items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded",
                            item.bgColor,
                          )}
                        >
                          <Icon className={cn("h-3 w-3", item.color)} />
                        </div>
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
      {footer}
    </motion.div>
  )
})
