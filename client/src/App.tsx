import { Route, Routes } from "react-router-dom"
import AuthRoute from "./utils/AuthRoute.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import LoginPage from "./pages/LoginPage/LoginPage.tsx"
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx"
import './App.css'

// TEMPORARY IMPORT FOR COMPONENT TESTING! -harley
import TEMPTESTPAGE from "./pages/TEMPTESTPAGE.tsx"
import RegisterModal from "./components/RegisterModal/RegisterModal.tsx"

function App() {

  return (
    <>
      <RegisterModal />
    </>
  )
}

export default App
