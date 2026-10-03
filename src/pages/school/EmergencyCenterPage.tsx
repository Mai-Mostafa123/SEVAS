import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { useAuth } from '../../context/AuthContext';
import { LiveCommandMap } from '../../components/map/LiveCommandMap';
import { SimulateEmergencyModal } from '../../components/emergency/SimulateEmergencyModal';
import { VehicleDetailModal } from '../../components/vehicles/VehicleDetailModal';
import {
  AlertTriangle,
  Flame,
  PhoneCall,
  ShieldAlert,
  MapPin,
  Users,
  CheckCircle2,
  BellRing,
  Send,
  Zap,
  ArrowRight,
  Clock,
  HeartPulse,
} from 'lucide-react';

export const EmergencyCenterPage: React.FC = () => {
  const {
    activeEmergency,
    emergencyHistory,
    resolveEmergency,
    handleParentNotificationDecision,
    setFocusedMapCoords,
    vehicles,
    students,
  } = useSevasData();
  const { user } = useAuth();

  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showParentConfirmModal, setShowParentConfirmModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('All students safe and triage completed by Cairo Red Crescent paramedics.');
  const [inspectVehicleId, setInspectVehicleId] = useState<string | null>(null);
  const [teamContacted, setTeamContacted] = useState(false);

  const inspectedBus = vehicles.find((v) => v.id === (inspectVehicleId || activeEmergency?.vehicleId)) || null;
  const affectedStudents = activeEmergency
    ? students.filter((s) => s.assignedVehicleId === activeEmergency.vehicleId && s.isOnBoard)
    : [];

  const handleCenterEmergency = () => {
    if (activeEmergency) {
      setFocusedMapCoords(activeEmergency.coordinates);
    }
  };

  const handleContactAmbulance = () => {
    setTeamContacted(true);
    setTimeout(() => setTeamContacted(false), 5000);
  };

  const handleConfirmParentAlert = (approved: boolean) => {
    if (!activeEmergency) return;
    handleParentNotificationDecision(
      activeEmergency.id,
      approved,
      user?.fullName || 'School Admin'
    );
    setShowParentConfirmModal(false);
  };

  const handleExecuteResolve = () => {
    if (!activeEmergency) return;
    resolveEmergency(activeEmergency.id, resolutionNotes);
    setShowResolveModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E51B24] animate-ping"></span>
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              SEVAS EMERGENCY INCIDENT & RESPONSE CENTER
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            High-priority command room: triage dispatch, paramedic liaison, and parent broadcast control
          </p>
        </div>

        <button
          onClick={() => setShowSimulateModal(true)}
          className="px-4 py-2 rounded-lg bg-[#E51B24]/20 hover:bg-[#E51B24]/30 border border-[#E51B24] text-red-300 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(229,27,36,0.3)] transition-all"
        >
          <Zap className="w-4 h-4 text-[#E51B24]" />
          <span>SIMULATE ACCIDENT EVENT</span>
        </button>
      </div>

      {/* 1. Active Incident Spotlight Panel (Requirement #20 & #21) */}
      {activeEmergency && activeEmergency.status === 'ACTIVE' ? (
        <div className="bg-gradient-to-b from-[#2A0507] via-[#140305] to-[#0B0F17] border-2 border-[#E51B24] rounded-2xl p-6 shadow-[0_0_50px_rgba(229,27,36,0.35)] relative overflow-hidden space-y-6">
          {/* Glowing Top Radar Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E51B24] animate-pulse" />

          {/* Incident Banner Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-red-900/60">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E51B24] text-white rounded-xl shadow-[0_0_20px_#E51B24] animate-bounce shrink-0 mt-1">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-[#E51B24] text-white font-mono font-black text-xs px-2.5 py-0.5 rounded tracking-wider uppercase">
                    🚨 {activeEmergency.severity} ACCIDENT DETECTED
                  </span>
                  <span className="text-xs font-mono font-bold text-red-300">
                    INCIDENT ID: {activeEmergency.id}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs font-mono text-slate-300">
                    REPORTED AT {activeEmergency.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Structural Vehicle Impact & Paramedic Emergency Triggered
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {activeEmergency.description}
                </p>
              </div>
            </div>

            {/* Severity Pill */}
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">SEVAS AI CONFIDENCE</span>
              <span className="text-2xl font-bold font-mono text-red-400 tabular-nums">
                {Math.round(activeEmergency.aiConfidence.accidentConfidence * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Vision & Accelerometer Multi-Sensor Verification</span>
            </div>
          </div>

          {/* Telemetry Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-xl bg-[#05070A]/80 border border-red-900/40 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Target Vehicle</span>
              <span className="text-white font-bold text-sm block">{activeEmergency.vehicleId}</span>
              <span className="text-slate-400 text-[10px]">{activeEmergency.vehiclePlate}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Students On Board</span>
              <span className="text-emerald-400 font-bold text-base block">{activeEmergency.studentsOnBoard}</span>
              <span className="text-slate-400 text-[10px]">Manifest Synced</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Estimated Injured</span>
              <span className="text-red-400 font-bold text-base block">{activeEmergency.estimatedInjured}</span>
              <span className="text-slate-400 text-[10px]">Triage In Progress</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Fire / Thermal Risk</span>
              <span className={`font-bold text-sm block ${activeEmergency.fireDetected ? 'text-red-400' : 'text-slate-300'}`}>
                {activeEmergency.fireDetected ? 'DETECTED (ACTIVE)' : 'NOT DETECTED'}
              </span>
              <span className="text-slate-400 text-[10px]">Engine Bay Sensors</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Assigned Driver</span>
              <span className="text-white font-semibold text-xs truncate block">{activeEmergency.driverName}</span>
              <span className="text-red-400 text-[10px]">Blood: {activeEmergency.driverBloodType}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Accident Location</span>
              <span className="text-white text-xs truncate block" title={activeEmergency.locationName}>
                {activeEmergency.locationName}
              </span>
              <span className="text-slate-400 text-[10px]">Greater Cairo Sector</span>
            </div>
          </div>

          {/* Action Buttons (#21 Requirement) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCenterEmergency}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#E51B24]" />
                <span>View Location</span>
              </button>

              <button
                onClick={() => setInspectVehicleId(activeEmergency.vehicleId)}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>View Vehicle Telemetry</span>
              </button>

              <button
                onClick={handleContactAmbulance}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                  teamContacted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E51B24] hover:bg-red-700 text-white shadow-[0_0_20px_rgba(229,27,36,0.6)]'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>{teamContacted ? 'Paramedics En Route (123 Dispatch)' : 'CONTACT EMERGENCY TEAM (123)'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* School Admin Parent Notification Decision (#21) */}
              <button
                onClick={() => setShowParentConfirmModal(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all flex items-center gap-2 ${
                  activeEmergency.parentNotificationStatus === 'CONFIRMED'
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                    : 'bg-amber-950/90 border-amber-600 text-amber-300 hover:bg-amber-900'
                }`}
              >
                <BellRing className="w-4 h-4" />
                <span>
                  {activeEmergency.parentNotificationStatus === 'CONFIRMED'
                    ? 'Parents Notified (WhatsApp)'
                    : 'Notify Parents? [Authorize Broadcast]'}
                </span>
              </button>

              <button
                onClick={() => setShowResolveModal(true)}
                className="px-4 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0B0F17] border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">ALL FLEET SECTORS NOMINAL</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Zero active collision alerts detected across Cairo school routes. Multi-spectral camera and G-force telemetry streaming normally.
          </p>
        </div>
      )}

      {/* 2. Emergency Live Radar Map Centering (#22 Requirement) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
            Active Incident Geographic Spatial Vector
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Direct telemetry link to Queclink GV350MG
          </span>
        </div>

        <LiveCommandMap height="420px" />
      </div>

      {/* 3. Accident Detection Architectural Flow Pipeline (#20) */}
      <div className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
        <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#E51B24] font-bold">
          SEVAS ACCIDENT DETECTION & AUTHORIZATION PIPELINE
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs font-mono">
          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 01</span>
            <span className="text-white font-bold block">Vehicle Sensors</span>
            <span className="text-[10px] text-slate-400">CAN-Bus Accelerometer</span>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 02</span>
            <span className="text-purple-400 font-bold block">AI Vision Detection</span>
            <span className="text-[10px] text-slate-400">YOLOv11 TensorRT (FastAPI)</span>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 03</span>
            <span className="text-amber-400 font-bold block">Severity Matrix</span>
            <span className="text-[10px] text-slate-400">LOW / MED / SEVERE</span>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 04</span>
            <span className="text-blue-400 font-bold block">GPS Coordinates</span>
            <span className="text-[10px] text-slate-400">Geofence & Location Sync</span>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 05</span>
            <span className="text-red-400 font-bold block">Emergency Center</span>
            <span className="text-[10px] text-slate-400">School Command Broadcast</span>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">STEP 06</span>
            <span className="text-emerald-400 font-bold block">Parent WhatsApp</span>
            <span className="text-[10px] text-slate-400">School Admin Consent</span>
          </div>
        </div>
      </div>

      {/* 4. Historical Incident Log Archive */}
      {emergencyHistory.length > 0 && (
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Resolved Emergency Archive
            </h3>
            <span className="text-xs font-mono text-slate-400">{emergencyHistory.length} archived incidents</span>
          </div>

          <div className="divide-y divide-slate-800/80 font-mono text-xs">
            {emergencyHistory.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{item.vehicleId}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{item.locationName}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-sans">{item.description}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 self-start sm:self-auto uppercase">
                  RESOLVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showSimulateModal && (
        <SimulateEmergencyModal
          isOpen={showSimulateModal}
          onClose={() => setShowSimulateModal(false)}
        />
      )}

      {inspectedBus && inspectVehicleId && (
        <VehicleDetailModal
          vehicle={inspectedBus}
          onClose={() => setInspectVehicleId(null)}
          onOpenLiveMap={handleCenterEmergency}
        />
      )}

      {/* Parent Alert Confirmation Dialog */}
      {showParentConfirmModal && activeEmergency && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-amber-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Broadcast Emergency to Parents?</h3>
                <p className="text-xs text-slate-400 font-mono">School Administrator Mandatory Consent</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Trigger simulated emergency WhatsApp notifications to guardians of all{' '}
              <strong className="text-emerald-400 font-mono">{activeEmergency.studentsOnBoard} students</strong> aboard{' '}
              <strong className="text-white font-mono">{activeEmergency.vehicleId}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleConfirmParentAlert(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                NO — Hold Alert
              </button>
              <button
                onClick={() => handleConfirmParentAlert(true)}
                className="px-4 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.5)] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>YES — Dispatch WhatsApp Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Dialog */}
      {showResolveModal && activeEmergency && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-emerald-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Resolve & Clear Emergency</h3>
                <p className="text-xs text-slate-400 font-mono">Incident ID: {activeEmergency.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Confirm that on-site paramedics and transportation staff have stabilized vehicle{' '}
              <strong className="text-white font-mono">{activeEmergency.vehicleId}</strong>.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Resolution Summary Note</label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteResolve}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
