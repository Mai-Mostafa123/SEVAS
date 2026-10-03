import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { LiveCommandMap } from '../../components/map/LiveCommandMap';
import { VehicleDetailModal } from '../../components/vehicles/VehicleDetailModal';
import { Vehicle } from '../../types';
import {
  Map,
  Bus,
  Navigation,
  Radio,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const { vehicles, activeEmergency, setFocusedMapCoords } = useSevasData();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [focusedBusId, setFocusedBusId] = useState<string>('ALL');

  const handleBusClick = (bus: Vehicle) => {
    setSelectedVehicle(bus);
    setFocusedMapCoords(bus.currentLocation);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-[#E51B24]" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              LIVE TRANSIT RADAR & GPS CORRIDOR TRACKING
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            High-precision Leaflet spatial telemetry: moving school buses along predefined Cairo route networks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#05070A] border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 FLEET UNITS LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Full-Size Map Component */}
      <div className="relative">
        <LiveCommandMap
          height="620px"
          onSelectVehicle={(bus) => setSelectedVehicle(bus)}
        />
      </div>

      {/* Quick Transit Unit Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {vehicles.map((bus) => {
          const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE';

          return (
            <div
              key={bus.id}
              onClick={() => handleBusClick(bus)}
              className={`p-3 bg-[#0B0F17] border rounded-xl cursor-pointer hover:border-slate-700 transition-all ${
                isEmergency ? 'border-[#E51B24] bg-red-950/30 shadow-[0_0_15px_rgba(229,27,36,0.3)]' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-white text-base">{bus.id}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                  isEmergency ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-emerald-400'
                }`}>
                  {isEmergency ? 'EMERGENCY' : `${bus.currentSpeed} km/h`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mb-1">{bus.assignedRoute}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Driver: {bus.driver.fullName.split(' ')[0]}</span>
                <span className="text-[#E51B24]">Focus Map →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Profile Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};
