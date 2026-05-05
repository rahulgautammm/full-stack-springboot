import React, { useState, useEffect } from 'react';
import { createIncident, fetchIncidents } from '../api';
import { connectWebSocket } from '../websocket';
import MapView from '../components/MapView';
import toast from 'react-hot-toast';

const CitizenDashboard = ({ user }) => {
    const [incidents, setIncidents] = useState([]);
    const [form, setForm] = useState({ type: 'FLOOD', description: '', severity: 'HIGH' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadIncidents = async () => {
            const data = await fetchIncidents();
            setIncidents(data);
        };
        loadIncidents();

        connectWebSocket((newIncident) => {
            setIncidents(prev => {
                if (prev.find(i => i.id === newIncident.id)) return prev;
                return [...prev, newIncident];
            });
        }, null);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock location for simplicity
            const newIncident = {
                ...form,
                latitude: 20.5937 + (Math.random() * 2 - 1),
                longitude: 78.9629 + (Math.random() * 2 - 1),
                reporter: { id: user.id }
            };
            await createIncident(newIncident);
            setForm({ ...form, description: '' });
            toast.success("Incident reported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to report incident.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-grid animate-fade-in" style={{ gridTemplateColumns: '1fr' }}>
            <div className="card glass" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>🚨 Report Emergency Incident</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Incident Type</label>
                            <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                <option value="FLOOD">Flood</option>
                                <option value="EARTHQUAKE">Earthquake</option>
                                <option value="FIRE">Fire</option>
                                <option value="ROAD_BLOCK">Road Block</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Severity</label>
                            <select className="input-field" value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
                                <option value="HIGH">High (Immediate Help Needed)</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>
                    </div>

                    <label>Description</label>
                    <textarea 
                        className="input-field" 
                        rows="4" 
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        required
                        placeholder="Describe the situation..."
                    ></textarea>

                    <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                        {loading ? 'Sending SOS...' : 'Broadcast SOS Report'}
                    </button>
                </form>
            </div>
            
            <div className="card glass">
                <h3 style={{ marginBottom: '1rem' }}>Live Incidents Map</h3>
                <MapView incidents={incidents} />
            </div>
        </div>
    );
};

export default CitizenDashboard;
