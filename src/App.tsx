import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout"
import { Home, Level } from "@/pages"
import { Workspace } from "@/pages/Workspace"
import { WorkspaceHome } from "@/pages/WorkspaceHome"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/level/:levelId" element={<Level />} />
          <Route path="/workspace" element={<WorkspaceHome />} />
          <Route path="/workspace/builder" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
