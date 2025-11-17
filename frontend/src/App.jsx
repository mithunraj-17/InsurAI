import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import CustomerDashboard from './components/CustomerDashboard'
import AgentDashboard from './components/AgentDashboard'
import BrokerDashboard from './components/BrokerDashboard'
import AdminDashboard from './components/AdminDashboard'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const getDashboardRoute = () => {
    const role = localStorage.getItem('userRole')
    switch(role) {
      case 'CUSTOMER': return '/customer-dashboard'
      case 'AGENT': return '/agent-dashboard'
      case 'BROKER': return '/broker-dashboard'
      case 'ADMIN': return '/admin-dashboard'
      default: return '/login'
    }
  }

  return (
    <Router>
      <div className={`app ${!isAuthenticated ? 'auth' : ''}`}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to={getDashboardRoute()} />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRoute()} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/customer-dashboard" element={isAuthenticated ? <CustomerDashboard /> : <Navigate to="/login" />} />
          <Route path="/agent-dashboard" element={isAuthenticated ? <AgentDashboard /> : <Navigate to="/login" />} />
          <Route path="/broker-dashboard" element={isAuthenticated ? <BrokerDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? getDashboardRoute() : '/login'} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
