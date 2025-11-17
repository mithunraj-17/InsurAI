import { useState, useEffect } from 'react'
import axios from 'axios'
import './PolicyComponents.css'

const documentSectionStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  padding: '1rem',
  marginTop: '0.5rem',
  backgroundColor: '#f8fafc'
}

const documentItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0'
}

const ApplicationReview = () => {
  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const userId = localStorage.getItem('userId')
      console.log('Fetching applications for agent:', userId)
      const response = await axios.get(`http://localhost:8080/api/policies/applications/agent/${userId}`)
      console.log('Applications fetched:', response.data)
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      console.error('Error details:', error.response?.data)
    }
    setLoading(false)
  }

  const handleProcess = async (applicationId, status, reason = '') => {
    if (processing) return
    
    setProcessing(true)
    try {
      const processedBy = localStorage.getItem('userId')
      console.log('Processing application:', { applicationId, status, reason, processedBy })
      
      const response = await axios.put(`http://localhost:8080/api/policies/applications/${applicationId}/process`, null, {
        params: { status, reason, processedBy }
      })
      
      console.log('Process response:', response.data)
      alert(`Application ${status.toLowerCase()} successfully!`)
      
      await fetchApplications()
      setSelectedApp(null)
    } catch (error) {
      console.error('Error processing application:', error)
      console.error('Error details:', error.response?.data)
      alert(`Error processing application: ${error.response?.data || error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div>Loading applications...</div>

  const pendingApplications = applications.filter(app => app.status === 'PENDING')
  const processedApplications = applications.filter(app => app.status !== 'PENDING')

  return (
    <div className="review-container">
      <div className="review-header">
        <h3>📋 Policy Applications Review</h3>
        <div className="review-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            🔔 Pending ({pendingApplications.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📊 History ({processedApplications.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div>
          {pendingApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <p>No pending applications to review.</p>
            </div>
          ) : (
            <div className="applications-list">
              {pendingApplications.map(app => (
                <div key={app.id} className="application-item pending">
                  <div className="application-summary">
                    <h4>📄 {app.policy.policyName}</h4>
                    <p>👤 <strong>Applicant:</strong> {app.user.fullName}</p>
                    <p>📧 <strong>Email:</strong> {app.user.email}</p>
                    <p>📅 <strong>Applied:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                    <span className="status-badge" style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      PENDING
                    </span>
                  </div>
                  <div className="application-actions">
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <button 
                        onClick={() => handleProcess(app.id, 'APPROVED')}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#48bb78', flex: 1, padding: '0.75rem' }}
                        disabled={processing}
                      >
                        {processing ? '⏳ Processing...' : '✅ Approve'}
                      </button>
                      <button 
                        onClick={() => {
                          const reason = prompt('Please provide a reason for rejection:')
                          if (reason) {
                            handleProcess(app.id, 'REJECTED', reason)
                          }
                        }}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#f56565', flex: 1, padding: '0.75rem' }}
                        disabled={processing}
                      >
                        {processing ? '⏳ Processing...' : '❌ Reject'}
                      </button>
                    </div>
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="btn btn-secondary"
                      style={{ width: '100%' }}
                    >
                      🔍 View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {processedApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <p>No processed applications yet.</p>
            </div>
          ) : (
            <div className="applications-list">
              {processedApplications.map(app => (
                <div key={app.id} className="application-item history">
                  <div className="application-summary">
                    <h4>📄 {app.policy.policyName}</h4>
                    <p>👤 <strong>Applicant:</strong> {app.user.fullName}</p>
                    <p>📧 <strong>Email:</strong> {app.user.email}</p>
                    <p>📅 <strong>Applied:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                    {app.processedAt && (
                      <p>✅ <strong>Processed:</strong> {new Date(app.processedAt).toLocaleDateString()}</p>
                    )}
                    <span className="status-badge" style={{
                      backgroundColor: app.status === 'APPROVED' ? '#10b981' : '#ef4444',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {app.status}
                    </span>
                  </div>
                  <div className="application-actions">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="btn btn-primary"
                    >
                      🔍 View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="close-btn">×</button>
            </div>
            
            <div className="application-details">
              <h3>{selectedApp.policy.policyName}</h3>
              <p><strong>Applicant:</strong> {selectedApp.user.fullName}</p>
              <p><strong>Email:</strong> {selectedApp.user.email}</p>
              <p><strong>Premium:</strong> ₹{selectedApp.policy.premium}</p>
              <div><strong>Documents:</strong></div>
              {selectedApp.documents ? (
                <div style={documentSectionStyle}>
                  <div style={documentItemStyle}>
                    <span>📄 {selectedApp.documents}</span>
                    <button 
                      className="btn btn-primary"
                      style={{fontSize: '0.875rem', padding: '0.25rem 0.75rem'}}
                      onClick={() => {
                        window.open(`http://localhost:8080/api/policies/documents/${encodeURIComponent(selectedApp.documents)}`, '_blank')
                      }}
                    >
                      View Document
                    </button>
                  </div>
                </div>
              ) : (
                <p>No documents submitted</p>
              )}
              <p><strong>Additional Details:</strong> {selectedApp.additionalDetails}</p>
            </div>

            <div className="review-actions">
              <button 
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationReview