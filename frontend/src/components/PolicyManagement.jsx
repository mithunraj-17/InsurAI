import { useState, useEffect } from 'react'
import axios from 'axios'
import './PolicyComponents.css'

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    policyName: '',
    premium: '',
    policyType: '',
    coverage: '',
    benefits: '',
    terms: '',
    conditions: ''
  })

  useEffect(() => {
    fetchAgentPolicies()
  }, [])

  const fetchAgentPolicies = async () => {
    try {
      const agentId = localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8080/api/policies/agent/${agentId}`)
      setPolicies(response.data)
    } catch (error) {
      console.error('Error fetching policies:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.policyName || !formData.premium || !formData.policyType || 
        !formData.coverage || !formData.benefits || !formData.terms || !formData.conditions) {
      alert('Please fill in all required fields')
      return
    }
    
    try {
      const agentId = localStorage.getItem('userId')
      const policyData = {
        policyName: formData.policyName,
        premium: parseFloat(formData.premium),
        policyType: formData.policyType,
        coverage: formData.coverage,
        benefits: formData.benefits,
        terms: formData.terms,
        conditions: formData.conditions
      }
      
      console.log('Sending policy data:', policyData)
      
      await axios.post(`http://localhost:8080/api/policies/create?agentId=${agentId}`, policyData)
      setShowCreateForm(false)
      setFormData({
        policyName: '',
        premium: '',
        policyType: '',
        coverage: '',
        benefits: '',
        terms: '',
        conditions: ''
      })
      fetchAgentPolicies()
    } catch (error) {
      console.error('Error creating policy:', error)
      const errorMsg = error.response?.data || error.response?.statusText || error.message
      alert('Error creating policy: ' + errorMsg)
      console.error('Full error:', error.response)
    }
  }

  return (
    <div className="policy-management">
      <div className="section">
        <div className="section-header">
          <h2>My Policies</h2>
          <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
            Create New Policy
          </button>
        </div>

        {policies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
            <p>No policies created yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              📄 Create Your First Policy
            </button>
          </div>
        ) : (
          <div className="policies-grid">
            {policies.map(policy => (
              <div key={policy.id} className="policy-card">
                <h3>📄 {policy.policyName}</h3>
                <p><strong>Type:</strong> {policy.policyType}</p>
                <p><strong>Premium:</strong> ₹{policy.premium}</p>
                <p><strong>Status:</strong> 
                  <span className="status-badge" style={{
                    backgroundColor: policy.status === 'ACTIVE' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem'
                  }}>
                    {policy.status}
                  </span>
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <p><strong>Coverage:</strong> {policy.coverage.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Policy</h2>
              <button onClick={() => setShowCreateForm(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Policy Name</label>
                <input
                  type="text"
                  name="policyName"
                  value={formData.policyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Premium</label>
                <input
                  type="number"
                  name="premium"
                  value={formData.premium}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Policy Type</label>
                <input
                  type="text"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Coverage</label>
                <textarea
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Terms</label>
                <textarea
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Conditions</label>
                <textarea
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PolicyManagement