/**
 * Helper to compute date strings in YYYY-MM-DD relative to today.
 */
function dateStr(daysAgo) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Generates realistic dose history for demo patients.
 * Today (daysAgo = 0) is set to 'pending' so it can be tested immediately.
 */
function makeHistory(days, pattern) {
  const records = [];
  for (let i = days - 1; i >= 0; i--) {
    if (i === 0) {
      records.push({ date: dateStr(0), status: 'pending' });
      continue;
    }

    let status = 'taken';
    if (pattern === 'missed_recent' && i <= 2) {
      status = 'missed';
    } else if (pattern === 'intermittent' && i % 5 === 0) {
      status = 'missed';
    }

    records.push({ date: dateStr(i), status });
  }
  return records;
}

/**
 * In-memory patient store initialized with realistic demo data.
 */
export const patients = [
  {
    id: 'P-001',
    name: 'Amara Okafor',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(120),
    durationDays: 180,
    reminderTime: '08:00',
    doseHistory: makeHistory(14, 'good'),
    pin: '1234',
  },
  {
    id: 'P-002',
    name: 'Kwame Mensah',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(45),
    durationDays: 180,
    reminderTime: '09:30',
    doseHistory: makeHistory(14, 'missed_recent'),
    pin: '2345',
  },
  {
    id: 'P-003',
    name: 'Fatima Diallo',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(30),
    durationDays: 180,
    reminderTime: '07:00',
    doseHistory: makeHistory(14, 'intermittent'),
    pin: '3456',
  },
  {
    id: 'P-004',
    name: 'Joseph Mwangi',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: dateStr(8),
    durationDays: 180,
    reminderTime: '10:00',
    doseHistory: makeHistory(8, 'good'),
    pin: '4567',
  },
];
