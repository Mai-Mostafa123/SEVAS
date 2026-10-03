import React, { useState, useMemo, useEffect } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { Vehicle, Student } from '../../types';
import {
  Bus,
  MapPin,
  Users,
  Navigation,
  Check,
  Phone,
  AlertTriangle,
  ArrowLeft,
  Search,
  CreditCard,
  Heart,
  ChevronRight,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
  UserCheck,
  UserX,
  Volume2,
  X,
  Radio,
  BellRing,
  AlertOctagon,
} from 'lucide-react';

interface DriverViewProps {
  onClose: () => void;
  defaultVehicleId?: string;
}

export const DriverView: React.FC<DriverViewProps> = ({
  onClose,
  defaultVehicleId = 'BUS-007',
}) => {
  const {
    vehicles,
    students,
    activeEmergency,
    simulateNfcScan,
    toggleStudentBoarding,
    triggerDriverSos,
    resolveEmergency,
  } = useSevasData();

  // Selected vehicle for the driver view (defaults to BUS-007 or available)
  const [selectedBusId, setSelectedBusId] = useState<string>(() => {
    const found = vehicles.find((v) => v.id === defaultVehicleId);
    return found ? found.id : vehicles[0]?.id || 'BUS-007';
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ON_BOARD' | 'WAITING'>('ALL');
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [tapFeedback, setTapFeedback] = useState<string | null>(null);
  const [sosSuccessBanner, setSosSuccessBanner] = useState<boolean>(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState<boolean>(false);

  // Active Vehicle
  const currentBus = useMemo(() => {
    return vehicles.find((v) => v.id === selectedBusId) || vehicles[0];
  }, [vehicles, selectedBusId]);

  // Students assigned to this vehicle
  const busStudents = useMemo(() => {
    if (!currentBus) return [];
    return students.filter((s) => s.assignedVehicleId === currentBus.id);
  }, [students, currentBus]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return busStudents.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nfcId.toLowerCase().includes(studentSearch.toLowerCase());

      if (statusFilter === 'ON_BOARD') return matchesSearch && s.isOnBoard;
      if (statusFilter === 'WAITING') return matchesSearch && !s.isOnBoard;
      return matchesSearch;
    });
  }, [busStudents, studentSearch, statusFilter]);

  const onboardCount = busStudents.filter((s) => s.isOnBoard).length;
  const waitingCount = busStudents.filter((s) => !s.isOnBoard).length;

  const isEmergencyActive =
    activeEmergency &&
    activeEmergency.vehicleId === currentBus?.id &&
    activeEmergency.status === 'ACTIVE';

  // Audio tone simulation for emergency activation
  const playSosChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // AudioContext not allowed or not supported
    }
  };

  // Toggle student boarding
  const handleToggleBoarding = (student: Student) => {
    const nextEvent = student.isOnBoard ? 'DEBOARD' : 'BOARD';
    simulateNfcScan(student.id, nextEvent);

    setTapFeedback(
      `${student.fullName.split(' ')[0]} ${nextEvent === 'BOARD' ? 'Boarded' : 'Deboarded'}`
    );
    setTimeout(() => setTapFeedback(null), 2500);
  };

  // Trigger Immediate Driver SOS to Central SEVAS Emergency Management
  const handleTriggerSos = () => {
    if (!currentBus) return;
    playSosChime();
    triggerDriverSos(currentBus.id, 'DRIVER_MANUAL_SOS');
    setShowSosConfirm(false);
    setSosSuccessBanner(true);
    setTimeout(() => setSosSuccessBanner(false), 5000);
  };

  // Resolve Emergency
  const handleResolveSos = () => {
    if (!activeEmergency) return;
    resolveEmergency(activeEmergency.id, 'Driver declared all clear and vehicle safely restabilized.');
    setShowResolveConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070A] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* 1. Mobile Driver Top Bar */}
      <header className="h-14 bg-[#070A0F] border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Return to Main Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm text-white tracking-wide">
                DRIVER COCKPIT
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#E51B24]/20 border border-[#E51B24]/40 text-red-300 px-1.5 py-0.2 rounded uppercase">
                MOBILE VIEW
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[170px] sm:max-w-xs">
              {currentBus?.driver.fullName}
            </p>
          </div>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="bg-[#0B0F17] border border-slate-700 text-white font-mono text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#E51B24]"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.plateNumber})
              </option>
            ))}
          </select>

          <button
            onClick={onClose}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono transition-colors"
          >
            Exit Driver View
          </button>
        </div>
      </header>

      {/* Tap Toast Feedback Notification */}
      {tapFeedback && (
        <div className="bg-emerald-950 border-y border-emerald-600 px-4 py-2 text-center text-xs font-mono font-bold text-emerald-300 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200 shrink-0">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{tapFeedback}</span>
        </div>
      )}

      {/* SOS Success Banner */}
      {sosSuccessBanner && (
        <div className="bg-[#E51B24] border-y border-white px-4 py-2.5 text-center text-xs font-mono font-black text-white flex items-center justify-center gap-2 animate-bounce shrink-0 shadow-lg">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>HIGH-PRIORITY SOS DISPATCHED TO SEVAS CENTRAL EMERGENCY SYSTEM</span>
        </div>
      )}

      {/* 2. Main Scrollable Mobile Cockpit Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 max-w-2xl mx-auto w-full pb-24">
        {/* PROMINENT EMERGENCY SOS SECTION (HERO PRIORITY) */}
        {!isEmergencyActive ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#E51B24] bg-gradient-to-r from-[#2A0507] via-[#1B0305] to-[#2A0507] p-3.5 sm:p-4 shadow-[0_0_30px_rgba(229,27,36,0.45)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E51B24]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="absolute -inset-1.5 bg-red-600/40 rounded-full animate-ping pointer-events-none" />
                  <div className="relative p-3 bg-[#E51B24] text-white rounded-full shadow-[0_0_15px_#E51B24]">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-white tracking-wider">
                      EMERGENCY SOS
                    </span>
                    <span className="bg-[#E51B24] text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded uppercase tracking-widest">
                      HIGH PRIORITY
                    </span>
                  </div>
                  <p className="text-[11px] text-red-200/90 font-mono">
                    Immediate broadcast to Paramedics (123) & School Command
                  </p>
                </div>
              </div>

              {/* Big Tactile Trigger Button */}
              <button
                onClick={() => setShowSosConfirm(true)}
                className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-[#E51B24] hover:bg-red-700 active:scale-95 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(229,27,36,0.7)] transition-all cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4 animate-spin text-white" />
                <span>TRIGGER SOS ALERT</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Emergency Beacon Banner */
          <div className="rounded-2xl border-2 border-[#E51B24] bg-gradient-to-r from-[#3D080A] via-[#240305] to-[#3D080A] p-4 shadow-[0_0_40px_rgba(229,27,36,0.6)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#E51B24] text-white rounded-xl shadow-[0_0_15px_#E51B24] animate-bounce">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-white tracking-wider">
                      🚨 ACTIVE HIGH-PRIORITY SOS
                    </span>
                    <span className="bg-[#E51B24] text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded animate-pulse">
                      SEVERE
                    </span>
                  </div>
                  <p className="text-xs text-red-200 font-mono">
                    Central SEVAS Emergency Command: INCIDENT {activeEmergency?.id}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                123 DISPATCHED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#05070A]/80 p-2.5 rounded-lg border border-red-900/60">
              <div>
                <span className="text-slate-500 text-[10px] block">Students at Risk</span>
                <span className="text-emerald-400 font-bold">{onboardCount} On Board</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Central Telemetry</span>
                <span className="text-red-400 font-bold animate-pulse">STREAMING LIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="tel:123"
                className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Paramedics (123)</span>
              </a>

              <button
                onClick={() => setShowResolveConfirm(true)}
                className="min-h-[40px] px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-colors"
              >
                Clear / All Safe
              </button>
            </div>
          </div>
        )}

        {/* Route & Vehicle Glanceable Telemetry Card */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                Assigned Route Corridor
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#E51B24] shrink-0" />
                <span className="truncate">{currentBus?.assignedRoute}</span>
              </h2>
            </div>

            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                isEmergencyActive
                  ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                  : currentBus?.status === 'ONLINE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isEmergencyActive ? 'SOS ACTIVE' : currentBus?.status}
            </span>
          </div>

          {/* Key Glanceable Counters: Speed, Capacity & GPS */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
            {/* Speed */}
            <div className="bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Speed</span>
              <span className="text-xl font-black text-white tabular-nums">
                {currentBus?.currentSpeed}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">km/h</span>
              </span>
            </div>

            {/* Students Onboard */}
            <div className="bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">On Board</span>
              <span className="text-xl font-black text-emerald-400 tabular-nums">
                {onboardCount}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">
                  / {currentBus?.capacity}
                </span>
              </span>
            </div>

            {/* GPS Link */}
            <div className="bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">GPS Link</span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200">
                  {currentBus?.gpsStatus === 'ACTIVE' ? 'ONLINE' : 'SYNC'}
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Bus Occupancy Capacity</span>
              <span>{Math.round((onboardCount / (currentBus?.capacity || 30)) * 100)}% Full</span>
            </div>
            <div className="w-full bg-[#05070A] h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (onboardCount / (currentBus?.capacity || 30)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Next Transit Stop HUD */}
          <div className="bg-[#05070A] p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-900/60 shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Next Stop Destination
                </span>
                <span className="font-semibold text-white">
                  Gate 2 — Al-Farabi Modern Academy
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  ETA: ~4 mins · 1.8 km
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-1 rounded border border-emerald-900/50">
              APPROACHING
            </span>
          </div>
        </div>

        {/* 3. Student Boarding & Manifest Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Student Boarding Manifest
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {onboardCount} on board · {waitingCount} waiting
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or NFC..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E51B24]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#0B0F17] border border-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400'
                }`}
              >
                All ({busStudents.length})
              </button>
              <button
                onClick={() => setStatusFilter('ON_BOARD')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'ON_BOARD'
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                    : 'text-slate-400'
                }`}
              >
                On ({onboardCount})
              </button>
              <button
                onClick={() => setStatusFilter('WAITING')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'WAITING'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400'
                }`}
              >
                Off ({waitingCount})
              </button>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-6 text-center text-slate-500 font-mono text-xs">
                No students found for this bus under the selected filter.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-3 rounded-xl border transition-all ${
                    student.isOnBoard
                      ? 'bg-[#0B0F17] border-emerald-900/60 shadow-sm'
                      : 'bg-[#080B10] border-slate-800/80 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Student Identity */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                          {student.fullName}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/60 px-1 rounded shrink-0">
                          {student.bloodType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-mono text-slate-400 mt-1">
                        <span>{student.classGrade}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold">{student.nfcId}</span>
                        {student.lastScanTime && (
                          <>
                            <span>·</span>
                            <span className="text-slate-300">
                              {student.isOnBoard ? 'Boarded at' : 'Scanned'}: {student.lastScanTime}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Medical alert banner if allergies or condition present */}
                      {(student.medicalInfo !== 'None recorded' || student.allergies !== 'None recorded') && (
                        <div className="mt-1.5 p-1.5 rounded bg-amber-950/30 border border-amber-900/40 text-[10px] text-amber-300 flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="truncate">
                            {student.medicalInfo !== 'None recorded' ? student.medicalInfo : student.allergies}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions: One-Tap Boarding Button & Call Parent */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {/* One-tap Board / Deboard button (Min 44px touch target) */}
                      <button
                        onClick={() => handleToggleBoarding(student)}
                        className={`min-h-[44px] px-3.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                          student.isOnBoard
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                        title={student.isOnBoard ? 'Click to Deboard student' : 'Click to Board student'}
                      >
                        {student.isOnBoard ? (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span>ON BOARD</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 text-slate-400" />
                            <span>TAP BOARD</span>
                          </>
                        )}
                      </button>

                      {/* Quick Call Parent */}
                      <a
                        href={`tel:${student.parentPhone}`}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 py-1 px-1.5 rounded hover:bg-slate-800 transition-colors"
                        title={`Call Guardian: ${student.parent1Name}`}
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Guardian ({student.parentPhone.slice(-4)})</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. PERSISTENT STICKY MOBILE EMERGENCY SOS BAR AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070A0F]/95 backdrop-blur-md border-t border-slate-800 p-3 max-w-2xl mx-auto shadow-2xl">
        <button
          onClick={() => {
            if (isEmergencyActive) {
              setShowResolveConfirm(true);
            } else {
              setShowSosConfirm(true);
            }
          }}
          className={`w-full min-h-[50px] rounded-xl flex items-center justify-center gap-2.5 font-mono font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all active:scale-[0.98] ${
            isEmergencyActive
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_30px_rgba(229,27,36,0.6)] animate-pulse'
              : 'bg-[#E51B24] hover:bg-red-700 text-white shadow-[0_0_25px_rgba(229,27,36,0.5)]'
          }`}
        >
          <ShieldAlert className="w-5 h-5 animate-pulse shrink-0" />
          <span>
            {isEmergencyActive
              ? '🚨 EMERGENCY SOS ACTIVE — TAP TO MANAGE'
              : '🚨 EMERGENCY SOS — BROADCAST HIGH PRIORITY'}
          </span>
        </button>
      </div>

      {/* SOS Confirmation Dialog */}
      {showSosConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B0F17] border-2 border-[#E51B24] rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(229,27,36,0.6)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E51B24] text-white rounded-xl shadow-[0_0_20px_#E51B24] animate-bounce">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Broadcast Emergency SOS?</h3>
                <p className="text-xs font-mono text-red-400 font-bold">
                  Vehicle: {currentBus?.id} · High-Priority
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will trigger an <strong className="text-red-400">immediate high-priority alert status</strong> across the entire central SEVAS emergency management system for{' '}
              <strong className="text-white font-mono">{currentBus?.id}</strong> with{' '}
              <strong className="text-emerald-400 font-mono">{onboardCount} students</strong> on board.
            </p>

            <div className="bg-[#05070A] p-2.5 rounded-lg border border-red-900/50 text-[11px] font-mono text-slate-400 space-y-1">
              <div>• Paramedic Dispatch (123): <span className="text-emerald-400 font-bold">AUTOMATIC</span></div>
              <div>• School Command Notification: <span className="text-emerald-400 font-bold">IMMEDIATE</span></div>
              <div>• Vehicle Telemetry & Map Radar: <span className="text-red-400 font-bold">LOCKED & STREAMING</span></div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSosConfirm(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerSos}
                className="px-5 py-2.5 rounded-lg bg-[#E51B24] hover:bg-red-700 text-xs font-bold font-mono text-white flex items-center gap-1.5 shadow-[0_0_20px_rgba(229,27,36,0.7)] transition-all animate-pulse"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>CONFIRM & BROADCAST SOS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Confirmation Dialog */}
      {showResolveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0B0F17] border border-emerald-600/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Clear Active Emergency?</h3>
                <p className="text-xs font-mono text-emerald-400">All Students Safe & Stabilized</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Confirm that on-site situation for <strong className="text-white font-mono">{currentBus?.id}</strong> is clear and safe to restore standard fleet telemetry.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResolveConfirm(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveSos}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold font-mono text-white flex items-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Clear Emergency SOS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
