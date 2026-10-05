import express from 'express';
import cors from 'cors';
import { patients } from './data.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Health check / Root route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Treatment Follow-Through Tracker API is running',
    endpoints: [
      'GET /api/patients',
      'GET /api/patients/:id',
      'POST /api/patients',
      'POST /api/patients/:id/dose',
    ],
  });
});

/**
 * 1. GET /api/patients
 * Return all patients.
 */
app.get('/api/patients', (req, res) => {
  res.status(200).json(patients);
});

/**
 * 2. GET /api/patients/:id
 * Return one patient by ID.
 */
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const patient = patients.find((p) => p.id.toLowerCase() === id.trim().toLowerCase());

  if (!patient) {
    return res.status(404).json({ error: `Patient with ID '${id}' not found` });
  }

  res.status(200).json(patient);
});

/**
 * 3. POST /api/patients
 * Create a patient from the Patient fields and return the created patient.
 */
app.post('/api/patients', (req, res) => {
  const { name, treatmentName, startDate, durationDays, reminderTime, pin, doseHistory } = req.body;

  // Validation: Check required fields
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Patient name is required' });
  }
  if (!treatmentName || typeof treatmentName !== 'string' || !treatmentName.trim()) {
    return res.status(400).json({ error: 'Treatment name is required' });
  }
  if (!startDate || typeof startDate !== 'string') {
    return res.status(400).json({ error: 'Start date (YYYY-MM-DD) is required' });
  }
  const parsedDuration = parseInt(durationDays, 10);
  if (!parsedDuration || parsedDuration <= 0) {
    return res.status(400).json({ error: 'Duration days must be a positive integer' });
  }
  if (!reminderTime || typeof reminderTime !== 'string') {
    return res.status(400).json({ error: 'Reminder time (HH:MM) is required' });
  }
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin.trim())) {
    return res.status(400).json({ error: 'A 4-digit PIN is required' });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const newPatient = {
    id: req.body.id ? req.body.id.trim() : `P-${String(Date.now()).slice(-4)}`,
    name: name.trim(),
    treatmentName: treatmentName.trim(),
    startDate: startDate.trim(),
    durationDays: parsedDuration,
    reminderTime: reminderTime.trim(),
    doseHistory: Array.isArray(doseHistory) && doseHistory.length > 0
      ? doseHistory
      : [{ date: todayStr, status: 'pending' }],
    pin: pin.trim(),
  };

  // Add new patient to the beginning of the list
  patients.unshift(newPatient);

  res.status(201).json(newPatient);
});

/**
 * 4. POST /api/patients/:id/dose
 * Request body: { status: "taken" | "missed" }
 * Update today's dose for that patient and return the updated patient.
 */
app.post('/api/patients/:id/dose', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validation: Check status value
  if (status !== 'taken' && status !== 'missed') {
    return res.status(400).json({
      error: 'Invalid status. Status must be either "taken" or "missed".',
    });
  }

  const patient = patients.find((p) => p.id.toLowerCase() === id.trim().toLowerCase());

  if (!patient) {
    return res.status(404).json({ error: `Patient with ID '${id}' not found` });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const existingRecordIndex = patient.doseHistory.findIndex((d) => d.date === todayStr);

  if (existingRecordIndex >= 0) {
    // Update existing record for today
    patient.doseHistory[existingRecordIndex].status = status;
  } else {
    // Append a new record for today
    patient.doseHistory.push({ date: todayStr, status });
  }

  res.status(200).json(patient);
});

// Start server
app.listen(PORT, () => {
  console.log(`Treatment Follow-Through Tracker API is running on http://localhost:${PORT}`);
});
