import { useState, useEffect } from 'react'
import axios from 'axios'
import './Insurance.css'

const InsurancePlans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('ALL')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/insurance/plans')
      setPlans(response.data)
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = selectedType === 'ALL' 
    ? plans 
    : plans.filter(plan => plan.planType === selectedType)

  if (loading) return <div>Loading insurance plans...</div>

  return (
    <div className="insurance-plans">
      <h2>🏥 Insurance Plans</h2>
      
      <div className="filter-tabs">
        {['ALL', 'HEALTH', 'VEHICLE', 'LIFE'].map(type => (
          <button
            key={type}
            className={`filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="plans-grid">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.planName}</h3>
            <p className="plan-type">{plan.planType}</p>
            <p className="premium">₹{plan.premiumAmount}/month</p>
            <p className="coverage">Coverage: ₹{plan.coverageAmount}</p>
            <p className="validity">{plan.validityPeriodMonths} months</p>
            <button className="btn btn-primary">Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsurancePlans