import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { CreditCard, Wifi, CheckCircle2, RefreshCw, Radio } from 'lucide-react';

export const NfcReaderSimulation: React.FC = () => {
  const { students, nfcScans, simulateNfcScan } = useSevasData();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [eventType, setEventType] = useState<'BOARD' | 'DEBOARD' | 'SCHOOL_ARRIVAL'>('BOARD');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanResult, setLastScanResult] = useState<string | null>(null);

  const lastScan = nfcScans[0];

  const handleTapCard = () => {
    if (!selectedStudentId) return;
    setIsScanning(true);
    setLastScanResult(null);

    setTimeout(() => {
      const res = simulateNfcScan(selectedStudentId, eventType);
      setIsScanning(false);
      if (res.success) {
        setLastScanResult(res.message);
      }
    }, 600);
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Subtle Sensor Grid */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E51B24]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
        {/* Visual NFC Reader Hardware Surface */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#05070A] border-2 border-slate-800 w-full lg:w-72 text-center relative group">
          {/* Signal Indicator Wave */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full border border-slate-700 flex items-center justify-center ${
              isScanning ? 'border-[#E51B24] animate-ping' : ''
            }`}>
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <Wifi className={`w-7 h-7 ${isScanning ? 'text-[#E51B24] animate-pulse' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>

          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-1">
            SEVAS NFC TERMINAL
          </h4>
          <p className="text-[10px] font-mono text-slate-400 mb-3">
            {isScanning ? 'TRANSMITTING NFC PAYLOAD...' : 'WAITING FOR STUDENT CARD...'}
          </p>

          <button
            onClick={handleTapCard}
            disabled={isScanning}
            className="w-full py-2.5 px-4 rounded-lg bg-[#E51B24] hover:bg-red-700 disabled:opacity-50 text-white font-mono font-bold text-xs shadow-[0_0_15px_rgba(229,27,36,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isScanning ? 'Reading RFID...' : 'SIMULATE CARD TAP'}</span>
          </button>
        </div>

        {/* Live Reader Status & Controls */}
        <div className="flex-1 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Select Student Card to Tap
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.nfcId}) — {s.classGrade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Reader Mode / Gate Action
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
              >
                <option value="BOARD">Bus Entry: BOARD VEHICLE</option>
                <option value="DEBOARD">Bus Exit: DEBOARD VEHICLE</option>
                <option value="SCHOOL_ARRIVAL">School Campus: ARRIVAL GATE SCAN</option>
              </select>
            </div>
          </div>

          {/* Last Scan Live Feedback Box */}
          <div className="p-3.5 bg-[#05070A] border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">
                LAST RECORDED NFC SCAN
              </span>
              {lastScan ? (
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xs">{lastScan.studentName}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-mono font-bold text-xs">{lastScan.vehicleId}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono text-xs">{lastScan.scanTime}</span>
                </div>
              ) : (
                <span className="text-slate-500 font-mono text-xs">No scan events recorded yet today.</span>
              )}
            </div>

            {lastScan && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                {lastScan.status}
              </span>
            )}
          </div>

          {lastScanResult && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-700 rounded-lg text-xs text-emerald-300 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{lastScanResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
