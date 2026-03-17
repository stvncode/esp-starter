import type { Node } from "@xyflow/react"
import type { Automation } from "./types"

export function buildYaml(
  nodes: Node[],
  deviceName: string,
  area: string,
  wifiSsid: string,
  wifiPassword: string,
  automations: Automation[],
  board = "esp32dev",
): string {
  const buttons = nodes.filter((n) => n.type === "button")
  const lights = nodes.filter((n) => n.type === "light")
  let out = `esphome:\n  name: ${(deviceName || "my-device").toLowerCase().replace(/\s+/g, "-")}\n`
  if (area) out += `  area: "${area}"\n`
  const needsIdf = ["esp32-c6", "esp32-s3", "esp32-s2"].some((v) => board.includes(v))
  const frameworkLine = needsIdf ? "\n  framework:\n    type: esp-idf" : ""
  out += `\nesp32:\n  board: ${board}${frameworkLine}\n\nwifi:\n  ssid: "${wifiSsid || "YourNetwork"}"\n  password: "${wifiPassword || "YourPassword"}"\n\napi:\n\nlogger:\n\n`
  if (buttons.length > 0) {
    out += `binary_sensor:\n`
    buttons.forEach((btn) => {
      out += `  - platform: gpio\n    pin: ${btn.data.pin}\n    name: "${btn.data.label}"\n`
    })
    out += "\n"
  }
  if (lights.length > 0) {
    out += `light:\n`
    lights.forEach((light, i) => {
      out += `  - platform: binary\n    name: "${light.data.label}"\n    id: light_${i}\n    output: output_${i}\n`
    })
    out += "\n"
    out += `output:\n`
    lights.forEach((light, i) => {
      out += `  - platform: gpio\n    pin: ${light.data.pin}\n    id: output_${i}\n`
    })
    out += "\n"
  }
  if (automations.length > 0) {
    out += `automation:\n`
    automations.forEach((auto) => {
      const srcNode = nodes.find((n) => n.id === auto.sourceNodeId)
      const tgtNode = nodes.find((n) => n.id === auto.targetNodeId)
      out += `  - alias: "${srcNode ? srcNode.data.label : "?"} → ${auto.action} ${tgtNode ? tgtNode.data.label : "?"}"\n`
      out += `    trigger:\n      - platform: ${auto.trigger}\n`
      out += `    action:\n      - service: light.${auto.action}\n        target:\n          entity_id: light_${lights.findIndex((l) => l.id === auto.targetNodeId)}\n`
    })
  }
  return out
}
