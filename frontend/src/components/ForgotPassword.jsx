import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/forgot-password?email=${email}`)
      setMessage('Reset code sent to your email!')
      setShowReset(true)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to send reset code')
    }
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password?code=${resetCode}&password=${newPassword}`)
      setMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setMessage(error.response?.data || 'Password reset failed')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>{showReset ? 'Reset Password' : 'Forgot Password'}</h1>
        <p>{showReset ? `Enter the code sent to ${email}` : 'Enter your email to receive reset code'}</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') || message.includes('sent') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {!showReset ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>Reset Code</label>
            <input
              type="text"
              className="form-input"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  )
}

export default ForgotPassword