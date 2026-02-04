import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/layout"
import { Home, Level } from "@/pages"
import { Sandbox } from "@/pages/Sandbox"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/level/:levelId" element={<Level />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
