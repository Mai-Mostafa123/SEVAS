import React, { useState } from 'react';
import { Student } from '../../types';
import { useSevasData } from '../../context/SevasDataContext';
import {
  User,
  X,
  MapPin,
  Bus,
  CreditCard,
  Heart,
  Phone,
  ShieldAlert,
  Clock,
  Navigation,
  FileText,
} from 'lucide-react';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onFocusBusOnMap?: (busId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onFocusBusOnMap,
}) => {
  const { vehicles, nfcScans } = useSevasData();
  const [viewMode, setViewMode] = useState<'LIVE_LOCATION' | 'STUDENT_INFO'>('LIVE_LOCATION');

  if (!student) return null;

  const assignedBus = vehicles.find((v) => v.id === student.assignedVehicleId);
  const studentScans = nfcScans.filter((s) => s.studentId === student.id || s.nfcId === student.nfcId);

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{student.fullName}</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    student.isOnBoard
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : student.attendanceStatus === 'PRESENT'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {student.isOnBoard ? 'ON BOARD' : student.attendanceStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {student.classGrade} · Student ID: {student.studentId}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher (VIEW 1 vs VIEW 2 as requested in #16) */}
        <div className="grid grid-cols-2 bg-[#05070A] border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('LIVE_LOCATION')}
            className={`py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              viewMode === 'LIVE_LOCATION'
                ? 'border-[#E51B24] text-white font-bold bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#E51B24]" />
            <span>VIEW 1 — LIVE LOCATION</span>
          </button>

          <button
            onClick={() => setViewMode('STUDENT_INFO')}
            className={`py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              viewMode === 'STUDENT_INFO'
                ? 'border-[#E51B24] text-white font-bold bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>VIEW 2 — STUDENT INFORMATION</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6 text-xs max-h-[65vh] overflow-y-auto">
          {/* VIEW 1 — LIVE LOCATION */}
          {viewMode === 'LIVE_LOCATION' && (
            <div className="space-y-4">
              {student.isOnBoard && assignedBus ? (
                <>
                  <div className="p-4 bg-emerald-950/20 border border-emerald-800/60 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-bold text-white text-sm">Student is Currently On Board</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {assignedBus.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-900/30 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Vehicle Speed</span>
                        <span className="text-white font-bold text-sm">{assignedBus.currentSpeed} km/h</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">GPS Status</span>
                        <span className="text-emerald-400 font-bold text-sm">{assignedBus.gpsStatus}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Last GPS Ping</span>
                        <span className="text-slate-200 text-sm">{assignedBus.lastUpdate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Driver</span>
                        <span className="text-slate-200 text-sm truncate block">{assignedBus.driver.fullName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Coordinates Card */}
                  <div className="p-4 bg-[#05070A] border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        Transit Telemetry & Route
                      </h4>
                      {onFocusBusOnMap && (
                        <button
                          onClick={() => {
                            onClose();
                            onFocusBusOnMap(assignedBus.id);
                          }}
                          className="px-3 py-1 rounded bg-[#E51B24] hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Track on Live Radar</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500 font-mono">Route: </span>
                        <span className="text-white font-medium">{assignedBus.assignedRoute}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">Coordinates: </span>
                        <span className="font-mono text-slate-200">
                          {assignedBus.currentLocation.lat.toFixed(5)}° N, {assignedBus.currentLocation.lng.toFixed(5)}° E
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">Boarded At: </span>
                        <span className="font-mono text-emerald-400 font-bold">{student.lastScanTime || '07:42 AM'}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 px-6 bg-[#05070A] border border-slate-800 rounded-xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Student is currently not onboard.</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                    Status: <span className="text-blue-300 font-semibold">{student.attendanceStatus}</span>. Assigned transport is <span className="text-white font-semibold">{student.assignedVehicleId}</span>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2 — STUDENT INFORMATION */}
          {viewMode === 'STUDENT_INFO' && (
            <div className="space-y-4">
              {/* Identity & Health Card */}
              <div className="p-4 bg-[#05070A] border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Biometrics & Sensitive Medical Notes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">National ID</span>
                    <span className="font-mono text-white text-xs">{student.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">NFC Hardware Tag</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{student.nfcId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Blood Type</span>
                    <span className="font-mono text-red-400 font-bold text-xs">{student.bloodType}</span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-500 text-[10px] block">Medical Conditions</span>
                    <span className="text-slate-200 text-xs">{student.medicalInfo}</span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-500 text-[10px] block">Recorded Allergies</span>
                    <span className="text-amber-300 text-xs font-medium">{student.allergies}</span>
                  </div>
                </div>
              </div>

              {/* Parents & Emergency Contact */}
              <div className="p-4 bg-[#05070A] border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Parent / Guardian & Emergency Liaison
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Primary Guardian</span>
                    <span className="text-white font-medium text-xs">{student.parent1Name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Phone Number</span>
                    <span className="font-mono text-slate-200 text-xs">{student.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">WhatsApp Dispatch</span>
                    <span className="font-mono text-emerald-400 text-xs">{student.parentWhatsapp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Emergency Secondary Contact</span>
                    <span className="text-slate-200 text-xs">{student.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Scan Log History */}
              <div className="p-4 bg-[#05070A] border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Recent NFC Tap History
                </h4>
                {studentScans.length === 0 ? (
                  <p className="text-slate-500 font-mono text-[11px]">No scans recorded today.</p>
                ) : (
                  <div className="space-y-1.5 font-mono text-xs">
                    {studentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-300">{scan.eventType} on {scan.vehicleId}</span>
                        <span className="text-emerald-400 font-semibold">{scan.scanTime}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
