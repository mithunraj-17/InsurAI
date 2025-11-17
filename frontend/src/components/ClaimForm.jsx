import { useState } from 'react'
import axios from 'axios'
import './ModernUI.css'

const ClaimForm = ({ policy, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    claimAmount: '',
    description: '',
    documents: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const claimData = {
        policyId: policy.id,
        claimAmount: parseFloat(formData.claimAmount),
        description: formData.description,
        documents: formData.documents
      }
      
      await axios.post('http://localhost:8080/api/claims/submit', claimData)
      onSuccess()
      onClose()
    } catch (error) {
      alert('Error submitting claim: ' + (error.response?.data || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📝 File Insurance Claim</h3>
        <p><strong>Policy:</strong> {policy.insurancePlan.planName}</p>
        <p><strong>Policy Number:</strong> {policy.policyNumber}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Claim Amount (₹):</label>
            <input
              type="number"
              value={formData.claimAmount}
              onChange={(e) => setFormData({...formData, claimAmount: e.target.value})}
              max={policy.insurancePlan.coverageAmount}
              required
            />
            <small>Maximum coverage: ₹{policy.insurancePlan.coverageAmount}</small>
          </div>
          
          <div className="form-group">
            <label>Claim Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              placeholder="Describe the incident and reason for claim..."
              required
            />
          </div>
          
          <div className="form-group">
            <label>Documents (Upload URLs or descriptions):</label>
            <textarea
              value={formData.documents}
              onChange={(e) => setFormData({...formData, documents: e.target.value})}
              rows="3"
              placeholder="List documents: Hospital bills, FIR, Death certificate, Photos, etc."
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? '⏳ Submitting...' : '📤 Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClaimForm