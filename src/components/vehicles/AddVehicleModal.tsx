import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { Bus, X, Check, Save } from 'lucide-react';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose }) => {
  const { addVehicle } = useSevasData();

  const [busNumber, setBusNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Mercedes-Benz MCV 260 School Bus');
  const [capacity, setCapacity] = useState(30);
  const [assignedRoute, setAssignedRoute] = useState('Route E — New Cairo / Tagamoa 1 Transit');

  // Driver fields
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverWhatsapp, setDriverWhatsapp] = useState('');
  const [driverNationalId, setDriverNationalId] = useState('');
  const [driverBloodType, setDriverBloodType] = useState('O+');

  // Device fields
  const [deviceId, setDeviceId] = useState(`SEV-GPS-${Math.floor(9000 + Math.random() * 999)}`);
  const [gpsModel, setGpsModel] = useState('Queclink GV350MG IoT Gateway');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busNumber.trim() || !plateNumber.trim() || !driverName.trim()) {
      setError('Please fill out all required fields marked with *');
      return;
    }

    const busId = `BUS-${busNumber.padStart(3, '0')}`;

    addVehicle({
      id: busId,
      busNumber: busNumber.padStart(3, '0'),
      plateNumber,
      deviceId,
      vehicleType,
      capacity: Number(capacity) || 30,
      assignedRoute,
      driver: {
        fullName: driverName,
        phone: driverPhone || '+20 100 000 0000',
        whatsapp: driverWhatsapp || driverPhone || '+20 100 000 0000',
        nationalId: driverNationalId || '28501010100000',
        bloodType: driverBloodType,
      },
      deviceInfo: {
        gpsModel,
        firmware: 'v3.4.1-SEVAS-SECURE',
        batteryLevel: 100,
        signalStrength: 95,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-800">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enroll New School Transit Vehicle</h3>
              <p className="text-xs text-slate-400 font-mono">SEVAS Fleet Telemetry Registration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Section 1: Vehicle Information */}
          <div>
            <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-800">
              01. Vehicle Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Bus Number * (e.g. 008)</label>
                <input
                  type="text"
                  required
                  placeholder="008"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Plate Number * (Egyptian format)</label>
                <input
                  type="text"
                  required
                  placeholder="أ ب ج 9821"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Vehicle Model & Manufacturer</label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Route</label>
                <input
                  type="text"
                  value={assignedRoute}
                  onChange={(e) => setAssignedRoute(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Driver Details */}
          <div>
            <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-800">
              02. Assigned Driver Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Hossam Nabil Farouk Mansour"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">National ID (14 digits)</label>
                <input
                  type="text"
                  placeholder="28003150109988"
                  value={driverNationalId}
                  onChange={(e) => setDriverNationalId(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+20 100 888 7766"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Blood Type</label>
                <select
                  value={driverBloodType}
                  onChange={(e) => setDriverBloodType(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry & Device Details */}
          <div>
            <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-800">
              03. Hardware Telemetry & GPS Device
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">SEVAS Hardware Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GPS Gateway Model</label>
                <input
                  type="text"
                  value={gpsModel}
                  onChange={(e) => setGpsModel(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.5)] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enroll Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
