import React, { useState, useEffect } from 'react';
import './AppointmentScheduling.css';

const AppointmentScheduling = ({ customerId, onAppointmentBooked }) => {
  const [allSlots, setAllSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchData, setSearchData] = useState({ date: '', time: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({ reason: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchAllSlots();
  }, []);

  const fetchAllSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/availability/all');
      const slots = await response.json();
      console.log('All available slots:', slots);
      setAllSlots(slots);
      setFilteredSlots(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAllSlots([]);
      setFilteredSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchData.date && !searchData.time) {
      setFilteredSlots(allSlots);
      return;
    }
    
    const filtered = allSlots.filter(slot => {
      const matchesDate = !searchData.date || slot.availableDate.startsWith(searchData.date);
      const matchesTime = !searchData.time || 
        (slot.startTime <= searchData.time && slot.endTime >= searchData.time);
      return matchesDate && matchesTime;
    });
    
    setFilteredSlots(filtered);
  };

  const clearSearch = () => {
    setSearchData({ date: '', time: '' });
    setFilteredSlots(allSlots);
  };



  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    
    const appointmentDateTime = selectedSlot.availableDate.split('T')[0] + 'T' + selectedSlot.startTime;
    
    const appointmentData = {
      agentId: selectedSlot.agent.id,
      availabilityId: selectedSlot.id,
      appointmentDateTime: appointmentDateTime,
      reason: bookingData.reason,
      notes: bookingData.notes
    };
    
    try {
      const response = await fetch(`http://localhost:8080/api/customer/appointments/book/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      
      if (response.ok) {
        alert('Appointment booked successfully!');
        setSelectedSlot(null);
        setBookingData({ reason: '', notes: '' });
        await fetchAllSlots();
        if (onAppointmentBooked) {
          onAppointmentBooked();
        }
      } else {
        const error = await response.text();
        alert('Booking failed: ' + error);
      }
    } catch (error) {
      alert('Error booking appointment: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="scheduling-container">
      <div className="scheduling-header">
        <h2>📅 Available Appointment Slots</h2>
        <button 
          className="btn-toggle-search"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? '❌ Hide Search' : '🔍 Search Slots'}
        </button>
      </div>
      
      {showSearch && (
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>📅 Filter by Date:</label>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>🕐 Filter by Time:</label>
              <input
                type="time"
                value={searchData.time}
                onChange={(e) => setSearchData({...searchData, time: e.target.value})}
              />
            </div>
          </div>
          <div className="search-actions">
            <button type="submit" className="btn-search">
              🔍 Filter Slots
            </button>
            <button type="button" className="btn-clear" onClick={clearSearch}>
              🔄 Show All
            </button>
          </div>
        </form>
      )}

      <div className="slots-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <p>Loading available slots...</p>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="no-results">
            <h3>😔 No Available Slots</h3>
            <p>No appointment slots are currently available. Please check back later.</p>
          </div>
        ) : (
          <div>
            <div className="slots-info">
              <p>✅ Found {filteredSlots.length} available slot{filteredSlots.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="agent-grid">
              {filteredSlots.map((slot) => {
                const initials = slot.agent && slot.agent.fullName 
                  ? slot.agent.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                  : 'AG';
                return (
                  <div key={slot.id} className="agent-card">
                    <div className="agent-header">
                      <div className="agent-avatar">{initials}</div>
                      <div className="agent-info">
                        <h3>{slot.agent?.fullName || 'Agent'}</h3>
                        <p>📧 {slot.agent?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="time-slot">
                      <strong>🕐 Available:</strong> {slot.startTime} - {slot.endTime}<br/>
                      <strong>📅 Date:</strong> {new Date(slot.availableDate).toLocaleDateString()}
                    </div>
                    <button 
                      className="btn-book" 
                      onClick={() => setSelectedSlot(slot)}
                    >
                      📅 Book This Slot
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedSlot && (
        <div className="booking-modal">
          <div className="modal-content">
            <h3>📋 Book Appointment</h3>
            <p><strong>Agent:</strong> {selectedSlot.agent.fullName}</p>
            <p><strong>Date & Time:</strong> {new Date(selectedSlot.availableDate).toLocaleDateString()} at {selectedSlot.startTime}</p>
            
            <form onSubmit={bookAppointment}>
              <div className="form-group">
                <label>Reason for Appointment:</label>
                <select
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Policy Inquiry">Policy Inquiry</option>
                  <option value="Claim Processing">Claim Processing</option>
                  <option value="New Policy">New Policy</option>
                  <option value="Policy Renewal">Policy Renewal</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Additional Notes:</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  rows="3"
                  placeholder="Any additional information..."
                />
              </div>
              
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setSelectedSlot(null)}>Cancel</button>
                <button type="submit" className="btn-confirm">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default AppointmentScheduling;