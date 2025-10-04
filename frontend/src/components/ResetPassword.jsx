import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setMessage('Invalid reset token')
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}&password=${password}`)
      setMessage('Password reset successful!')
    } catch (error) {
      setMessage(error.response?.data || 'Failed to reset password')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Reset Password</h1>
        <p>Enter your new password</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  )
}

export default ResetPassword