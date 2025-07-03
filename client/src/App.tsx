import { Route, Routes } from "react-router-dom"
import AuthRoute from "./utils/AuthRoute.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import LoginPage from "./pages/LoginPage/LoginPage.tsx"
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx"
import './App.css'

// TEMPORARY IMPORT FOR COMPONENT TESTING! -harley
import TEMPTESTPAGE from "./pages/TEMPTESTPAGE.tsx"

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

        {/* TEMPORARY!! FOR COMPONENT TESTING!! DELETE AFTER -Harley */}
        <Route path="/comp-test" element={ <TEMPTESTPAGE /> } />
      </Routes>
    </>
  )
}

export default App
