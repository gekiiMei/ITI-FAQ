import { Route, Routes } from "react-router-dom"
import AuthRoute from "./components/AuthRoute.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import LoginPage from "./pages/LoginPage/LoginPage.tsx"
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx"
import './App.css'

function App() {

  return (
    <>
      {/* PLACE ROUTES HERE */}
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route element={ <AuthRoute /> }>
          <Route path="/dashboard" element= { <DashboardPage /> } />
        </Route>
      </Routes>
    </>
  )
}

export default App
