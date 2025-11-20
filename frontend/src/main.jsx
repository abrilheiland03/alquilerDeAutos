import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './components/home/home.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {}
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>,
)