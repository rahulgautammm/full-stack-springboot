import React, { useState } from 'react';
import { loginUser } from '../api';
import { AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('CITIZEN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const user = await loginUser(phone, role, name);
            onLogin(user);
        } catch (err) {
            setError('Failed to login. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>CDRN Login</h2>
                
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '1rem' }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Enter your name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                    <input 
                        type="tel" 
                        className="input-field" 
                        placeholder="e.g. +123456789" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                    <select 
                        className="input-field" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="CITIZEN">Citizen</option>
                        <option value="VOLUNTEER">Volunteer</option>
                        <option value="AUTHORITY">Authority</option>
                    </select>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Enter Platform'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
