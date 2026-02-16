import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [agentsRes, metricsRes] = await Promise.all([
        fetch(`${API_URL}/api/agents`),
        fetch(`${API_URL}/api/metrics`)
      ]);
      setAgents(await agentsRes.json());
      setMetrics(await metricsRes.json());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏭 EmpireEngine Dashboard</h1>
        <p>Full-stack profiling dashboard for Empire Engine agent ecosystem</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Agents</h3>
          <div className="metric-value">{metrics?.total_agents}</div>
        </div>
        <div className="metric-card">
          <h3>Active Agents</h3>
          <div className="metric-value active">{metrics?.active_agents}</div>
        </div>
        <div className="metric-card">
          <h3>Avg Performance</h3>
          <div className="metric-value">{metrics?.avg_performance}%</div>
        </div>
        <div className="metric-card">
          <h3>Total Tasks</h3>
          <div className="metric-value">{metrics?.total_tasks}</div>
        </div>
      </div>

      <div className="agents-section">
        <h2>Agents Overview</h2>
        <div className="agents-grid">
          {agents.map(agent => (
            <div key={agent.id} className={`agent-card ${agent.status}`}>
              <div className="agent-header">
                <h3>{agent.name}</h3>
                <span className={`status-badge ${agent.status}`}>
                  {agent.status}
                </span>
              </div>
              <div className="agent-details">
                <p><strong>Type:</strong> {agent.type}</p>
                <p><strong>Performance:</strong> {agent.performance}%</p>
                <p><strong>Last Active:</strong> {new Date(agent.last_active).toLocaleTimeString()}</p>
              </div>
              <div className="performance-bar">
                <div 
                  className="performance-fill" 
                  style={{width: `${agent.performance}%`}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
