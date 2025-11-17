import { useState, useEffect } from 'react'
import axios from 'axios'
import './PolicyComponents.css'

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8080/api/policies/applications/user/${userId}`)
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#10b981'
      case 'REJECTED': return '#ef4444'
      case 'PENDING': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  if (loading) return <div>Loading applications...</div>

  return (
    <div className="applications-container">
      <h3>My Policy Applications</h3>
      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <div className="applications-grid">
          {applications.map(app => (
            <div key={app.id} className="application-card">
              <h4>{app.policy.policyName}</h4>
              <div className="application-details">
                <p><strong>Premium:</strong> ₹{app.policy.premium}</p>
                <p><strong>Applied:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(app.status) }}>
                  {app.status}
                </div>
                {app.reason && (
                  <p><strong>Reason:</strong> {app.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApplicationStatus