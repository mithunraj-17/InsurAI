import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token')

  const validatePassword = (password) => {
    const requirements = [
      { text: 'At least 8 characters', valid: password.length >= 8 },
      { text: 'One lowercase letter', valid: /[a-z]/.test(password) },
      { text: 'One uppercase letter', valid: /[A-Z]/.test(password) },
      { text: 'One number', valid: /\d/.test(password) },
      { text: 'One special character (@$!%*?&)', valid: /[@$!%*?&]/.test(password) }
    ]
    return requirements
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordErrors(validatePassword(newPassword))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setMessage('Invalid reset token')
      return
    }
    
    const invalidRequirements = passwordErrors.filter(req => !req.valid)
    if (invalidRequirements.length > 0) {
      setMessage('Please fix password requirements')
      return
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        code: token,
        password: password,
        confirmPassword: confirmPassword
      })
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
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>
          {password && (
            <div className="password-requirements">
              <p>Password Requirements:</p>
              <ul>
                {passwordErrors.map((req, index) => (
                  <li key={index} className={req.valid ? 'success' : 'error'}>
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              👁
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="error">Passwords do not match</p>
          )}
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