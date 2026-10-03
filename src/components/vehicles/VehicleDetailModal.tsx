import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useSevasData } from '../../context/SevasDataContext';
import {
  Bus,
  X,
  MapPin,
  Users,
  Shield,
  Phone,
  Radio,
  Clock,
  Activity,
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Smartphone,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenLiveMap?: () => void;
  onOpenDriverView?: (vehicleId: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenLiveMap,
  onOpenDriverView,
}) => {
  const { students, nfcScans, emergencyHistory, activeEmergency } = useSevasData();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'STUDENTS' | 'ATTENDANCE' | 'ALERTS'>('DETAILS');

  if (!vehicle) return null;

  const studentsOnboard = students.filter((s) => s.assignedVehicleId === vehicle.id && s.isOnBoard);
  const vehicleScans = nfcScans.filter((s) => s.vehicleId === vehicle.id);
  const isEmergency = activeEmergency && activeEmergency.vehicleId === vehicle.id;

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg border ${
                isEmergency
                  ? 'bg-[#E51B24] text-white border-white animate-pulse'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{vehicle.id}</h3>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-mono">{vehicle.plateNumber}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isEmergency
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : vehicle.status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isEmergency ? 'EMERGENCY' : vehicle.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-md">{vehicle.assignedRoute}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLiveMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLiveMap();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#E51B24]/15 hover:bg-[#E51B24]/30 border border-[#E51B24]/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E51B24]" />
                <span>Live Radar</span>
              </button>
            )}

            {onOpenDriverView && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDriverView(vehicle.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Launch Mobile Driver View for this bus"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Driver View</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 bg-[#05070A] border-b border-slate-800 text-xs font-medium overflow-x-auto">
          {[
            { id: 'DETAILS', label: 'Vehicle Details' },
            { id: 'STUDENTS', label: `Students On Board (${studentsOnboard.length})` },
            { id: 'ATTENDANCE', label: 'Recent NFC Scans' },
            { id: 'ALERTS', label: 'Safety & Alert Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 font-mono whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#E51B24] text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'DETAILS' && (
            <div className="space-y-5">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#05070A] p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Current Speed</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">{vehicle.currentSpeed} km/h</span>
                </div>
                <div className="bg-[#05070A] p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Occupancy</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {vehicle.studentsOnBoard} / {vehicle.capacity}
                  </span>
                </div>
                <div className="bg-[#05070A] p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">GPS Link</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {vehicle.gpsStatus}
                  </span>
                </div>
                <div className="bg-[#05070A] p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Sensor Gateway</span>
                  <span className="text-sm font-bold font-mono text-slate-200 mt-1 block">
                    {vehicle.sensorsStatus}
                  </span>
                </div>
              </div>

              {/* Driver Details */}
              <div className="bg-[#05070A] p-4 rounded-lg border border-slate-800 space-y-3">
                <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Driver Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Full Name</span>
                    <span className="text-white font-semibold">{vehicle.driver.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Blood Type</span>
                    <span className="text-red-400 font-mono font-bold">{vehicle.driver.bloodType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone & WhatsApp</span>
                    <span className="text-slate-200 font-mono">{vehicle.driver.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">National ID</span>
                    <span className="text-slate-400 font-mono">{vehicle.driver.nationalId}</span>
                  </div>
                </div>
              </div>

              {/* Hardware Device */}
              <div className="bg-[#05070A] p-4 rounded-lg border border-slate-800 space-y-3">
                <h4 className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  IoT Hardware & GPS Gateway
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Device ID</span>
                    <span className="text-slate-200">{vehicle.deviceId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Model</span>
                    <span className="text-slate-300">{vehicle.deviceInfo.gpsModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Battery & Signal</span>
                    <span className="text-emerald-400">{vehicle.deviceInfo.batteryLevel}% / {vehicle.deviceInfo.signalStrength}% RSSI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STUDENTS' && (
            <div>
              {studentsOnboard.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono">
                  No students currently flagged as onboard this bus.
                </div>
              ) : (
                <div className="space-y-2">
                  {studentsOnboard.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 bg-[#05070A] border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="text-white font-semibold block">{student.fullName}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>{student.classGrade}</span>
                          <span>·</span>
                          <span>ID: {student.studentId}</span>
                          <span>·</span>
                          <span className="text-red-400">Blood: {student.bloodType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ONBOARD ({student.lastScanTime})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-2">
              {vehicleScans.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono">
                  No NFC reader scans recorded for this vehicle today.
                </div>
              ) : (
                vehicleScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-3 bg-[#05070A] border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="text-white font-medium block">{scan.studentName}</span>
                      <span className="text-slate-500 text-[10px]">NFC ID: {scan.nfcId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">{scan.eventType}</span>
                      <span className="text-slate-500 text-[10px]">{scan.scanTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'ALERTS' && (
            <div>
              {isEmergency && activeEmergency ? (
                <div className="p-4 bg-red-950/40 border border-[#E51B24] rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ACTIVE EMERGENCY ALERT — {activeEmergency.severity}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{activeEmergency.description}</p>
                  <div className="text-[11px] font-mono text-slate-400 pt-1">
                    Recorded at: {activeEmergency.time} · Location: {activeEmergency.locationName}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 font-mono">
                  No active or past incidents recorded for this bus. Fleet operating nominally.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
