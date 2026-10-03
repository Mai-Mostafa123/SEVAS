import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SevasDataProvider, useSevasData } from './context/SevasDataContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { EmergencyAlertBanner } from './components/emergency/EmergencyAlertBanner';
import { SimulateEmergencyModal } from './components/emergency/SimulateEmergencyModal';
import { VehicleDetailModal } from './components/vehicles/VehicleDetailModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { DriverView } from './components/driver/DriverView';

import { LoginPortal } from './pages/auth/LoginPortal';
import { SchoolOverview } from './pages/school/SchoolOverview';
import { VehiclesPage } from './pages/school/VehiclesPage';
import { LiveTrackingPage } from './pages/school/LiveTrackingPage';
import { StudentsPage } from './pages/school/StudentsPage';
import { NfcAttendancePage } from './pages/school/NfcAttendancePage';
import { EmergencyCenterPage } from './pages/school/EmergencyCenterPage';
import { AiMonitoringPage } from './pages/school/AiMonitoringPage';
import { ParentCommPage } from './pages/school/ParentCommPage';
import { ReportsPage } from './pages/school/ReportsPage';
import { SettingsPage } from './pages/school/SettingsPage';
import { RegistrationRequestsPage } from './pages/team/RegistrationRequestsPage';
import { SchoolsDirectoryPage } from './pages/team/SchoolsDirectoryPage';

const MainApplication: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { vehicles, students, activeEmergency } = useSevasData();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [isDriverViewOpen, setIsDriverViewOpen] = useState<boolean>(false);
  const [inspectedVehicleId, setInspectedVehicleId] = useState<string | null>(null);
  const [inspectedStudentId, setInspectedStudentId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <LoginPortal onSuccessLogin={() => setCurrentTab('overview')} />;
  }

  const inspectedBus = vehicles.find((v) => v.id === inspectedVehicleId) || null;
  const inspectedStudent = students.find((s) => s.id === inspectedStudentId) || null;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSimulateModal={() => setShowSimulateModal(true)}
        onOpenDriverView={() => setIsDriverViewOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-64 flex-1 flex flex-col transition-all">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenSimulateModal={() => setShowSimulateModal(true)}
          onToggleDriverView={() => setIsDriverViewOpen((prev) => !prev)}
        />

        {/* Global Emergency Alert Banner (Shown prominently on all pages if emergency is active) */}
        <EmergencyAlertBanner
          onViewLocation={() => setCurrentTab('emergency_center')}
          onViewVehicle={(vId) => setInspectedVehicleId(vId)}
          onViewStudents={(vId) => setCurrentTab('students')}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === 'overview' && <SchoolOverview onNavigateTab={setCurrentTab} />}
          {currentTab === 'vehicles' && <VehiclesPage />}
          {currentTab === 'live_tracking' && <LiveTrackingPage />}
          {currentTab === 'students' && (
            <StudentsPage
              onFocusBusOnMap={(busId) => {
                setCurrentTab('live_tracking');
              }}
            />
          )}
          {currentTab === 'nfc_attendance' && <NfcAttendancePage />}
          {currentTab === 'emergency_center' && <EmergencyCenterPage />}
          {currentTab === 'ai_monitoring' && <AiMonitoringPage />}
          {currentTab === 'parent_comm' && <ParentCommPage />}
          {currentTab === 'reports' && <ReportsPage />}
          {currentTab === 'settings' && <SettingsPage />}
          {currentTab === 'school_requests' && <RegistrationRequestsPage />}
          {currentTab === 'schools_directory' && <SchoolsDirectoryPage />}
        </main>
      </div>

      {/* Global Modals */}
      {showSimulateModal && (
        <SimulateEmergencyModal
          isOpen={showSimulateModal}
          onClose={() => setShowSimulateModal(false)}
        />
      )}

      {inspectedBus && (
        <VehicleDetailModal
          vehicle={inspectedBus}
          onClose={() => setInspectedVehicleId(null)}
          onOpenLiveMap={() => setCurrentTab('live_tracking')}
          onOpenDriverView={(vId) => {
            setInspectedVehicleId(vId);
            setIsDriverViewOpen(true);
          }}
        />
      )}

      {inspectedStudent && (
        <StudentProfileModal
          student={inspectedStudent}
          onClose={() => setInspectedStudentId(null)}
          onFocusBusOnMap={(bId) => {
            setCurrentTab('live_tracking');
            setInspectedStudentId(null);
          }}
        />
      )}

      {/* Lightweight Mobile Driver View Cockpit */}
      {(isDriverViewOpen || currentTab === 'driver_view') && (
        <DriverView
          onClose={() => {
            setIsDriverViewOpen(false);
            if (currentTab === 'driver_view') {
              setCurrentTab('overview');
            }
          }}
          defaultVehicleId={inspectedVehicleId || 'BUS-007'}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SevasDataProvider>
        <MainApplication />
      </SevasDataProvider>
    </AuthProvider>
  );
}
