import { useState, useEffect } from 'react'
import axios from 'axios'
import PolicyBrowser from './PolicyBrowser'
import PolicyApplication from './PolicyApplication'
import AppointmentScheduling from './AppointmentScheduling'
import NotificationPanel from './NotificationPanel'
import ClaimForm from './ClaimForm'
import AccountDropdown from './AccountDropdown'
import VoiceChatbot from './VoiceChatbot'

const CustomerDashboard = () => {
  const [policies, setPolicies] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [myAppointments, setMyAppointments] = useState([])
  const [myClaims, setMyClaims] = useState([])
  const [activeTab, setActiveTab] = useState('browse')
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [showApplication, setShowApplication] = useState(false)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [appointmentView, setAppointmentView] = useState('list') // 'list' or 'schedule'

  useEffect(() => {
    fetchMyApplications()
    if (activeTab === 'appointments') {
      fetchMyAppointments()
    }
  }, [activeTab])

  const fetchMyApplications = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8080/api/policies/applications/user/${userId}`)
      setMyApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchMyAppointments = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8080/api/customer/appointments/${userId}`)
      setMyAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const handleApplyForPolicy = (policy) => {
    setSelectedPolicy(policy)
    setShowApplication(true)
  }

  const handleCloseApplication = () => {
    setShowApplication(false)
    setSelectedPolicy(null)
    fetchMyApplications()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="navbar-brand">InsurAI - Customer Portal</div>
        <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <NotificationPanel userId={localStorage.getItem('userId')} />
          <AccountDropdown userType="CUSTOMER" onLogout={handleLogout} />
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              🏥 Browse Policies
            </button>
            <button 
              className={`menu-item ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              📋 My Applications
            </button>
            <button 
              className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              📅 Appointments
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'browse' && (
            <PolicyBrowser onApply={handleApplyForPolicy} />
          )}

          {activeTab === 'applications' && (
            <div>
              <h2>📋 My Policy Applications</h2>
              {myApplications.length === 0 ? (
                <p>No applications submitted yet. Browse policies to get started!</p>
              ) : (
                <div className="applications-grid">
                  {myApplications.map(application => (
                    <div key={application.id} className="application-card" style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <h3>{application.policy.policyName}</h3>
                      <p><strong>Status:</strong> {application.status}</p>
                      <p><strong>Applied:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                      <p><strong>Premium:</strong> ₹{application.policy.premium}</p>
                      {application.status === 'REJECTED' && application.rejectionReason && (
                        <div style={{
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          padding: '0.75rem',
                          marginTop: '0.75rem'
                        }}>
                          <p style={{ margin: 0, color: '#dc2626' }}>
                            <strong>❌ Rejection Reason:</strong> {application.rejectionReason}
                          </p>
                        </div>
                      )}
                      <div className="status-badge" style={{
                        backgroundColor: application.status === 'APPROVED' ? '#10b981' : 
                                       application.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'inline-block',
                        marginTop: '0.5rem'
                      }}>
                        {application.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>📅 My Appointments</h2>
                <div>
                  <button 
                    className={`btn ${appointmentView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setAppointmentView('list')}
                    style={{ marginRight: '0.5rem' }}
                  >
                    📋 My Appointments
                  </button>
                  <button 
                    className={`btn ${appointmentView === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setAppointmentView('schedule')}
                  >
                    ➕ Book New
                  </button>
                </div>
              </div>

              {appointmentView === 'list' && (
                <div>
                  {myAppointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                      <p>No appointments scheduled yet.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setAppointmentView('schedule')}
                      >
                        📅 Schedule Your First Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="applications-grid">
                      {myAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card" style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          padding: '1.5rem',
                          marginBottom: '1rem',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>👨‍💼 {appointment.agent.fullName}</h3>
                              <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                                <strong>📧 Email:</strong> {appointment.agent.email}
                              </p>
                              <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                                <strong>📅 Date & Time:</strong> {new Date(appointment.appointmentDateTime).toLocaleString()}
                              </p>
                              <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                                <strong>📝 Reason:</strong> {appointment.reason}
                              </p>
                              {appointment.notes && (
                                <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                                  <strong>📋 Notes:</strong> {appointment.notes}
                                </p>
                              )}
                            </div>
                            <div className="status-badge" style={{
                              backgroundColor: appointment.status === 'APPROVED' ? '#10b981' : 
                                             appointment.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '1rem',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {appointment.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {appointmentView === 'schedule' && (
                <AppointmentScheduling 
                  customerId={localStorage.getItem('userId')} 
                  onAppointmentBooked={() => {
                    fetchMyAppointments()
                    setAppointmentView('list')
                  }}
                />
              )}
            </div>
          )}
        </div>

        {showApplication && selectedPolicy && (
          <PolicyApplication 
            policy={selectedPolicy} 
            onClose={handleCloseApplication} 
          />
        )}
      </div>
      
      <VoiceChatbot />
    </div>
  )
}

export default CustomerDashboard