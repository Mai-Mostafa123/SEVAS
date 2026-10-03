import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { LiveCommandMap } from '../../components/map/LiveCommandMap';
import { AddVehicleModal } from '../../components/vehicles/AddVehicleModal';
import { VehicleDetailModal } from '../../components/vehicles/VehicleDetailModal';
import { Vehicle } from '../../types';
import {
  Bus,
  Plus,
  MapPin,
  List,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Phone,
} from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const { vehicles, activeEmergency } = useSevasData();

  const [viewMode, setViewMode] = useState<'LOCATION' | 'DETAILS'>('LOCATION');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'EMERGENCY' | 'OFFLINE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((bus) => {
    const matchesSearch =
      bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.assignedRoute.toLowerCase().includes(searchQuery.toLowerCase());

    const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id;
    const currentStatus = isEmergency ? 'EMERGENCY' : bus.status;

    const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header (Requirement #11) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
            VEHICLES FLEET MANAGEMENT
          </h2>
          <p className="text-xs text-slate-400">
            Real-time GPS tracking, sensor telemetry, and driver credentials
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggle: [ LOCATION VIEW ] [ DETAILS VIEW ] */}
          <div className="bg-[#05070A] p-1 rounded-lg border border-slate-800 flex items-center text-xs font-mono">
            <button
              onClick={() => setViewMode('LOCATION')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === 'LOCATION'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#E51B24]" />
              <span>LOCATION VIEW</span>
            </button>
            <button
              onClick={() => setViewMode('DETAILS')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === 'DETAILS'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5 text-blue-400" />
              <span>DETAILS VIEW</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.4)] transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD NEW BUS</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Bus ID, Plate, Driver, Route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#E51B24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <span className="text-slate-500 text-[11px]">Filter:</span>
          {(['ALL', 'ONLINE', 'EMERGENCY', 'OFFLINE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Location View (Map with vehicle cards) */}
      {viewMode === 'LOCATION' && (
        <div className="space-y-4">
          <LiveCommandMap
            height="500px"
            onSelectVehicle={(bus) => setSelectedVehicle(bus)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {filteredVehicles.map((bus) => {
              const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE';

              return (
                <div
                  key={bus.id}
                  onClick={() => setSelectedVehicle(bus)}
                  className={`p-3.5 bg-[#0B0F17] border rounded-xl cursor-pointer hover:border-slate-700 transition-all ${
                    isEmergency ? 'border-[#E51B24] bg-red-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-white text-base">{bus.id}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isEmergency ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-emerald-400'
                    }`}>
                      {isEmergency ? 'EMERGENCY' : bus.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Speed:</span>
                      <span className="font-mono text-white font-bold">{bus.currentSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Students:</span>
                      <span className="font-mono text-emerald-400 font-bold">{bus.studentsOnBoard} / {bus.capacity}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GPS:</span>
                      <span className="font-mono text-emerald-400 text-[10px]">{bus.gpsStatus}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Details View (Professional high-density table) */}
      {viewMode === 'DETAILS' && (
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070A0F] border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Bus ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Plate Number</th>
                  <th className="py-3 px-4">Students On Board</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">GPS / Sensors</th>
                  <th className="py-3 px-4">Assigned Driver</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredVehicles.map((bus) => {
                  const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE';

                  return (
                    <tr
                      key={bus.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        isEmergency ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-display font-bold text-white text-sm">
                        {bus.id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isEmergency
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : bus.status === 'ONLINE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isEmergency ? 'EMERGENCY' : bus.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">
                        {bus.plateNumber}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                        {bus.studentsOnBoard} <span className="text-slate-500 font-normal">/ {bus.capacity}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-white tabular-nums">
                        {bus.currentSpeed} km/h
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-emerald-400 block">{bus.gpsStatus}</span>
                        <span className="text-slate-500 text-[10px] block">{bus.sensorsStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{bus.driver.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{bus.driver.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-[180px] truncate" title={bus.assignedRoute}>
                        {bus.assignedRoute}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedVehicle(bus)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onOpenLiveMap={() => setViewMode('LOCATION')}
        />
      )}

      {showAddModal && (
        <AddVehicleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};
