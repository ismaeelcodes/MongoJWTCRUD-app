import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Verify from './components/Verify'
import ForgetPass from './components/ForgetPass'
import VerifyReset from './components/VerifyReset'
import PasswordReset from './components/PasswordReset'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/verify' element={<Verify />} />
      <Route path='/verifyreset' element={<VerifyReset />} />
      <Route path='/forgetPass' element={<ForgetPass />} />
      <Route path='/setPass' element={<PasswordReset />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
