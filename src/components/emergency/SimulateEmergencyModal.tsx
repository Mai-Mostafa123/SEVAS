import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { EmergencySeverity } from '../../types';
import { AlertTriangle, Flame, ShieldAlert, X, Zap } from 'lucide-react';

interface SimulateEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulateEmergencyModal: React.FC<SimulateEmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { vehicles, simulateAccident } = useSevasData();

  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicles[3]?.id || vehicles[0]?.id || 'BUS-007');
  const [severity, setSeverity] = useState<EmergencySeverity>('SEVERE');
  const [fireDetected, setFireDetected] = useState<boolean>(false);
  const [locationPreset, setLocationPreset] = useState<string>('Cairo Ring Road — Choueifat Interchange');

  if (!isOpen) return null;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    simulateAccident(selectedVehicle, severity, fireDetected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0B0F17] border border-[#E51B24]/60 rounded-xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(229,27,36,0.3)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">SIMULATE ACCIDENT EVENT</h3>
              <p className="text-[11px] font-mono text-[#E51B24] uppercase tracking-wider font-semibold">
                [ Development & Verification Sandbox Mode ]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-xs text-slate-300">
          <p className="font-mono text-slate-300 text-[11px] leading-relaxed">
            Testing workflow: <span className="text-white font-bold">Vehicle Sensors</span> →{' '}
            <span className="text-red-400 font-bold">AI Accident Detection</span> →{' '}
            <span className="text-white font-bold">GPS Coordinates</span> →{' '}
            <span className="text-amber-400 font-bold">School Admin Decision</span> →{' '}
            <span className="text-emerald-400 font-bold">Parent Alert</span>.
          </p>
        </div>

        <form onSubmit={handleSimulate} className="space-y-4 text-xs">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
              Target Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.plateNumber} ({v.studentsOnBoard} Onboard, Driver: {v.driver.fullName})
                </option>
              ))}
            </select>
          </div>

          {/* Severity Levels */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1.5">
              Incident Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'SEVERE'] as EmergencySeverity[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`p-2.5 rounded-lg border font-mono font-bold text-center transition-all ${
                    severity === lvl
                      ? lvl === 'SEVERE'
                        ? 'bg-[#E51B24] border-[#E51B24] text-white shadow-[0_0_12px_rgba(229,27,36,0.6)]'
                        : lvl === 'MEDIUM'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Location Preset */}
          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
              Geographic Locus
            </label>
            <select
              value={locationPreset}
              onChange={(e) => setLocationPreset(e.target.value)}
              className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
            >
              <option value="Cairo Ring Road — Choueifat Interchange">Cairo Ring Road — Choueifat Interchange</option>
              <option value="New Cairo 5th Settlement — South 90th St">New Cairo 5th Settlement — South 90th St</option>
              <option value="Maadi Corniche — Autostrad Intersection">Maadi Corniche — Autostrad Intersection</option>
              <option value="Nasr City — Abbas El-Akkad Transit Corridor">Nasr City — Abbas El-Akkad Transit Corridor</option>
            </select>
          </div>

          {/* Fire / Smoke Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${fireDetected ? 'text-red-400' : 'text-slate-500'}`} />
              <div>
                <span className="text-white font-medium block">Simulate Fire / Smoke Detection</span>
                <span className="text-[10px] text-slate-400">Trigger thermal sensor & engine bay alert</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFireDetected(!fireDetected)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                fireDetected ? 'bg-[#E51B24]' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  fireDetected ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.6)] transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trigger Simulated Emergency</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
