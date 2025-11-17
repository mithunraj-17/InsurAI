import React, { useState, useEffect } from 'react';
import './AgentAvailability.css';

const AgentAvailability = ({ agentId }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    availableDate: '',
    startTime: '',
    endTime: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchAvailabilities();
  }, [agentId]);

  const fetchAvailabilities = async () => {
    try {
      if (!agentId || agentId === 'undefined') {
        console.error('No agent ID provided');
        return;
      }
      const response = await fetch(`http://localhost:8080/api/agent/availability/${agentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvailabilities(data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!agentId || agentId === 'undefined') {
        console.error('No agent ID provided');
        return;
      }
      
      const availabilityData = {
        ...newAvailability,
        availableDate: newAvailability.availableDate + 'T00:00:00'
      };
      
      const response = await fetch(`http://localhost:8080/api/agent/availability/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availabilityData)
      });
      
      if (response.ok) {
        fetchAvailabilities();
        setNewAvailability({ availableDate: '', startTime: '', endTime: '', isAvailable: true });
      }
    } catch (error) {
      console.error('Error setting availability:', error);
    }
  };

  const deleteAvailability = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/agent/availability/${id}`, { method: 'DELETE' });
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  if (!agentId || agentId === 'undefined') {
    return (
      <div className="availability-container">
        <h2>Please Login Again</h2>
        <p>Your session has expired. Please logout and login again to access this feature.</p>
      </div>
    );
  }

  return (
    <div className="availability-container">
      <h2>Manage Your Availability</h2>
      
      <form onSubmit={handleSubmit} className="availability-form">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={newAvailability.availableDate}
            onChange={(e) => setNewAvailability({...newAvailability, availableDate: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={newAvailability.startTime}
            onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={newAvailability.endTime}
            onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Set Availability</button>
      </form>

      <div className="availability-list">
        <h3>Current Availability</h3>
        {availabilities.map((availability) => (
          <div key={availability.id} className="availability-item">
            <span>{new Date(availability.availableDate).toLocaleDateString()}</span>
            <span>{availability.startTime} - {availability.endTime}</span>
            <button onClick={() => deleteAvailability(availability.id)} className="btn-delete">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentAvailability;