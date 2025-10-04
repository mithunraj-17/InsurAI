import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', formData)
      setMessage(response.data.message)
      setRegisteredEmail(formData.email)
      setShowVerification(true)
      setResendTimer(60)
      setCanResend(false)
      setFormData({ fullName: '', email: '', password: '' })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handleVerification = async (e) => {
    e.preventDefault()
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
      await axios.post('http://localhost:8080/api/auth/register', {
        fullName: 'Resend',
        email: registeredEmail,
        password: 'temp'
      })
      setMessage('New verification code sent!')
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      setMessage('Failed to resend code')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>{showVerification ? 'Verify Email' : 'Create Account'}</h1>
        <p>{showVerification ? `Enter the code sent to ${registeredEmail}` : 'Join our job selection platform'}</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {!showVerification ? (
        <form onSubmit={handleSubmit}>
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
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              className="form-input"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
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

      <div className="auth-links">
        <div className="divider">Already have an account?</div>
        <Link to="/login">Sign In</Link>
      </div>
    </div>
  )
}

export default Register