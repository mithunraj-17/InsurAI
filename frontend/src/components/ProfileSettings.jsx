import { useState, useEffect } from 'react'
import axios from 'axios'
import './ModernUI.css'

const ProfileSettings = ({ onClose }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    profilePicture: null
  })
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    setProfile({
      fullName: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('email') || '',
      profilePicture: localStorage.getItem('profilePicture') || null
    })
    setPreviewImage(localStorage.getItem('profilePicture'))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
        setProfile({...profile, profilePicture: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const userId = localStorage.getItem('userId')
      const updateData = {
        fullName: profile.fullName,
        email: profile.email,
        profilePicture: profile.profilePicture
      }
      
      await axios.put(`http://localhost:8080/api/auth/profile/${userId}`, updateData)
      
      // Update localStorage
      localStorage.setItem('fullName', profile.fullName)
      localStorage.setItem('email', profile.email)
      if (profile.profilePicture) {
        localStorage.setItem('profilePicture', profile.profilePicture)
      }
      
      alert('Profile updated successfully!')
      onClose()
    } catch (error) {
      alert('Error updating profile: ' + (error.response?.data || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>👤 Profile Settings</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="profile-pic-section">
              <div className="current-avatar" style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: previewImage ? `url(${previewImage})` : 'linear-gradient(135deg, #f59e0b, #d97706)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                {!previewImage && profile.fullName.charAt(0).toUpperCase()}
              </div>
              
              <div className="upload-section">
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="profilePic" className="btn btn-secondary">
                  📷 Change Photo
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null)
                      setProfile({...profile, profilePicture: null})
                    }}
                    className="btn btn-danger"
                    style={{ marginLeft: '0.5rem' }}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              ❌ Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? '⏳ Updating...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettings