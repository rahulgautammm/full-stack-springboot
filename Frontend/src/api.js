const BASE_URL = 'http://localhost:8080/api';

const safeFetch = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) return [];
        return await response.json();
    } catch (e) {
        console.error('Fetch error for', url, e);
        return [];
    }
};

export const loginUser = async (phone, role, name) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role, name })
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
};

export const fetchIncidents = () => safeFetch(`${BASE_URL}/incidents`);
export const fetchTasks = () => safeFetch(`${BASE_URL}/tasks`);
export const fetchVolunteers = () => safeFetch(`${BASE_URL}/users/volunteers`);
export const fetchVolunteerTasks = (volunteerId) => safeFetch(`${BASE_URL}/tasks/volunteer/${volunteerId}`);

export const createIncident = async (incident) => {
    const response = await fetch(`${BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
    });
    if (!response.ok) throw new Error("Failed");
    return response.json();
};

export const createTask = async (task) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error("Failed");
    return response.json();
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Failed");
    return response.json();
};
