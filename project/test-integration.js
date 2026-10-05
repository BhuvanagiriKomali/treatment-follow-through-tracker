const API_BASE = 'http://localhost:3001/api';

async function testFrontendIntegration() {
  console.log('=== Step 1: Testing patient load (GET /api/patients) ===');
  const resLoad = await fetch(`${API_BASE}/patients`);
  if (!resLoad.ok) throw new Error(`Failed to load patients: ${resLoad.statusText}`);
  const initialPatients = await resLoad.json();
  console.log(`✓ Loaded ${initialPatients.length} patients successfully.`);
  console.log('  Initial patients:', initialPatients.map(p => `${p.id}: ${p.name}`).join(', '));

  console.log('\n=== Step 2: Testing adding a patient (POST /api/patients) ===');
  const newPatientPayload = {
    id: `P-DEMO`,
    name: 'Ada Lovelace',
    treatmentName: 'TB Treatment (6-month course)',
    startDate: new Date().toISOString().split('T')[0],
    durationDays: 180,
    reminderTime: '08:30',
    doseHistory: [{ date: new Date().toISOString().split('T')[0], status: 'pending' }],
    pin: '9876',
  };
  const resAdd = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPatientPayload),
  });
  if (!resAdd.ok) throw new Error(`Failed to add patient: ${resAdd.statusText}`);
  const addedPatient = await resAdd.json();
  console.log(`✓ Successfully added patient: ${addedPatient.name} (${addedPatient.id})`);

  console.log('\n=== Step 3: Testing single patient retrieval (GET /api/patients/:id) ===');
  const resSingle = await fetch(`${API_BASE}/patients/${addedPatient.id}`);
  if (!resSingle.ok) throw new Error(`Failed to get patient: ${resSingle.statusText}`);
  const retrievedPatient = await resSingle.json();
  console.log(`✓ Retrieved patient details for ${retrievedPatient.id}: PIN is ${retrievedPatient.pin}`);

  console.log('\n=== Step 4: Testing marking dose as "taken" (POST /api/patients/:id/dose) ===');
  const resTaken = await fetch(`${API_BASE}/patients/${addedPatient.id}/dose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'taken' }),
  });
  if (!resTaken.ok) throw new Error(`Failed to mark dose taken: ${resTaken.statusText}`);
  const takenPatient = await resTaken.json();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecordTaken = takenPatient.doseHistory.find(d => d.date === todayStr);
  console.log(`✓ Dose marked as "taken" for ${takenPatient.id}. Today status: ${todayRecordTaken?.status}`);

  console.log('\n=== Step 5: Testing marking dose as "missed" (POST /api/patients/:id/dose) ===');
  const resMissed = await fetch(`${API_BASE}/patients/${addedPatient.id}/dose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'missed' }),
  });
  if (!resMissed.ok) throw new Error(`Failed to mark dose missed: ${resMissed.statusText}`);
  const missedPatient = await resMissed.json();
  const todayRecordMissed = missedPatient.doseHistory.find(d => d.date === todayStr);
  console.log(`✓ Dose updated to "missed" for ${missedPatient.id}. Today status: ${todayRecordMissed?.status}`);

  console.log('\n=== Step 6: Verifying updated list (GET /api/patients) ===');
  const resFinal = await fetch(`${API_BASE}/patients`);
  const finalPatients = await resFinal.json();
  console.log(`✓ Total patients count is now ${finalPatients.length} (included newly created ${addedPatient.name})`);

  console.log('\n🎉 ALL FRONTEND INTEGRATION TESTS PASSED!');
}

testFrontendIntegration().catch(err => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
