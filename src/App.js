import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import AuthProvider from "./context/auth"

import "./App.css"

// pages
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
