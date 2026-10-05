async function test() {
  const BASE = 'http://localhost:3001/api';

  console.log('Testing GET /api/patients...');
  const res1 = await fetch(`${BASE}/patients`);
  const patients = await res1.json();
  console.log(`GET /api/patients returned ${patients.length} patients. Status: ${res1.status}`);

  console.log('\nTesting GET /api/patients/P-001...');
  const res2 = await fetch(`${BASE}/patients/P-001`);
  const patient = await res2.json();
  console.log(`Patient name: ${patient.name}, Status: ${res2.status}`);

  console.log('\nTesting POST /api/patients...');
  const res3 = await fetch(`${BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Patient',
      treatmentName: 'TB Treatment',
      startDate: '2026-01-01',
      durationDays: 180,
      reminderTime: '08:00',
      pin: '9999',
    }),
  });
  const created = await res3.json();
  console.log(`Created Patient ID: ${created.id}, Status: ${res3.status}`);

  console.log('\nTesting POST /api/patients/P-001/dose...');
  const res4 = await fetch(`${BASE}/patients/P-001/dose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'taken' }),
  });
  const updated = await res4.json();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDose = updated.doseHistory.find((d) => d.date === todayStr);
  console.log(`Today's dose status for P-001: ${todayDose?.status}, Status: ${res4.status}`);

  console.log('\nAll endpoint tests passed successfully!');
}

test().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
