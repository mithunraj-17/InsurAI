import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ setAuth }) => {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [jobs] = useState([
    { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Remote', salary: '$80k-120k' },
    { id: 2, title: 'Data Analyst', company: 'DataFlow', location: 'New York', salary: '$60k-90k' },
    { id: 3, title: 'Product Manager', company: 'InnovateLab', location: 'San Francisco', salary: '$100k-150k' }
  ])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ name: 'John Doe', email: 'john@example.com' })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuth(false)
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">InsurAI Platform</div>
        <div className="navbar-nav">
          <span className="nav-link">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`menu-item ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              💼 Jobs
            </button>
            <button 
              className={`menu-item ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              📝 Applications
            </button>
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h1>Dashboard Overview</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>12</h3>
                  <p>Applications Sent</p>
                </div>
                <div className="stat-card">
                  <h3>3</h3>
                  <p>Interviews Scheduled</p>
                </div>
                <div className="stat-card">
                  <h3>45</h3>
                  <p>Profile Views</p>
                </div>
                <div className="stat-card">
                  <h3>8</h3>
                  <p>Job Matches</p>
                </div>
              </div>
              
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">✅</span>
                    <span>Application submitted to TechCorp</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📅</span>
                    <span>Interview scheduled with DataFlow</span>
                    <span className="activity-time">1 day ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">👀</span>
                    <span>Profile viewed by InnovateLab</span>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="jobs">
              <h1>Available Jobs</h1>
              <div className="job-filters">
                <input type="text" placeholder="Search jobs..." className="search-input" />
                <select className="filter-select">
                  <option>All Locations</option>
                  <option>Remote</option>
                  <option>New York</option>
                  <option>San Francisco</option>
                </select>
              </div>
              
              <div className="job-list">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p className="company">{job.company}</p>
                      <p className="location">📍 {job.location}</p>
                      <p className="salary">💰 {job.salary}</p>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-primary">Apply Now</button>
                      <button className="btn btn-secondary">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="applications">
              <h1>My Applications</h1>
              <div className="application-list">
                <div className="application-card">
                  <h3>Software Engineer - TechCorp</h3>
                  <p>Applied: March 15, 2024</p>
                  <span className="status pending">Under Review</span>
                </div>
                <div className="application-card">
                  <h3>Data Analyst - DataFlow</h3>
                  <p>Applied: March 12, 2024</p>
                  <span className="status interview">Interview Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile">
              <h1>Profile Settings</h1>
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={user?.name || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+1 (555) 123-4567" className="form-input" />
                </div>
                <button className="btn btn-primary">Update Profile</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard