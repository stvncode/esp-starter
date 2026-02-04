import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="min-h-[calc(100svh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
