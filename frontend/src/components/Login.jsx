import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userRole', response.data.role)
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('fullName', response.data.fullName)
      localStorage.setItem('email', response.data.email)
      setAuth(true)
      setMessage('Login successful!')
      
      setTimeout(() => {
        if (response.data.role === 'CUSTOMER') {
          navigate('/customer-dashboard')
        } else if (response.data.role === 'AGENT') {
          navigate('/agent-dashboard')
        } else if (response.data.role === 'ADMIN') {
          navigate('/admin-dashboard')
        }
      }, 1000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
            <label>Password</label>
            <Link to="/forgot-password" style={{fontSize: '0.8rem', color: '#4299e1', textDecoration: 'none'}}>Forgot password?</Link>
          </div>
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
              👁
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span style={{color: '#718096'}}>Don't have an account?</span>
          <Link to="/register" style={{color: '#4299e1', textDecoration: 'none', fontWeight: '500'}}>Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login