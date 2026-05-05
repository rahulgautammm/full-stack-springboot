import React, { useState, useEffect } from 'react';
import { fetchVolunteerTasks, updateTaskStatus } from '../api';
import { connectWebSocket } from '../websocket';
import toast from 'react-hot-toast';

const VolunteerDashboard = ({ user }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadTasks = async () => {
            const data = await fetchVolunteerTasks(user.id);
            setTasks(data);
        };
        loadTasks();

        connectWebSocket(null, (newTask) => {
            if (newTask.assignedVolunteer && newTask.assignedVolunteer.id === user.id) {
                setTasks(prev => {
                    const exists = prev.find(t => t.id === newTask.id);
                    if (exists) {
                        return prev.map(t => t.id === newTask.id ? newTask : t);
                    }
                    toast(`New Task Assigned: ${newTask.title}`, { icon: '📋' });
                    return [...prev, newTask];
                });
            }
        });
    }, [user.id]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            // Local state update (optimistic)
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            toast.success("Status updated!");
        } catch (err) {
            toast.error('Failed to update task status.');
        }
    };

    return (
        <div className="dashboard-grid animate-fade-in" style={{ gridTemplateColumns: '1fr', maxWidth: '800px' }}>
            <div className="card glass">
                <h3 style={{ marginBottom: '1.5rem' }}>My Assigned Tasks</h3>
                {tasks.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No tasks assigned currently.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map((task, index) => (
                            <div key={task.id} className="list-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <h4>{task.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem 0' }}>{task.description}</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`status-badge ${task.status === 'COMPLETED' ? 'status-completed' : task.status === 'IN_PROGRESS' ? 'status-progress' : 'status-pending'}`}>
                                        {task.status}
                                    </span>
                                    
                                    {task.status !== 'COMPLETED' && (
                                        <select 
                                            className="input-field" 
                                            style={{ width: 'auto', marginBottom: 0, padding: '0.5rem 2rem 0.5rem 1rem' }}
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
