import { useState, useEffect } from 'react'
import './BookingHistory.css'

const BookingHistory = ({ customerId }) => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  })

  useEffect(() => {
    fetchAppointmentHistory()
  }, [customerId])

  useEffect(() => {
    applyFilters()
  }, [appointments, filters])

  const fetchAppointmentHistory = async () => {
    try {
      const response = await fetch(`/api/customer/appointments/${customerId}`)
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointment history:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...appointments]

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status.toLowerCase() === filters.status.toLowerCase())
    }

    // Filter by date range
    const now = new Date()
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDateTime)
        const daysDiff = Math.floor((now - aptDate) / (1000 * 60 * 60 * 24))
        
        switch (filters.dateRange) {
          case 'week': return daysDiff <= 7
          case 'month': return daysDiff <= 30
          case 'quarter': return daysDiff <= 90
          default: return true
        }
      })
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(apt => 
        apt.agent.fullName.toLowerCase().includes(searchLower) ||
        apt.reason.toLowerCase().includes(searchLower) ||
        (apt.notes && apt.notes.toLowerCase().includes(searchLower))
      )
    }

    setFilteredAppointments(filtered)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#28a745'
      case 'confirmed': return '#17a2b8'
      case 'cancelled': return '#dc3545'
      case 'no-show': return '#fd7e14'
      default: return '#6c757d'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading">📋 Loading appointment history...</div>
      </div>
    )
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>📋 Booking History</h2>
        <div className="history-stats">
          <span className="stat-item">Total: {appointments.length}</span>
          <span className="stat-item">Showing: {filteredAppointments.length}</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>🔍 Search:</label>
          <input
            type="text"
            placeholder="Search by agent, reason, or notes..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
          />
        </div>
        
        <div className="filter-group">
          <label>📊 Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        <div className="filter-group">
          <label>📅 Date Range:</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>
      </div>

      <div className="appointments-history">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <h3>📭 No appointments found</h3>
            <p>No appointments match your current filters.</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="history-item">
              <div className="appointment-main">
                <div className="agent-section">
                  <div className="agent-avatar">
                    {appointment.agent.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="agent-details">
                    <h4>👨‍💼 {appointment.agent.fullName}</h4>
                    <p>📧 {appointment.agent.email}</p>
                  </div>
                </div>
                
                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">📅 Date & Time:</span>
                    <span className="value">{formatDate(appointment.appointmentDateTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">📝 Reason:</span>
                    <span className="value">{appointment.reason}</span>
                  </div>
                  {appointment.notes && (
                    <div className="detail-row">
                      <span className="label">💬 Notes:</span>
                      <span className="value">{appointment.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="appointment-status-section">
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BookingHistory