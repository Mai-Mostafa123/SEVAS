import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Users,
  Flame,
  CheckCircle2,
  BellRing,
  Send,
  ShieldAlert,
  X,
  FileText,
} from 'lucide-react';

interface EmergencyAlertBannerProps {
  onViewLocation?: () => void;
  onViewVehicle?: (vehicleId: string) => void;
  onViewStudents?: (vehicleId: string) => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  onViewLocation,
  onViewVehicle,
  onViewStudents,
}) => {
  const {
    activeEmergency,
    resolveEmergency,
    handleParentNotificationDecision,
    setFocusedMapCoords,
  } = useSevasData();
  const { user } = useAuth();

  const [showParentConfirmModal, setShowParentConfirmModal] = useState<boolean>(false);
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [resolutionNotes, setResolutionNotes] = useState<string>('Medical evaluation completed. Students transferred to relief transport.');
  const [contactDispatched, setContactDispatched] = useState<boolean>(false);
  const [schoolNotified, setSchoolNotified] = useState<boolean>(false);

  if (!activeEmergency || activeEmergency.status === 'RESOLVED') {
    return null;
  }

  const handleLocate = () => {
    setFocusedMapCoords(activeEmergency.coordinates);
    if (onViewLocation) onViewLocation();
  };

  const handleDispatchEmergencyTeam = () => {
    setContactDispatched(true);
    setTimeout(() => setContactDispatched(false), 4000);
  };

  const handleNotifySchool = () => {
    setSchoolNotified(true);
    setTimeout(() => setSchoolNotified(false), 4000);
  };

  const handleConfirmParents = (approved: boolean) => {
    handleParentNotificationDecision(
      activeEmergency.id,
      approved,
      user?.fullName || 'School Admin'
    );
    setShowParentConfirmModal(false);
  };

  const handleExecuteResolve = () => {
    resolveEmergency(activeEmergency.id, resolutionNotes);
    setShowResolveModal(false);
  };

  return (
    <>
      <div className="relative w-full border-y border-[#E51B24] bg-gradient-to-r from-[#2A0507] via-[#160204] to-[#2A0507] p-4 shadow-[0_0_35px_rgba(229,27,36,0.35)] transition-all">
        {/* Radar Pulse Line Indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E51B24] to-transparent animate-pulse" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Emergency Headline & Core Details */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#E51B24] text-white shrink-0 mt-0.5 shadow-[0_0_15px_#E51B24] animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-[#E51B24] text-white text-[11px] font-black font-mono tracking-wider px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  🚨 {activeEmergency.severity} ACCIDENT DETECTED
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  REF: {activeEmergency.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-300">
                  {activeEmergency.time}
                </span>
              </div>

              {/* Data Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Vehicle</span>
                  <span className="font-bold text-white font-mono">{activeEmergency.vehicleId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Location</span>
                  <span className="font-medium text-white truncate max-w-[140px] block" title={activeEmergency.locationName}>
                    {activeEmergency.locationName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">On Board</span>
                  <span className="font-bold text-emerald-400 font-mono">{activeEmergency.studentsOnBoard} Students</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Est. Injured</span>
                  <span className={`font-mono font-bold ${activeEmergency.estimatedInjured > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                    {activeEmergency.estimatedInjured}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Fire / Smoke</span>
                  <span className={`font-medium ${activeEmergency.fireDetected ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    {activeEmergency.fireDetected ? 'DETECTED' : 'NOT DETECTED'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Driver</span>
                  <span className="text-slate-200 truncate block max-w-[120px]">{activeEmergency.driverName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Operational Emergency Actions */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
            <button
              onClick={handleLocate}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E51B24]" />
              <span>View Location</span>
            </button>

            <button
              onClick={() => onViewVehicle && onViewVehicle(activeEmergency.vehicleId)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>View Vehicle</span>
            </button>

            <button
              onClick={() => onViewStudents && onViewStudents(activeEmergency.vehicleId)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Students</span>
            </button>

            <button
              onClick={handleDispatchEmergencyTeam}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                contactDispatched
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E51B24] hover:bg-red-700 text-white shadow-[0_0_12px_rgba(229,27,36,0.5)]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{contactDispatched ? 'Paramedics Dispatched (123)' : 'Contact Emergency'}</span>
            </button>

            {/* School Admin: Parent Notification Controller */}
            {user?.role === 'SCHOOL_ADMIN' && (
              <button
                onClick={() => setShowParentConfirmModal(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  activeEmergency.parentNotificationStatus === 'CONFIRMED'
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                    : activeEmergency.parentNotificationStatus === 'DECLINED'
                    ? 'bg-slate-900 border-slate-700 text-slate-400'
                    : 'bg-amber-950/90 border-amber-600 text-amber-300 hover:bg-amber-900'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>
                  {activeEmergency.parentNotificationStatus === 'CONFIRMED'
                    ? 'Parents Notified (WhatsApp)'
                    : activeEmergency.parentNotificationStatus === 'DECLINED'
                    ? 'Parent Broadcast Paused'
                    : 'Notify Parents?'}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowResolveModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Parent Notification (Critical Requirement #21) */}
      {showParentConfirmModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-amber-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Broadcast Parent Emergency Alert?</h3>
                <p className="text-xs text-slate-400 font-mono">SEVAS Protocol: School Admin Explicit Consent</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                Authorizing will immediately trigger simulated WhatsApp notifications to parents of the{' '}
                <strong className="text-white font-mono">{activeEmergency.studentsOnBoard} students</strong> currently aboard{' '}
                <strong className="text-red-400 font-mono">{activeEmergency.vehicleId}</strong>.
              </p>
              <p className="text-slate-400">
                Workflow: <span className="text-white">Accident</span> → <span className="text-amber-400">School Admin Confirmation</span> → <span className="text-emerald-400">Parent Notification</span>.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                This administrative decision will be permanently recorded in the SEVAS compliance audit ledger.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleConfirmParents(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                NO — Hold Broadcast
              </button>
              <button
                onClick={() => handleConfirmParents(true)}
                className="px-4 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.5)] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>YES — Dispatch Parent Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Emergency Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-emerald-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Resolve Emergency Alert</h3>
                <p className="text-xs text-slate-400 font-mono">Incident ID: {activeEmergency.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to mark this emergency on <strong className="text-white font-mono">{activeEmergency.vehicleId}</strong> as resolved? This will archive the incident and restore standard fleet telemetry.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Resolution Summary / Audit Notes</label>
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
                <span>Confirm & Archive Emergency</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
