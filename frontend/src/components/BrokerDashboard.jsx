import { useState, useEffect } from 'react'
import axios from 'axios'

const BrokerDashboard = () => {
  const [policies, setPolicies] = useState([])
  const [customers, setCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchBrokerData()
  }, [])

  const fetchBrokerData = async () => {
    try {
      const brokerId = localStorage.getItem('userId')
      // Fetch policies handled by this broker
      const response = await axios.get(`/api/insurance/policies/broker/${brokerId}`)
      setPolicies(response.data)
    } catch (error) {
      console.error('Error fetching broker data:', error)
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
        <div className="navbar-brand">🏢 InsurAI - Broker Portal</div>
        <div className="navbar-nav">
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              👥 My Clients
            </button>
            <button 
              className={`menu-item ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              📋 Policies Sold
            </button>
            <button 
              className={`menu-item ${activeTab === 'commission' ? 'active' : ''}`}
              onClick={() => setActiveTab('commission')}
            >
              💰 Commission
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div>
              <h2>📊 Broker Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{policies.length}</h3>
                  <p>Total Policies</p>
                </div>
                <div className="stat-card">
                  <h3>{policies.filter(p => p.status === 'ACTIVE').length}</h3>
                  <p>Active Policies</p>
                </div>
                <div className="stat-card">
                  <h3>₹{policies.reduce((sum, p) => sum + p.premiumPaid, 0)}</h3>
                  <p>Total Premium</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div>
              <h2>📋 Policies Sold</h2>
              {policies.length === 0 ? (
                <p>No policies sold yet.</p>
              ) : (
                <div className="policies-grid">
                  {policies.map(policy => (
                    <div key={policy.id} className="policy-card">
                      <h3>{policy.insurancePlan.planName}</h3>
                      <p>Customer: {policy.customer.fullName}</p>
                      <p>Policy: {policy.policyNumber}</p>
                      <p>Status: {policy.status}</p>
                      <p>Premium: ₹{policy.premiumPaid}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'commission' && (
            <div>
              <h2>💰 Commission Tracking</h2>
              <p>Commission tracking feature coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrokerDashboard