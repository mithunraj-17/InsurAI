import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './ModernUI.css'

const AgentAnalytics = ({ agentId }) => {
  const [analytics, setAnalytics] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalPolicies: 0,
    activePolicies: 0,
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0
  })
  const [loading, setLoading] = useState(true)
  const appointmentChartRef = useRef(null)
  const applicationChartRef = useRef(null)
  const policyChartRef = useRef(null)

  useEffect(() => {
    if (agentId) {
      fetchAnalytics()
    }
  }, [agentId])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch appointments
      const appointmentsResponse = await axios.get(`http://localhost:8080/api/agent/appointments/${agentId}`)
      const appointments = appointmentsResponse.data

      // Fetch policies
      const policiesResponse = await axios.get(`http://localhost:8080/api/policies/agent/${agentId}`)
      const policies = policiesResponse.data

      // Fetch applications
      const applicationsResponse = await axios.get(`http://localhost:8080/api/policies/applications/agent/${agentId}`)
      const applications = applicationsResponse.data

      // Calculate analytics
      const completedAppointments = appointments.filter(apt => apt.status === 'APPROVED').length
      const pendingAppointments = appointments.filter(apt => apt.status === 'PENDING').length
      const activePolicies = policies.filter(policy => policy.status === 'ACTIVE').length
      const approvedApplications = applications.filter(app => app.status === 'APPROVED').length
      const rejectedApplications = applications.filter(app => app.status === 'REJECTED').length
      const pendingApplications = applications.filter(app => app.status === 'PENDING').length

      setAnalytics({
        totalAppointments: appointments.length,
        completedAppointments,
        pendingAppointments,
        totalPolicies: policies.length,
        activePolicies,
        totalApplications: applications.length,
        approvedApplications,
        rejectedApplications,
        pendingApplications
      })
      
      // Create charts after data is set
      setTimeout(() => {
        createCharts({
          appointments: { completed: completedAppointments, pending: pendingAppointments },
          applications: { approved: approvedApplications, rejected: rejectedApplications, pending: pendingApplications },
          policies: { active: activePolicies, inactive: policies.length - activePolicies }
        })
      }, 100)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCharts = (data) => {
    // Appointment Chart
    if (appointmentChartRef.current) {
      const ctx = appointmentChartRef.current.getContext('2d')
      new window.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [data.appointments.completed, data.appointments.pending],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Appointments Status' }
          }
        }
      })
    }

    // Application Chart
    if (applicationChartRef.current) {
      const ctx = applicationChartRef.current.getContext('2d')
      new window.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Approved', 'Rejected', 'Pending'],
          datasets: [{
            data: [data.applications.approved, data.applications.rejected, data.applications.pending],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Applications Status' }
          }
        }
      })
    }

    // Policy Chart
    if (policyChartRef.current) {
      const ctx = policyChartRef.current.getContext('2d')
      new window.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Active', 'Inactive'],
          datasets: [{
            data: [data.policies.active, data.policies.inactive],
            backgroundColor: ['#10b981', '#6b7280'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Policies Status' }
          }
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📈 Agent Analytics Dashboard</h2>
        <p>Overview of your performance and activities</p>
      </div>

      <div className="analytics-actions" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button className="btn btn-primary" onClick={fetchAnalytics}>
          🔄 Refresh Analytics
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <canvas ref={appointmentChartRef} width="400" height="400"></canvas>
        </div>
        <div className="chart-container">
          <canvas ref={applicationChartRef} width="400" height="400"></canvas>
        </div>
        <div className="chart-container">
          <canvas ref={policyChartRef} width="400" height="400"></canvas>
        </div>
      </div>

      <style jsx>{`
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        .chart-container {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .chart-container canvas {
          max-width: 100%;
          height: auto;
        }
      `}</style>
      
    </div>
  )
}

export default AgentAnalytics