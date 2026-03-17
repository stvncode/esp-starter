import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Code2,
  Home,
  Wifi,
  Cpu,
  Lightbulb,
  CircleDot,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const apiYaml = `api:
  encryption:
    key: "your-32-byte-base64-key-here"

ota:
  - platform: esphome
    password: "my-ota-password"

wifi:
  ssid: "MyNetwork"
  password: "secret"`

const getLineColor = (line: string) => {
  if (line.startsWith("api:") || line.startsWith("ota:") || line.startsWith("wifi:")) return "text-blue-400"
  if (line.includes("encryption:")) return "text-cyan-400"
  if (line.includes("key:") || line.includes("password:") || line.includes("ssid:") || line.includes("platform:")) return "text-green-400"
  return "text-foreground"
}

export function Level5_4() {
  const [celebrated, setCelebrated] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("5.4")

  useEffect(() => {
    if (!celebrated) {
      const timer = setTimeout(() => {
        setCelebrated(true)
        completeLevel("5.4")
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [celebrated, completeLevel])

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400">Phase 5</Badge>
          <Badge variant="outline">Level 5.4</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Integration with Home Assistant</h1>
        <p className="text-lg text-muted-foreground">
          The final step: connect your ESPHome device to Home Assistant for full smart home control.
        </p>
      </div>

      {/* Explanation */}
      <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
            <Home className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">The api: block</p>
            <p className="text-sm text-muted-foreground">
              Adding an{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">api:</code> block to your config
              enables the native ESPHome API. Home Assistant automatically discovers devices running
              this API on the local network and exposes their sensors and controls as HA entities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API YAML */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Config with api: block</CardTitle>
          </div>
          <CardDescription className="text-xs">
            The encryption key secures communication between the device and Home Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-4">
            <pre className="font-mono text-sm">
              {apiYaml.split("\n").map((line, i) => (
                <div key={i} className="leading-6">
                  <span className="mr-4 inline-block w-5 text-right text-xs text-muted-foreground/40">
                    {i + 1}
                  </span>
                  <span className={getLineColor(line)}>{line || "\u00A0"}</span>
                </div>
              ))}
            </pre>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <p className="text-xs text-muted-foreground">
              Generate a random 32-byte key with{" "}
              <code className="font-mono">openssl rand -base64 32</code>. This encrypts all
              communication between your device and Home Assistant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Animated diagram */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">How it connects</CardTitle>
          <CardDescription className="text-xs">
            Your device communicates with Home Assistant over your local WiFi network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-6 flex-wrap">
            {/* ESP device */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
                <Cpu className="h-8 w-8 text-cyan-400" />
              </div>
              <p className="text-xs font-medium text-center">ESP32 Device</p>
              <p className="text-xs text-muted-foreground text-center">Running ESPHome</p>
            </motion.div>

            {/* Arrow + WiFi */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-1"
            >
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-6 w-6 text-cyan-400" />
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground">WiFi / LAN</p>
            </motion.div>

            {/* Home Assistant */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/30">
                <Home className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-xs font-medium text-center">Home Assistant</p>
              <p className="text-xs text-muted-foreground text-center">Smart home hub</p>
            </motion.div>
          </div>

          {/* HA entities */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
              Entities that appear in Home Assistant:
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                <CircleDot className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium">binary_sensor</p>
                  <p className="text-xs text-muted-foreground">My Button</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium">light</p>
                  <p className="text-xs text-muted-foreground">My Light</p>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Celebration card */}
      <AnimatePresence>
        {celebrated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card className={cn(
              "border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
            )}>
              <CardContent className="py-10 text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20"
                >
                  <Sparkles className="h-10 w-10 text-cyan-400" />
                </motion.div>

                <h3 className="mb-2 text-2xl font-bold">Phase 5 Complete!</h3>
                <p className="mb-2 text-muted-foreground">
                  You've mastered real hardware workflows:
                </p>

                <div className="my-6 flex flex-wrap justify-center gap-2">
                  {[
                    "USB flashing",
                    "Log debugging",
                    "OTA updates",
                    "Home Assistant integration",
                  ].map((item) => (
                    <Badge key={item} className="bg-cyan-500/20 text-cyan-300">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {item}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Your ESPHome journey continues. Phase 6 covers advanced topics: lambdas, custom
                  components, and I2C/SPI devices.
                </p>

                <Button asChild>
                  <Link to="/app/level/6.1">
                    Continue to Phase 6
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
