import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TabsContent } from "@/components/ui/tabs"
import { Cpu, MapPin, Wifi } from "lucide-react"
import { BOARD_OPTIONS } from "./constants"

interface DeviceSettingsTabProps {
  deviceName: string
  board: string
  area: string
  wifiSsid: string
  wifiPassword: string
  onDeviceNameChange: (v: string) => void
  onBoardChange: (v: string) => void
  onAreaChange: (v: string) => void
  onWifiSsidChange: (v: string) => void
  onWifiPasswordChange: (v: string) => void
}

export function DeviceSettingsTab({
  deviceName,
  board,
  area,
  wifiSsid,
  wifiPassword,
  onDeviceNameChange,
  onBoardChange,
  onAreaChange,
  onWifiSsidChange,
  onWifiPasswordChange,
}: DeviceSettingsTabProps) {
  return (
    <TabsContent value="generic">
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Device Settings</CardTitle>
          <CardDescription className="text-xs">Basic ESPHome configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              Device Name
            </p>
            <Input
              value={deviceName}
              onChange={(e) => onDeviceNameChange(e.target.value)}
              placeholder="my-device"
              className="h-8 text-sm"
            />
            <p className="text-[11px] text-muted-foreground">Used as the ESPHome hostname</p>
          </div>
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              Board
            </p>
            <Select value={board} onValueChange={onBoardChange}>
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOARD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Area
            </p>
            <Input
              value={area}
              onChange={(e) => onAreaChange(e.target.value)}
              placeholder="Living Room"
              className="h-8 text-sm"
            />
            <p className="text-[11px] text-muted-foreground">Shown in Home Assistant</p>
          </div>
          <div className="space-y-3 rounded-lg border border-border/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
              Wi-Fi
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">SSID</p>
              <Input
                value={wifiSsid}
                onChange={(e) => onWifiSsidChange(e.target.value)}
                placeholder="Network name"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Password</p>
              <Input
                type="password"
                value={wifiPassword}
                onChange={(e) => onWifiPasswordChange(e.target.value)}
                placeholder="••••••••"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
