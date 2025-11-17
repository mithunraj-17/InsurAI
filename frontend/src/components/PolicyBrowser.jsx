import { useState, useEffect } from 'react'
import axios from 'axios'
import './ModernUI.css'

const PolicyBrowser = ({ onApply }) => {
  const [policies, setPolicies] = useState([])
  const [filteredPolicies, setFilteredPolicies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchPolicies()
  }, [])

  useEffect(() => {
    filterPolicies()
  }, [policies, searchTerm, selectedType, priceRange, sortBy])

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/insurance/plans')
      setPolicies(response.data)
    } catch (error) {
      console.error('Error fetching policies:', error)
    }
  }

  const filterPolicies = () => {
    let filtered = policies

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.coverage.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(p => p.policyType === selectedType)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.premium >= parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.premium <= parseFloat(priceRange.max))
    }

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name': return a.policyName.localeCompare(b.policyName)
        case 'price-low': return a.premium - b.premium
        case 'price-high': return b.premium - a.premium
        case 'type': return a.policyType.localeCompare(b.policyType)
        default: return 0
      }
    })

    setFilteredPolicies(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('ALL')
    setPriceRange({ min: '', max: '' })
    setSortBy('name')
  }

  return (
    <div className="policy-browser">
      <div style={{marginBottom: '2rem'}}>
        <h2 style={{marginBottom: '0.5rem'}}>🔍 Browse Insurance Policies</h2>
        <p style={{color: 'var(--gray-500)', fontSize: '1rem'}}>Find the perfect insurance plan for your needs</p>
      </div>
      
      {/* Search Bar */}
      <div className="search-section" style={{marginBottom: '2rem'}}>
        <div style={{position: 'relative', maxWidth: '500px'}}>
          <input
            type="text"
            placeholder="🔍 Search policies by name, type, or coverage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid var(--gray-200)',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.2s',
              background: 'white'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              ❌
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls" style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        marginBottom: '2rem',
        border: '1px solid var(--gray-100)'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{margin: 0, color: 'var(--gray-800)'}}>Filters</h3>
          <button onClick={clearFilters} className="btn btn-secondary" style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}>
            🔄 Clear All
          </button>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
          {/* Policy Type Filter */}
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)'}}>Policy Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                background: 'white'
              }}
            >
              <option value="ALL">All Types</option>
              <option value="HEALTH">Health Insurance</option>
              <option value="VEHICLE">Vehicle Insurance</option>
              <option value="LIFE">Life Insurance</option>
              <option value="HOME">Home Insurance</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)'}}>Price Range (₹)</label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid var(--gray-200)',
                  borderRadius: '8px'
                }}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid var(--gray-200)',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)'}}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                background: 'white'
              }}
            >
              <option value="name">Policy Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="type">Policy Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <p style={{color: 'var(--gray-600)', margin: 0}}>
          Showing {filteredPolicies.length} of {policies.length} policies
        </p>
        {(searchTerm || selectedType !== 'ALL' || priceRange.min || priceRange.max) && (
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {searchTerm && (
              <span className="filter-tag" style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>×</button>
              </span>
            )}
            {selectedType !== 'ALL' && (
              <span className="filter-tag" style={{
                background: 'var(--secondary)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Type: {selectedType}
                <button onClick={() => setSelectedType('ALL')} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="empty-state">
          <p>No policies found matching your criteria.</p>
          <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="policies-grid">
        {filteredPolicies.map(policy => (
          <div key={policy.id} className="policy-card">
            <h3>{policy.policyName}</h3>
            <p><strong>Type:</strong> {policy.policyType}</p>
            <p><strong>Premium:</strong> ₹{policy.premium}</p>
            <p><strong>Coverage:</strong> {policy.coverage}</p>
            <p><strong>Benefits:</strong> {policy.benefits}</p>
            <button onClick={() => onApply(policy)} className="btn btn-primary">
              📝 Apply for Policy
            </button>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default PolicyBrowser