import { useState, useEffect } from 'react'

const AccountDropdown = ({ userType = 'USER', onLogout }) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('fullName') || `${userType} User`,
    email: localStorage.getItem('email') || `${userType.toLowerCase()}@insurai.com`,
    role: localStorage.getItem('userRole') || userType
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-menu')) {
        setShowAccountMenu(false)
      }
    }
    

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getAvatarColor = () => {
    switch(userType) {
      case 'ADMIN': return 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      case 'AGENT': return 'linear-gradient(135deg, #f59e0b, #d97706)'
      case 'CUSTOMER': return 'linear-gradient(135deg, #10b981, #059669)'
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)'
    }
  }

  return (
    <div className="account-menu" style={{position: 'relative'}}>
      <button 
        onClick={() => setShowAccountMenu(!showAccountMenu)}
        className="account-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: userType === 'ADMIN' ? 'var(--gray-700)' : 'white',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div className="avatar" style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: getAvatarColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '600',
          fontSize: '0.875rem'
        }}>
          {userInfo.name.charAt(0).toUpperCase()}
        </div>
        <div style={{textAlign: 'left'}}>
          <div style={{fontWeight: '600', fontSize: '0.875rem'}}>{userInfo.name}</div>
          <div style={{fontSize: '0.75rem', opacity: '0.8'}}>{userInfo.role}</div>
        </div>
        <span style={{fontSize: '0.75rem'}}>▼</span>
      </button>
      
      {showAccountMenu && (
        <div className="dropdown-menu" style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '0.5rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--gray-200)',
          minWidth: '200px',
          zIndex: '1000'
        }}>
          <div style={{padding: '1rem', borderBottom: '1px solid var(--gray-100)'}}>
            <div style={{fontWeight: '600', color: 'var(--gray-800)'}}>{userInfo.name}</div>
            <div style={{fontSize: '0.875rem', color: 'var(--gray-500)'}}>{userInfo.email}</div>
          </div>
          <div style={{padding: '0.5rem'}}>
            <button 
              onClick={() => setShowAccountMenu(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              👤 Account Settings
            </button>
            <button 
              onClick={() => setShowAccountMenu(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              🔔 Notifications
            </button>
            <button 
              onClick={() => setShowAccountMenu(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              ⚙️ Preferences
            </button>
            <hr style={{margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--gray-200)'}} />
            <button 
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--danger)'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--gray-50)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              🚀 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDropdown