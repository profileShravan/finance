import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'


function App() {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
