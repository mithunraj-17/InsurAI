import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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
      const response = await axios.post('http://localhost:8080/api/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      setAuth(true)
      setMessage('Login successful!')
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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password">Forgot your password?</Link>
        <div className="divider">Don't have an account?</div>
        <Link to="/register">Create Account</Link>
      </div>
    </div>
  )
}

export default Login