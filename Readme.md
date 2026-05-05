
# CDRN - Community Disaster Response Network


Demo Part
<img width="1600" height="857" alt="WhatsApp Image 2026-05-05 at 3 40 51 PM" src="https://github.com/user-attachments/assets/85be000b-f584-44be-b85c-0a77997dcdec" />

Citizen
<img width="1600" height="813" alt="WhatsApp Image 2026-05-05 at 3 40 52 PM" src="https://github.com/user-attachments/assets/32a2637b-e5b5-434c-9f55-6181d0e76247" />
<img width="1600" height="860" alt="WhatsApp Image 2026-05-05 at 3 40 52 PM (1)" src="https://github.com/user-attachments/assets/b7cce697-26ed-4165-b6bb-9319a83a059c" />


Authority

<img width="1600" height="865" alt="WhatsApp Image 2026-05-05 at 3 40 51 PM (1)" src="https://github.com/user-attachments/assets/b7cf2bea-e5ba-4a2a-bfe9-49f44477249e" />

<img width="1600" height="865" alt="WhatsApp Image 2026-05-05 at 3 40 50 PM" src="https://github.com/user-attachments/assets/7efbe36d-c47b-4793-89b8-102170f7365f" />

Volunteer
<img width="1600" height="789" alt="WhatsApp Image 2026-05-05 at 2 48 14 PM" src="https://github.com/user-attachments/assets/a1345cfe-2c4a-449f-b88c-b900399d9cc5" />

Members
Rahul Gautam - 2315510164 Task :- UI and Research 
Madhav Gupta - 2315001277 Task :- Backend and DataBase
Priyanshu nayak - 2315510154 Task :- UI Dashboard with Map
Khushi Gangwar -2315510100 Task: -Backend and WebSocket

A full-stack real-time disaster response platform with role-based dashboards for Citizens, Volunteers, and Authorities. Built with React, Spring Boot, PostgreSQL, and WebSocket (STOMP).

## Architecture

```
┌─────────────┐    REST + WS    ┌──────────────┐    JPA    ┌────────────┐
│   React App │ ◄────────────► │  Spring Boot │ ◄───────► │ PostgreSQL │
│  (Port 3000)│                │  (Port 8080) │           │  (Port 5432)│
└─────────────┘                └──────────────┘           └────────────┘
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Leaflet     |
| Backend    | Spring Boot 3.2, Spring Security    |
| Database   | PostgreSQL                          |
| Real-time  | Spring WebSocket (STOMP + SockJS)   |
| Maps       | OpenStreetMap via react-leaflet     |
| Auth       | OTP-based login with JWT tokens     |

## Prerequisites

- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **PostgreSQL 14+**

## Database Setup

```bash
# Connect to PostgreSQL and create the database
psql -U postgres
CREATE DATABASE cdrn;
\q
```

The tables are auto-created by JPA on first run (`spring.jpa.hibernate.ddl-auto=update`).

## Backend Setup

```bash
cd backend

# (Optional) Edit database credentials in src/main/resources/application.properties
# Default: postgres/postgres on localhost:5432/cdrn

# Build and run
mvn clean install -DskipTests
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.

## Frontend Setup

```bash
cd frontend

npm install
npm start
```

The frontend starts on **http://localhost:3000**.

## Default OTP

For simplicity, the OTP is always **`123456`** for any phone number.

## User Roles

| Role        | Access                                              |
|-------------|-----------------------------------------------------|
| CITIZEN     | Report incidents, send SOS, view alerts             |
| VOLUNTEER   | View assigned tasks, update task status              |
| AUTHORITY   | View all incidents on map, assign tasks, send alerts |

New users are created as CITIZEN by default. To change a user's role:

```bash
# Via API (replace {userId} and {role})
curl -X PUT http://localhost:8080/api/users/{userId}/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"role": "AUTHORITY"}'
```

## API Reference

### Authentication (no token required)

| Method | Endpoint              | Body                          | Description      |
|--------|-----------------------|-------------------------------|------------------|
| POST   | `/api/auth/send-otp`  | `{phone}`                     | Send OTP         |
| POST   | `/api/auth/verify-otp`| `{phone, otp, name?}`         | Verify & get JWT |

### Incidents (token required)

| Method | Endpoint              | Body                                           | Description         |
|--------|-----------------------|------------------------------------------------|---------------------|
| POST   | `/api/incident/report`| `{type, description, latitude, longitude}`     | Report incident     |
| GET    | `/api/incident/all`   | -                                              | List all incidents  |

### SOS (token required)

| Method | Endpoint          | Body                      | Description       |
|--------|-------------------|---------------------------|--------------------|
| POST   | `/api/sos/request` | `{latitude, longitude}`  | Send SOS request   |
| GET    | `/api/sos/all`     | -                        | List all SOS       |

### Tasks (token required)

| Method | Endpoint                        | Body                       | Description               |
|--------|---------------------------------|----------------------------|---------------------------|
| POST   | `/api/task/assign`              | `{volunteerId, incidentId}`| Assign task (AUTHORITY)   |
| PUT    | `/api/task/update`              | `{taskId, status}`         | Update task (VOLUNTEER)   |
| GET    | `/api/task/my`                  | -                          | My tasks (current user)   |
| GET    | `/api/task/volunteer/{id}`      | -                          | Tasks for a volunteer     |

### Alerts (token required)

| Method | Endpoint          | Body          | Description              |
|--------|-------------------|---------------|--------------------------|
| POST   | `/api/alert/send`  | `{message}`  | Send alert (AUTHORITY)   |
| GET    | `/api/alert/all`   | -            | List all alerts          |

### Users (token required)

| Method | Endpoint                  | Body      | Description          |
|--------|---------------------------|-----------|----------------------|
| GET    | `/api/users/volunteers`   | -         | List all volunteers  |
| PUT    | `/api/users/{id}/role`    | `{role}`  | Update user role     |

## WebSocket Topics

Connect to `ws://localhost:8080/ws` (SockJS + STOMP).

| Topic              | Trigger                        |
|--------------------|--------------------------------|
| `/topic/incidents` | New incident reported          |
| `/topic/alerts`    | New alert sent or SOS triggered|
| `/topic/tasks`     | Task assigned or status updated|

## Project Structure

```
CDRN/
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cdrn/backend/
│       │   ├── BackendApplication.java
│       │   ├── config/          # Security, JWT, WebSocket, CORS
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/             # Request/Response DTOs
│       │   ├── model/           # JPA Entities
│       │   ├── repository/      # Spring Data repositories
│       │   └── service/         # Business logic
│       └── resources/
│           └── application.properties
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js               # Router and protected routes
        ├── api.js               # Axios HTTP client
        ├── websocket.js         # STOMP WebSocket client
        ├── context/AuthContext.js
        ├── pages/               # Login + 3 role dashboards
        ├── components/          # Reusable UI components
        └── styles/App.css
```

## Quick Test Flow

1. Start PostgreSQL, backend, and frontend
2. Open http://localhost:3000
3. Login with any phone number, OTP: `123456` (creates CITIZEN user)
4. Report an incident or send SOS from Citizen Dashboard
5. Update the user role to AUTHORITY via the API (see above)
6. Re-login to access the Authority Dashboard
7. View incidents on the map, assign tasks, send alerts
8. Create a VOLUNTEER user and assign tasks to them
