import { useState, useEffect } from 'react'
import axios from 'axios'
import AccountDropdown from './AccountDropdown'
import AgentAvailability from './AgentAvailability'
import PolicyManagement from './PolicyManagement'
import ApplicationReview from './ApplicationReview'
import AppointmentManagement from './AppointmentManagement'

const AgentDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const agentId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')
      if (!agentId || agentId === 'undefined') {
        console.error('No agent ID found in localStorage')
        return
      }
      const response = await axios.get(`/api/agent/appointments/${agentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/agent/appointments/${appointmentId}/status?status=${status}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAppointments()
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    window.location.href = '/login'
  }

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="navbar-brand">
          <span style={{fontSize: '1.5rem'}}>🏥 InsurAI</span>
          <span style={{color: '#718096', fontSize: '0.9rem', marginLeft: '0.5rem'}}>Agent Portal</span>
        </div>
        <div className="navbar-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <AccountDropdown userType="AGENT" onLogout={handleLogout} />
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              📋 Appointments
            </button>
            <button 
              className={`menu-item ${activeTab === 'availability' ? 'active' : ''}`}
              onClick={() => setActiveTab('availability')}
            >
              🕐 Manage Availability
            </button>
            <button 
              className={`menu-item ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              📋 Policy Management
            </button>
            <button 
              className={`menu-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              📝 Application Reviews
            </button>
            <button 
              className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
          </div>
        </div>

        <div className="main-content">
          {!localStorage.getItem('userId') || localStorage.getItem('userId') === 'undefined' ? (
            <div style={{padding: '20px', textAlign: 'center'}}>
              <h2>Please Login Again</h2>
              <p>Your session has expired. Please logout and login again to access agent features.</p>
            </div>
          ) : (activeTab === 'appointments' || activeTab === 'history') && (
            <AppointmentManagement 
              appointments={appointments}
              updateAppointmentStatus={updateAppointmentStatus}
            />
          )}

          {activeTab === 'availability' && (
            <AgentAvailability agentId={localStorage.getItem('userId')} />
          )}

          {activeTab === 'policies' && (
            <PolicyManagement />
          )}

          {activeTab === 'reviews' && (
            <ApplicationReview />
          )}


        </div>
      </div>
    </div>
  )
}

export default AgentDashboard