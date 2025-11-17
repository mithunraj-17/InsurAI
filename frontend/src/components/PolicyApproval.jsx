import { useState, useEffect } from 'react'
import axios from 'axios'
import './ModernUI.css'

const PolicyApproval = () => {
  const [pendingPolicies, setPendingPolicies] = useState([])
  const [allPolicies, setAllPolicies] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingPolicies()
    } else {
      fetchAllPolicies()
    }
  }, [activeTab])

  const fetchPendingPolicies = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/admin/policies/pending')
      setPendingPolicies(response.data)
    } catch (error) {
      console.error('Error fetching pending policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllPolicies = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/admin/policies')
      setAllPolicies(response.data)
    } catch (error) {
      console.error('Error fetching all policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (policyId) => {
    try {
      const adminId = localStorage.getItem('userId')
      await axios.put(`http://localhost:8080/api/admin/policies/${policyId}/approve?adminId=${adminId}`)
      alert('Policy approved successfully!')
      fetchPendingPolicies()
    } catch (error) {
      alert('Error approving policy: ' + (error.response?.data || error.message))
    }
  }

  const handleReject = async (policyId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      const adminId = localStorage.getItem('userId')
      await axios.put(`http://localhost:8080/api/admin/policies/${policyId}/reject?adminId=${adminId}&reason=${encodeURIComponent(reason)}`)
      alert('Policy rejected successfully!')
      fetchPendingPolicies()
    } catch (error) {
      alert('Error rejecting policy: ' + (error.response?.data || error.message))
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING_APPROVAL': '#f59e0b',
      'ACTIVE': '#10b981',
      'INACTIVE': '#ef4444',
      'BLOCKED': '#6b7280'
    }
    
    return (
      <span style={{
        backgroundColor: colors[status] || '#6b7280',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (loading) return <div>Loading policies...</div>

  return (
    <div className="policy-approval">
      <h2>🏛️ Policy Management</h2>
      
      <div className="filter-tabs">
        <button
          className={`filter-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approval ({pendingPolicies.length})
        </button>
        <button
          className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Policies
        </button>
      </div>

      {activeTab === 'pending' && (
        <div>
          {pendingPolicies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
              <p>✅ No policies pending approval!</p>
            </div>
          ) : (
            <div className="policies-grid">
              {pendingPolicies.map(policy => (
                <div key={policy.id} className="policy-card" style={{ border: '2px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3>{policy.policyName}</h3>
                    {getStatusBadge(policy.status)}
                  </div>
                  
                  <p><strong>Type:</strong> {policy.policyType}</p>
                  <p><strong>Premium:</strong> ₹{policy.premium}</p>
                  <p><strong>Coverage:</strong> {policy.coverage}</p>
                  <p><strong>Benefits:</strong> {policy.benefits}</p>
                  <p><strong>Created by:</strong> {policy.agent.fullName} ({policy.agent.email})</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => handleApprove(policy.id)}
                      className="btn btn-primary"
                      style={{ backgroundColor: '#10b981', flex: 1 }}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => handleReject(policy.id)}
                      className="btn btn-secondary"
                      style={{ backgroundColor: '#ef4444', flex: 1 }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div className="policies-grid">
          {allPolicies.map(policy => (
            <div key={policy.id} className="policy-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3>{policy.policyName}</h3>
                {getStatusBadge(policy.status)}
              </div>
              
              <p><strong>Type:</strong> {policy.policyType}</p>
              <p><strong>Premium:</strong> ₹{policy.premium}</p>
              <p><strong>Coverage:</strong> {policy.coverage}</p>
              <p><strong>Created by:</strong> {policy.agent.fullName}</p>
              
              {policy.status === 'PENDING_APPROVAL' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleApprove(policy.id)}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#10b981', flex: 1 }}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(policy.id)}
                    className="btn btn-secondary"
                    style={{ backgroundColor: '#ef4444', flex: 1 }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PolicyApproval