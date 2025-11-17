import { useState } from 'react'
import axios from 'axios'
import './PolicyComponents.css'

const PolicyApplication = ({ policy, onClose }) => {
  const [formData, setFormData] = useState({
    documents: null,
    additionalDetails: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    if (e.target.name === 'documents') {
      setFormData({
        ...formData,
        documents: e.target.files[0]
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const userId = localStorage.getItem('userId')
      const submitData = new FormData()
      submitData.append('policyId', policy.id)
      submitData.append('additionalDetails', formData.additionalDetails)
      if (formData.documents) {
        submitData.append('documents', formData.documents)
      }
      
      await axios.post(`http://localhost:8080/api/policies/apply?userId=${userId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setMessage('Application submitted successfully!')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setMessage('Error submitting application')
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Apply for {policy.policyName}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Required Documents</label>
            <input
              type="file"
              name="documents"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
            <small>Accepted formats: PDF, DOC, DOCX, JPG, PNG</small>
          </div>

          <div className="form-group">
            <label>Additional Details</label>
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              placeholder="Any additional information..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PolicyApplication