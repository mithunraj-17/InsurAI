import { useState, useEffect } from 'react'
import axios from 'axios'
import PolicyApproval from './PolicyApproval'
import AccountDropdown from './AccountDropdown'
import VoiceChatbot from './VoiceChatbot'
import './ModernUI.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [policies, setPolicies] = useState([])
  const [applications, setApplications] = useState([])
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [userFilter, setUserFilter] = useState('ALL')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    switch(activeTab) {
      case 'users': fetchUsers(); break
      case 'policies': fetchPolicies(); break
      case 'applications': fetchApplications(); break
      case 'appointments': fetchAppointments(); break
      case 'notifications': fetchNotifications(); break
    }
  }, [activeTab])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/policies')
      setPolicies(response.data)
    } catch (error) {
      console.error('Error fetching policies:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/applications')
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/appointments')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const updateUserStatus = async (userId, active) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/status?active=${active}`)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const adminId = localStorage.getItem('userId')
      await axios.put(`http://localhost:8080/api/admin/applications/${applicationId}/override?status=${status}&reason=Admin override&adminId=${adminId}`)
      fetchApplications()
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    const reason = prompt('Reason for cancellation:')
    if (!reason) return
    
    try {
      await axios.put(`http://localhost:8080/api/admin/appointments/${appointmentId}/cancel?reason=${encodeURIComponent(reason)}`)
      fetchAppointments()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    }
  }

  const sendSystemNotification = () => {
    const title = prompt('Notification Title:')
    const message = prompt('Notification Message:')
    if (!title || !message) return
    
    alert('System notification sent: ' + title)
    // Implementation would send notification to all users
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    window.location.href = '/login'
  }

  const filteredUsers = userFilter === 'ALL' ? users : users.filter(user => user.role === userFilter)

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="navbar-brand">🛡️ InsurAI Admin Portal</div>
        <div className="navbar-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <AccountDropdown userType="ADMIN" onLogout={handleLogout} />
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard
            </button>
            <button className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              👥 Users
            </button>
            <button className={`menu-item ${activeTab === 'policies' ? 'active' : ''}`} onClick={() => setActiveTab('policies')}>
              📋 Policies
            </button>
            <button className={`menu-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
              📝 Applications
            </button>
            <button className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              📅 Appointments
            </button>
            <button className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              🔔 Notifications
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <div>
              <h2>📊 Admin Dashboard</h2>
              <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#4299e1', fontSize: '2rem', margin: '0'}}>{stats.totalUsers || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Total Users</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#48bb78', fontSize: '2rem', margin: '0'}}>{stats.totalAgents || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Total Agents</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#ed8936', fontSize: '2rem', margin: '0'}}>{stats.activePolicies || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Active Policies</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#f59e0b', fontSize: '2rem', margin: '0'}}>{stats.pendingPolicies || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Pending Policies</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#f56565', fontSize: '2rem', margin: '0'}}>{stats.pendingApplications || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Pending Applications</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#9f7aea', fontSize: '2rem', margin: '0'}}>{stats.appointmentsToday || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Appointments Today</p>
                </div>
                <div className="stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <h3 style={{color: '#38b2ac', fontSize: '2rem', margin: '0'}}>{stats.activeUsers || 0}</h3>
                  <p style={{margin: '0.5rem 0 0 0', color: '#718096'}}>Active Users</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2>👥 User Management</h2>
              <div style={{marginBottom: '1rem'}}>
                {['ALL', 'CUSTOMER', 'AGENT', 'ADMIN'].map(role => (
                  <button
                    key={role}
                    onClick={() => setUserFilter(role)}
                    style={{
                      padding: '0.5rem 1rem',
                      margin: '0 0.5rem 0.5rem 0',
                      border: '1px solid #ddd',
                      background: userFilter === role ? '#007bff' : 'white',
                      color: userFilter === role ? 'white' : 'black',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="table-container" style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead style={{background: '#f7fafc'}}>
                    <tr>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Name</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Email</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Role</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Status</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{user.fullName}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{user.email}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{user.role}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          <span className={`status-badge ${user.active ? 'status-active' : 'status-rejected'}`}>
                            {user.active ? '✅ Active' : '🚫 Suspended by Admin'}
                          </span>
                        </td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          <button 
                            onClick={() => updateUserStatus(user.id, !user.active)}
                            className={`btn ${user.active ? 'btn-danger' : 'btn-success'}`}
                          >
                            {user.active ? '🚫 Suspend' : '✅ Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <PolicyApproval />
          )}

          {activeTab === 'applications' && (
            <div>
              <h2>📝 Policy Applications</h2>
              <div className="table-container" style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead style={{background: '#f7fafc'}}>
                    <tr>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Customer</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Policy</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Status</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Date</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{app.user?.fullName || 'N/A'}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{app.policy?.policyName || 'N/A'}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          <span style={{
                            backgroundColor: app.status === 'APPROVED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          {app.status === 'PENDING' && (
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'APPROVED')}
                                style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem'}}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                                style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.25rem'}}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2>📅 Appointments</h2>
              <div className="table-container" style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead style={{background: '#f7fafc'}}>
                    <tr>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Customer</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Agent</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Date & Time</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Status</th>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{apt.customer?.fullName || 'N/A'}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>{apt.agent?.fullName || 'N/A'}</td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          {new Date(apt.appointmentDateTime).toLocaleString()}
                        </td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          <span style={{
                            backgroundColor: apt.status === 'APPROVED' ? '#10b981' : apt.status === 'REJECTED' ? '#ef4444' : '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            {apt.status}
                          </span>
                        </td>
                        <td style={{padding: '1rem', borderBottom: '1px solid #f1f5f9'}}>
                          {apt.status !== 'REJECTED' && (
                            <button 
                              onClick={() => cancelAppointment(apt.id)}
                              style={{fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.25rem'}}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2>🔔 Notifications</h2>
              <div style={{marginBottom: '1rem'}}>
                <button 
                  onClick={() => sendSystemNotification()}
                  style={{padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '0.25rem'}}
                >
                  Send System Notification
                </button>
              </div>
              <div className="applications-grid">
                {notifications.map(notif => (
                  <div key={notif.id} style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '1rem'
                  }}>
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <p><strong>To:</strong> {notif.user?.fullName || 'All Users'}</p>
                    <p><strong>Date:</strong> {new Date(notif.createdAt).toLocaleString()}</p>
                    <span style={{
                      backgroundColor: notif.read ? '#10b981' : '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {notif.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <VoiceChatbot />
    </div>
  )
}

export default AdminDashboard