import { useState, useCallback, useEffect } from 'react';
import type { Role, Patient, View, DoseStatus } from '@/types';
import {
  getPatients,
  getPatientById,
  createPatient,
  recordDose,
  familyMemberPatientId,
} from './api';
import { Landing } from '@/screens/Landing';
import { HealthWorkerDashboard } from '@/screens/HealthWorkerDashboard';
import { PatientDetail } from '@/screens/PatientDetail';
import { AddPatientForm } from '@/screens/AddPatientForm';
import { FamilyMemberView } from '@/screens/FamilyMemberView';
import { PatientLogin } from '@/screens/PatientLogin';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<View>({ name: 'landing' });

  const goLanding = useCallback(() => setView({ name: 'landing' }), []);

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => console.error('Failed to load patients from API:', err));
  }, []);

  useEffect(() => {
    if (view.name === 'hw_patient_detail' || view.name === 'patient_view') {
      getPatientById(view.patientId)
        .then((fresh) => {
          setPatients((prev) => {
            const index = prev.findIndex((p) => p.id === fresh.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = fresh;
              return updated;
            }
            return [...prev, fresh];
          });
        })
        .catch((err) => console.error('Failed to fetch patient detail from API:', err));
    }
  }, [view]);

  function selectRole(role: Role) {
    if (role === 'health_worker') setView({ name: 'hw_dashboard' });
    else if (role === 'family_member') setView({ name: 'patient_view', patientId: familyMemberPatientId });
    else setView({ name: 'patient_login' });
  }

  async function addPatient(patient: Patient) {
    try {
      const created = await createPatient(patient);
      setPatients((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
      setView({ name: 'hw_dashboard' });
    } catch (err) {
      console.error('Failed to add patient:', err);
    }
  }

  async function markDose(patientId: string, status: DoseStatus) {
    if (status !== 'taken' && status !== 'missed') return;
    try {
      const updated = await recordDose(patientId, status);
      setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update dose:', err);
    }
  }

  const patientForDetail =
    view.name === 'hw_patient_detail' ? patients.find((p) => p.id === view.patientId) : undefined;
  const activePatientId = view.name === 'patient_view' ? view.patientId : undefined;
  const activePatient = activePatientId ? patients.find((p) => p.id === activePatientId) : undefined;

  switch (view.name) {
    case 'landing':
      return <Landing onSelectRole={selectRole} />;

    case 'hw_dashboard':
      return (
        <HealthWorkerDashboard
          patients={patients}
          onAddPatient={() => setView({ name: 'hw_add_patient' })}
          onPatientClick={(patientId) => setView({ name: 'hw_patient_detail', patientId })}
          onSwitchRole={goLanding}
        />
      );

    case 'hw_patient_detail':
      if (!patientForDetail) {
        if (patients.length === 0) {
          return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
              Loading patient details...
            </div>
          );
        }
        setView({ name: 'hw_dashboard' });
        return null;
      }
      return <PatientDetail patient={patientForDetail} onBack={() => setView({ name: 'hw_dashboard' })} onSwitchRole={goLanding} />;

    case 'hw_add_patient':
      return <AddPatientForm onBack={() => setView({ name: 'hw_dashboard' })} onSave={addPatient} onSwitchRole={goLanding} />;

    case 'patient_login':
      return (
        <PatientLogin
          patients={patients}
          onLogin={(patientId) => setView({ name: 'patient_view', patientId })}
          onBack={goLanding}
        />
      );

    case 'patient_view':
      if (!activePatient) {
        if (patients.length === 0) {
          return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
              Loading patient details...
            </div>
          );
        }
        setView({ name: 'patient_login' });
        return null;
      }
      return (
        <FamilyMemberView
          patient={activePatient}
          role="patient"
          onMarkDose={(status) => markDose(activePatient.id, status)}
          onSwitchRole={goLanding}
          onBack={goLanding}
        />
      );

    default:
      return <Landing onSelectRole={selectRole} />;
  }
}

export default App;
