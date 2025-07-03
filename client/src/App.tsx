import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import './App.css'

function App() {

  return (
    <>
      {/* PLACE ROUTES HERE */}
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
      </Routes>
    </>
  )
}

export default App
