import { useState, useEffect } from 'react'
import axios from 'axios'
import './NotificationPanel.css'

const NotificationPanel = ({ userId }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUnreadCount()
      if (showPanel) {
        fetchNotifications()
      }
    }
  }, [userId, showPanel])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([]) // Set empty array if can't fetch
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/${userId}/count`)
      setUnreadCount(response.data)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      setUnreadCount(0) // Set to 0 if can't fetch
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${notificationId}/read`)
      fetchNotifications()
      fetchUnreadCount()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/user/${userId}/read-all`)
      fetchNotifications()
      fetchUnreadCount()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING': return '📅'
      case 'STATUS_UPDATE': return '🔔'
      case 'REMINDER': return '⏰'
      default: return '📢'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="notification-container">
      <button 
        className="notification-bell"
        onClick={() => setShowPanel(!showPanel)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showPanel && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark All Read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="loading">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <div className="empty-icon">📭</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel