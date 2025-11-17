import { useState } from 'react'
import './AppointmentManagement.css'

const AppointmentManagement = ({ appointments, updateAppointmentStatus }) => {
  const [activeView, setActiveView] = useState('pending')

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#48bb78'
      case 'completed': return '#38a169'
      case 'cancelled': return '#f56565'
      case 'pending': return '#f59e0b'
      default: return '#718096'
    }
  }

  const pendingAppointments = appointments.filter(apt => apt.status === 'PENDING')
  const processedAppointments = appointments.filter(apt => apt.status !== 'PENDING')

  return (
    <div className="appointment-management">
      <div className="appointment-header">
        <h2>📅 Appointment Management</h2>
        <div className="appointment-tabs">
          <button 
            className={`tab-btn ${activeView === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveView('pending')}
          >
            🔔 Pending ({pendingAppointments.length})
          </button>
          <button 
            className={`tab-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            📊 History ({processedAppointments.length})
          </button>
        </div>
      </div>

      <div className="appointment-stats">
        <div className="stat-card">
          <div className="stat-number">{pendingAppointments.length}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appointments.filter(apt => apt.status === 'CONFIRMED').length}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appointments.filter(apt => apt.status === 'COMPLETED').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appointments.filter(apt => apt.status === 'CANCELLED').length}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="appointment-content">
        {activeView === 'pending' && (
          <div className="appointments-grid">
            {pendingAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Pending Requests</h3>
                <p>All caught up! No appointment requests at the moment.</p>
              </div>
            ) : (
              pendingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card pending">
                  <div className="appointment-header-card">
                    <div className="customer-avatar">
                      {appointment.customer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <h3>👤 {appointment.customer.fullName}</h3>
                      <p>📧 {appointment.customer.email}</p>
                    </div>
                    <div className="status-badge" style={{backgroundColor: getStatusColor(appointment.status)}}>
                      {appointment.status}
                    </div>
                  </div>
                  <div className="appointment-details">
                    <p><strong>📅 Date:</strong> {new Date(appointment.appointmentDateTime).toLocaleString()}</p>
                    <p><strong>📝 Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && <p><strong>💬 Notes:</strong> {appointment.notes}</p>}
                  </div>
                  <div className="appointment-actions">
                    <button 
                      className="action-btn approve"
                      onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'history' && (
          <div className="appointments-grid">
            {processedAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No History Available</h3>
                <p>Your appointment history will appear here.</p>
              </div>
            ) : (
              processedAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card history">
                  <div className="appointment-header-card">
                    <div className="customer-avatar">
                      {appointment.customer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <h3>👤 {appointment.customer.fullName}</h3>
                      <p>📧 {appointment.customer.email}</p>
                    </div>
                    <div className="status-badge" style={{backgroundColor: getStatusColor(appointment.status)}}>
                      {appointment.status}
                    </div>
                  </div>
                  <div className="appointment-details">
                    <p><strong>📅 Date:</strong> {new Date(appointment.appointmentDateTime).toLocaleString()}</p>
                    <p><strong>📝 Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && <p><strong>💬 Notes:</strong> {appointment.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentManagement