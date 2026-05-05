import React, { useState, useEffect } from 'react';
import { fetchIncidents, fetchTasks, createTask, fetchVolunteers } from '../api';
import { connectWebSocket } from '../websocket';
import MapView from '../components/MapView';
import toast from 'react-hot-toast';

const AuthorityDashboard = ({ user }) => {
    const [incidents, setIncidents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', volunteerId: '', incidentId: '' });

    useEffect(() => {
        const loadData = async () => {
            setIncidents(await fetchIncidents());
            setTasks(await fetchTasks());
            setVolunteers(await fetchVolunteers());
        };
        loadData();

        connectWebSocket((newIncident) => {
            setIncidents(prev => {
                if (prev.find(i => i.id === newIncident.id)) return prev;
                toast(`New ${newIncident.type} reported!`, { icon: '🚨' });
                return [...prev, newIncident];
            });
        }, (newTask) => {
            setTasks(prev => {
                const exists = prev.find(t => t.id === newTask.id);
                if (exists) {
                    if (exists.status !== newTask.status) {
                        toast(`Task "${newTask.title}" status changed to ${newTask.status}`, { icon: '🔄' });
                    }
                    return prev.map(t => t.id === newTask.id ? newTask : t);
                }
                return [...prev, newTask];
            });
        });
    }, []);

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (!taskForm.volunteerId) {
            toast.error("Please select a volunteer!");
            return;
        }
        try {
            await createTask({
                title: taskForm.title,
                description: taskForm.description,
                assignedVolunteer: { id: parseInt(taskForm.volunteerId) },
                relatedIncident: taskForm.incidentId ? { id: parseInt(taskForm.incidentId) } : null
            });
            setTaskForm({ title: '', description: '', volunteerId: '', incidentId: '' });
            toast.success("Task assigned successfully!");
        } catch (err) {
            toast.error("Failed to assign task.");
        }
    };

    return (
        <div className="dashboard-grid animate-fade-in" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="card glass">
                <h3 style={{ marginBottom: '1rem' }}>Global Heatmap & Incidents</h3>
                <MapView incidents={incidents} />
                
                <div style={{ marginTop: '1.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {incidents.map((inc, index) => (
                        <div key={inc.id} className="list-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>ID {inc.id}: {inc.type}</strong>
                                <span className={`status-badge ${inc.severity === 'HIGH' ? 'status-danger' : 'status-pending'}`}>
                                    {inc.severity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="card glass">
                <h3 style={{ marginBottom: '1.5rem' }}>Assign Resources & Tasks</h3>
                <form onSubmit={handleAssignTask} style={{ marginBottom: '2.5rem' }}>
                    <label>Task Title</label>
                    <input className="input-field" placeholder="Enter Task Title" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required />
                    
                    <label>Task Details</label>
                    <textarea className="input-field" placeholder="Provide instructions..." value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} required></textarea>
                    
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Assign To</label>
                            <select className="input-field" value={taskForm.volunteerId} onChange={e => setTaskForm({...taskForm, volunteerId: e.target.value})} required>
                                <option value="">Select Volunteer...</option>
                                {volunteers.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.phone})</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Related Incident</label>
                            <select className="input-field" value={taskForm.incidentId} onChange={e => setTaskForm({...taskForm, incidentId: e.target.value})}>
                                <option value="">Select Incident (Optional)...</option>
                                {incidents.map(inc => (
                                    <option key={inc.id} value={inc.id}>ID {inc.id}: {inc.type} - {inc.severity}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Dispatch Volunteer</button>
                </form>
                
                <h3 style={{ marginBottom: '1.5rem' }}>Task Tracker</h3>
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {tasks.map((task, index) => (
                        <div key={task.id} className="list-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>{task.title}</strong>
                                <span className={`status-badge ${task.status === 'COMPLETED' ? 'status-completed' : task.status === 'IN_PROGRESS' ? 'status-progress' : 'status-pending'}`}>
                                    {task.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Assigned to: <span style={{ color: 'var(--text-main)' }}>{task.assignedVolunteer ? task.assignedVolunteer.name : 'Unknown'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthorityDashboard;
