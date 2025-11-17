import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OTPInput from './OTPInput'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER'
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState([])
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let interval
    if (showVerification && resendTimer > 0) {
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
  }, [showVerification, resendTimer])

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    if (name === 'password') {
      setPasswordErrors(validatePassword(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const invalidRequirements = passwordErrors.filter(req => !req.valid)
    if (invalidRequirements.length > 0) {
      setMessage('Please fix password requirements')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      const endpoint = formData.role === 'ADMIN' 
        ? 'http://localhost:8080/api/auth/admin/register'
        : 'http://localhost:8080/api/auth/register'
      const response = await axios.post(endpoint, formData)
      setMessage(response.data.message)
      setRegisteredEmail(formData.email)
      setShowVerification(true)
      setResendTimer(60)
      setCanResend(false)
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', role: 'CUSTOMER' })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    if (verificationCode.length !== 6) {
      setMessage('Please enter complete 6-digit code')
      return
    }
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/verify?code=${verificationCode}`)
      setMessage('Email verified successfully! You can now login.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setMessage(error.response?.data || 'Verification failed')
    }
    setLoading(false)
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/auth/resend-verification?email=${registeredEmail}`)
      setMessage('New verification code sent!')
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to resend code')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>{showVerification ? 'Verify Email' : 'Create Account'}</h1>
        <p>{showVerification ? `Enter the code sent to ${registeredEmail}` : 'Join our InsurAI platform'}</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {!showVerification ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am registering as</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
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
            <label>Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="error">Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <div className="form-group">
            <label>Verification Code</label>
            <OTPInput 
              length={6}
              onComplete={setVerificationCode}
              value={verificationCode}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          
          <div className="resend-section">
            {!canResend ? (
              <p className="resend-timer">Resend code in {resendTimer}s</p>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      )}

      <div className="auth-footer">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span style={{color: '#718096'}}>Already have an account?</span>
          <Link to="/login" style={{color: '#4299e1', textDecoration: 'none', fontWeight: '500'}}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register