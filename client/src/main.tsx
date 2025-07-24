import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')!).render(
  //disabling strictmode for useeffect testing (this gets disabled anyway in prod) -harley
  // <React.StrictMode> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
)
