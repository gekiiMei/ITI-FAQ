import { Route, Routes, useLocation } from "react-router-dom"
import AuthRoute from "./utils/AuthRoute.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import LoginPage from "./pages/LoginPage/LoginPage.tsx"
import DashboardPage from "./pages/DashboardPage/DashboardPage.tsx"
import EditorPage from "./pages/EditorPage/EditorPage.tsx"
import ViewerPage from "./pages/ViewerPage/ViewerPage.tsx"
import './App.css'

// TEMPORARY IMPORT FOR COMPONENT TESTING! -harley
import TEMPTESTPAGE from "./pages/TEMPTESTPAGE.tsx"
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage.tsx"

function App() {
  const location = useLocation()

  return (
    <>
      {/* PLACE ROUTES HERE */}
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route element={ <AuthRoute /> }>
          <Route path="/dashboard" element= { <DashboardPage /> } />
          <Route path="/editor" element = { <EditorPage /> } />
        </Route>
        <Route path="/viewer" element = { <ViewerPage /> } /> 
        <Route path="/search" element = { <SearchResultsPage /> } key={location.key}/>

        {/* TEMPORARY!! FOR COMPONENT TESTING!! DELETE AFTER -Harley */}
        <Route path="/comp-test" element={ <TEMPTESTPAGE /> } />
      </Routes>
    </>
  )
}

export default App
