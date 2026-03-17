import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout"
import { Home, Level } from "@/pages"
import { Landing } from "@/pages/Landing"
import { SignIn } from "@/pages/SignIn"
import { SignUp } from "@/pages/SignUp"
import { Workspace } from "@/pages/Workspace"
import { WorkspaceHome } from "@/pages/WorkspaceHome"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no AppShell */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* App routes — with sidebar + header */}
        <Route element={<AppShell />}>
          <Route path="/app" element={<Home />} />
          <Route path="/app/level/:levelId" element={<Level />} />
          <Route path="/app/workspace" element={<WorkspaceHome />} />
          <Route path="/app/workspace/builder" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
