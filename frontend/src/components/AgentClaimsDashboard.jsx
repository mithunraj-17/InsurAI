import { useState, useEffect } from 'react'
import axios from 'axios'
import './Insurance.css'

const AgentClaimsDashboard = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const response = await axios.get('/api/claims/all')
      setClaims(response.data)
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateClaimStatus = async (claimId, status, remarks = '') => {
    try {
      await axios.put(`/api/claims/${claimId}/status?status=${status}&remarks=${encodeURIComponent(remarks)}`)
      fetchClaims()
    } catch (error) {
      alert('Error updating claim: ' + (error.response?.data || error.message))
    }
  }

  const handleApprove = (claimId) => {
    const remarks = prompt('Add approval remarks (optional):')
    updateClaimStatus(claimId, 'APPROVED', remarks || '')
  }

  const handleReject = (claimId) => {
    const remarks = prompt('Add rejection reason:')
    if (remarks) {
      updateClaimStatus(claimId, 'REJECTED', remarks)
    }
  }

  const handleReview = (claimId) => {
    const remarks = prompt('Add review comments:')
    updateClaimStatus(claimId, 'UNDER_REVIEW', remarks || '')
  }

  if (loading) return <div>Loading claims...</div>

  return (
    <div>
      <h2>🔍 Claims Review Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{claims.filter(c => c.status === 'SUBMITTED').length}</h3>
          <p>New Claims</p>
        </div>
        <div className="stat-card">
          <h3>{claims.filter(c => c.status === 'UNDER_REVIEW').length}</h3>
          <p>Under Review</p>
        </div>
        <div className="stat-card">
          <h3>{claims.filter(c => c.status === 'APPROVED').length}</h3>
          <p>Approved</p>
        </div>
      </div>

      <div className="claims-grid">
        {claims.map(claim => (
          <div key={claim.id} className="claim-card">
            <h3>Claim #{claim.claimNumber}</h3>
            <p><strong>Customer:</strong> {claim.policy.customer.fullName}</p>
            <p><strong>Policy:</strong> {claim.policy.insurancePlan.planName}</p>
            <p><strong>Amount:</strong> ₹{claim.claimAmount}</p>
            <p><strong>Status:</strong> {claim.status}</p>
            <p><strong>Description:</strong> {claim.description}</p>
            {claim.documents && (
              <p><strong>Documents:</strong> {claim.documents}</p>
            )}
            {claim.adminRemarks && (
              <p><strong>Remarks:</strong> {claim.adminRemarks}</p>
            )}
            
            <div className="claim-actions" style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
              {claim.status === 'SUBMITTED' && (
                <>
                  <button 
                    onClick={() => handleReview(claim.id)}
                    className="btn btn-secondary"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}}
                  >
                    📋 Review
                  </button>
                  <button 
                    onClick={() => handleApprove(claim.id)}
                    className="btn btn-primary"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#10b981'}}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(claim.id)}
                    className="btn btn-primary"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#ef4444'}}
                  >
                    ❌ Reject
                  </button>
                </>
              )}
              {claim.status === 'UNDER_REVIEW' && (
                <>
                  <button 
                    onClick={() => handleApprove(claim.id)}
                    className="btn btn-primary"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#10b981'}}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(claim.id)}
                    className="btn btn-primary"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#ef4444'}}
                  >
                    ❌ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgentClaimsDashboard