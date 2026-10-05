# Treatment Follow-Through Tracker

A lightweight healthcare follow-up system designed to help health workers and families monitor long-term treatment schedules, track daily doses, and identify missed doses that may require follow-up.

## 🚨 Problem

Long-term treatments can require patients to follow a strict daily medication schedule for weeks or months.

In real-world situations, patients may miss doses or stop treatment without timely follow-up. Health workers and family members may not always have a simple way to see whether a scheduled dose was confirmed.

This can contribute to treatment interruptions and poor follow-through.

## 💡 Solution

The **Treatment Follow-Through Tracker** provides a simple workflow:

**Health Worker → Add Patient → Set Treatment Schedule → Daily Dose Reminder → Dose Confirmation → Missed-Dose Alert → Follow-Up**

The system allows health workers to manage patients and their treatment schedules while giving patients or family members a simple way to confirm daily doses.

The goal is not to diagnose or prescribe treatment, but to support **treatment adherence and follow-up**.

## ✨ Key Features

### 👩‍⚕️ Health Worker

- View registered patients
- View treatment progress
- See today's dose status
- Identify missed doses
- Add new patients
- View individual patient details
- Monitor treatment schedules

### 👨‍👩‍👧 Family Member / Patient

- View the current treatment schedule
- See the daily reminder time
- Confirm a dose as taken
- See whether a dose is pending or missed

### ⏰ Treatment Follow-Up

- Daily dose reminders
- Confirmation deadline
- Dose status tracking
- Missed-dose identification
- Treatment progress monitoring

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- HTML
- CSS

### Backend

- Node.js
- Express.js
- CORS
- REST API

### Data Storage

Currently uses **in-memory data storage** for the hackathon MVP.

No external database is required.

## 🏗️ Project Structure

```text
treatment-follow-through-tracker/
│
├── project/                 # Frontend
│   ├── src/
│   │   ├── screens/         # Application screens
│   │   ├── data/            # Initial/mock data
│   │   ├── utils/           # Utility functions
│   │   ├── api.ts           # Frontend API communication
│   │   ├── types.ts         # TypeScript types
│   │   └── App.tsx          # Main application
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── server/                  # Backend
│   ├── src/
│   │   ├── data.js          # In-memory patient data
│   │   └── index.js         # Express server and API routes
│   │
│   ├── test.js              # API tests
│   ├── package.json
│   └── README.md
│
└── README.md
