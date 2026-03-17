import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { hardwareComponents } from "./constants"
import type { ComponentItem } from "./types"

interface ComponentsTabProps {
  onAddComponent: (comp: ComponentItem) => void
}

export function ComponentsTab({ onAddComponent }: ComponentsTabProps) {
  return (
    <TabsContent value="components">
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Components</CardTitle>
          <CardDescription className="text-xs">
            Hardware nodes — click to add. Drag a handle to chain logic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Input", "Output"].map((category) => (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </p>
              <div className="space-y-1.5">
                {hardwareComponents
                  .filter((c) => c.category === category)
                  .map((comp) => {
                    const Icon = comp.icon
                    return (
                      <motion.button
                        key={comp.id}
                        onClick={() => onAddComponent(comp)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-2 text-left transition-colors hover:border-border hover:bg-muted/40"
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md",
                            comp.bgColor,
                          )}
                        >
                          <Icon className={cn("h-3.5 w-3.5", comp.color)} />
                        </div>
                        <span className="text-xs">{comp.label}</span>
                      </motion.button>
                    )
                  })}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-border/40 p-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground/60">Tip:</span> Drag from a node's
              handle (the dot on its edge) to add a trigger, action, or timing node inline.
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
