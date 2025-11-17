import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OTPInput from './OTPInput'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [codeValidated, setCodeValidated] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let interval
    if (showCodeInput && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showCodeInput, resendTimer])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/forgot-password?email=${email}`)
      setMessage('Reset code sent to your email!')
      setShowCodeInput(true)
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to send reset code')
    }
    setLoading(false)
  }

  const handleResendResetCode = async () => {
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/resend-reset-code?email=${email}`)
      setMessage('New reset code sent!')
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to resend code')
    }
    setLoading(false)
  }

  const handleCodeValidation = async (e) => {
    e.preventDefault()
    if (resetCode.length !== 6) {
      setMessage('Please enter complete 6-digit code')
      return
    }
    setLoading(true)
    console.log('Validating reset code:', resetCode)
    try {
      const response = await axios.post('http://localhost:8080/api/auth/validate-reset-code', { code: resetCode })
      console.log('Code validation response:', response.data)
      setMessage('Code validated! Now set your new password.')
      setCodeValidated(true)
      setShowPasswordReset(true)
    } catch (error) {
      console.error('Code validation error:', error.response?.data)
      setMessage(error.response?.data || 'Invalid or expired code')
    }
    setLoading(false)
  }

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
    const password = e.target.value
    setNewPassword(password)
    setPasswordErrors(validatePassword(password))
  }

  const handleReset = async (e) => {
    e.preventDefault()
    
    const invalidRequirements = passwordErrors.filter(req => !req.valid)
    if (invalidRequirements.length > 0) {
      setMessage('Please fix password requirements')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        code: resetCode,
        password: newPassword,
        confirmPassword: confirmPassword
      })
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
        <h1>
          {!showCodeInput ? 'Forgot Password' : 
           !showPasswordReset ? 'Verify Code' : 'Reset Password'}
        </h1>
        <p>
          {!showCodeInput ? 'Enter your email to receive reset code' :
           !showPasswordReset ? `Enter the code sent to ${email}` :
           'Enter your new password'}
        </p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') || message.includes('sent') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {!showCodeInput ? (
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
      ) : !showPasswordReset ? (
        <form onSubmit={handleCodeValidation}>
          <div className="form-group">
            <label>Reset Code</label>
            <OTPInput 
              length={6}
              onComplete={setResetCode}
              value={resetCode}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Validating...' : 'Validate Code'}
          </button>
          
          <div className="resend-section">
            {!canResend ? (
              <p className="resend-timer">Resend code in {resendTimer}s</p>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResendResetCode}
                disabled={loading}
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {newPassword && (
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
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="error">Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span style={{color: '#718096'}}>Remember your password?</span>
          <Link to="/login" style={{color: '#4299e1', textDecoration: 'none', fontWeight: '500'}}>Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword