import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Cpu } from "lucide-react"
import { Link } from "react-router-dom"

export function CtaFooter() {
  return (
    <>
      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Ready to build your first smart device?</h2>
              <p className="text-lg text-muted-foreground">Start for free. No hardware required to begin learning.</p>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg" className="h-12 gap-2 px-8">
                <Link to="/signup">
                  Start learning — it's free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-cyan-400">
              <Cpu className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">ESPHome Learn</span>
          </div>
          <p className="text-xs text-muted-foreground">Built for makers and home automation enthusiasts.</p>
          <div className="flex gap-6">
            <Link to="/signin" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Sign In</Link>
            <Link to="/signup" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Sign Up</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
