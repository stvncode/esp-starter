import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft, Cpu, Home, Wifi, WifiOff } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center">
      {/* Animated icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col items-center gap-4"
      >
        {/* Broken connection illustration */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <Cpu className="h-6 w-6 text-blue-400" />
          </div>

          {/* Broken wire */}
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-border" />
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <WifiOff className="h-4 w-4 text-muted-foreground/50" />
            </motion.div>
            <div
              className="h-px w-8 bg-border/30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg,currentColor 0,currentColor 4px,transparent 4px,transparent 10px)",
              }}
            />
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 bg-card/40 shadow-sm">
            <Wifi className="h-6 w-6 text-muted-foreground/30" />
          </div>
        </div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-mono text-8xl font-bold text-foreground/10 select-none"
        >
          404
        </motion.div>
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="space-y-3 mb-8"
      >
        <h1 className="text-2xl font-bold text-foreground">Node not found</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Looks like this connection is broken. The page you're looking for doesn't exist or was
          moved.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Button>
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Home page
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
