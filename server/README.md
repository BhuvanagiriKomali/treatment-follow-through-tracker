# Treatment Follow-Through Tracker — Backend API

A clean, lightweight Node.js + Express backend API for the Treatment Follow-Through Tracker application. Built with in-memory data storage, CORS support, and validation.

---

## 🚀 Quick Start

### 1. Install Dependencies
Open a terminal in the `server` directory:
```bash
cd server
npm install
```

### 2. Start the Server
* **Production / Normal mode:**
  ```bash
  npm start
  ```
* **Development mode (auto-restarts on file changes with Node 18+ watch mode):**
  ```bash
  npm run dev
  ```

The server starts on **`http://localhost:3001`**.

---

## 📡 API Endpoints

### 1. `GET /api/patients`
Returns all patients in the system.
* **Method:** `GET`
* **Response:** `200 OK` (Array of Patient objects)
```bash
curl http://localhost:3001/api/patients
```

---

### 2. `GET /api/patients/:id`
Returns a single patient by ID.
* **Method:** `GET`
* **Params:** `id` (e.g. `P-001`, `P-002`)
* **Response:** `200 OK` (Patient object) or `404 Not Found`
```bash
curl http://localhost:3001/api/patients/P-001
```

---

### 3. `POST /api/patients`
Registers a new patient and initializes their dose tracking.
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  {
    "name": "Sarah Connor",
    "treatmentName": "TB Treatment (6-month course)",
    "startDate": "2026-03-01",
    "durationDays": 180,
    "reminderTime": "09:00",
    "pin": "5678"
  }
  ```
* **Response:** `201 Created` with the newly created patient object.
```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Sarah Connor","treatmentName":"TB Treatment","startDate":"2026-03-01","durationDays":180,"reminderTime":"09:00","pin":"5678"}'
```

---

### 4. `POST /api/patients/:id/dose`
Updates today's dose status for a specific patient.
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  {
    "status": "taken"
  }
  ```
  *(Status must be `"taken"` or `"missed"`)*
* **Response:** `200 OK` with the updated patient object.
```bash
curl -X POST http://localhost:3001/api/patients/P-001/dose \
  -H "Content-Type: application/json" \
  -d '{"status":"taken"}'
```

---

## 🔗 Connecting to the React Frontend

The React Vite frontend can consume these endpoints directly:

```typescript
const API_BASE = 'http://localhost:3001/api';

// Fetch all patients
const res = await fetch(`${API_BASE}/patients`);
const patients = await res.json();

// Update today's dose
await fetch(`${API_BASE}/patients/${patientId}/dose`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'taken' }),
});
```
