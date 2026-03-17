import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface YamlPreviewPanelProps {
  show: boolean
  yaml: string
  onClose: () => void
}

export function YamlPreviewPanel({ show, yaml, onClose }: YamlPreviewPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="yaml-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 224, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 overflow-hidden rounded-xl border border-border/50"
        >
          <div className="flex h-full flex-col bg-gray-950">
            <div className="flex shrink-0 items-center justify-between border-b border-border/30 px-3 py-1.5">
              <span className="text-xs font-medium text-green-400">YAML Preview</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
            <pre className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed text-green-400">
              {yaml}
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
