import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { LiveCommandMap } from '../../components/map/LiveCommandMap';
import { VehicleDetailModal } from '../../components/vehicles/VehicleDetailModal';
import { AddVehicleModal } from '../../components/vehicles/AddVehicleModal';
import { Vehicle } from '../../types';
import {
  Bus,
  Users,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  Activity,
  Flame,
} from 'lucide-react';

interface SchoolOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const SchoolOverview: React.FC<SchoolOverviewProps> = ({ onNavigateTab }) => {
  const { vehicles, students, activeEmergency, setSelectedVehicleId } = useSevasData();

  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null);
  const [showAddBusModal, setShowAddBusModal] = useState<boolean>(false);

  // Statistics Computations
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'ONLINE' || v.status === 'EMERGENCY').length;
  const studentsOnBoardCount = students.filter((s) => s.isOnBoard).length;
  const totalStudentsCount = students.length;
  const presentStudentsCount = students.filter((s) => s.attendanceStatus === 'PRESENT' || s.attendanceStatus === 'ON_BOARD').length;
  const attendanceRate = totalStudentsCount > 0 ? Math.round((presentStudentsCount / totalStudentsCount) * 100) : 0;
  const activeAlertsCount = activeEmergency && activeEmergency.status === 'ACTIVE' ? 1 : 0;

  return (
    <div className="space-y-6">
      {/* Top Professional Statistics Grid (Requirement #10) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Vehicles */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Vehicles</span>
            <Bus className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{activeVehiclesCount}</span>
            <span className="text-xs text-slate-500 font-mono">/ {vehicles.length} Total</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>100% GPS Sync</span>
          </div>
        </div>

        {/* Card 2: Students On Board */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">On Board</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{studentsOnBoardCount}</span>
            <span className="text-xs text-slate-500 font-mono">Students</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            Across {activeVehiclesCount} Active Routes
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{attendanceRate}%</span>
            <span className="text-xs text-slate-500 font-mono">{presentStudentsCount}/{totalStudentsCount}</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>NFC Verified</span>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div className={`bg-[#0B0F17] rounded-xl p-4 shadow-md transition-colors border ${
          activeAlertsCount > 0 ? 'border-[#E51B24] bg-red-950/20' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? 'text-[#E51B24]' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              activeAlertsCount > 0 ? 'text-red-400' : 'text-slate-300'
            }`}>
              {activeAlertsCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">Incident</span>
          </div>
          <div className={`text-[10px] mt-2 font-mono font-bold ${
            activeAlertsCount > 0 ? 'text-[#E51B24] animate-pulse' : 'text-slate-500'
          }`}>
            {activeAlertsCount > 0 ? 'IMMEDIATE ATTENTION' : 'ALL CLEAR'}
          </div>
        </div>

        {/* Card 5: Total Students */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Enrolled Fleet</span>
            <Bus className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{vehicles.length}</span>
            <span className="text-xs text-slate-500 font-mono">Buses</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            {vehicles.reduce((acc, v) => acc + v.capacity, 0)} Seats Total
          </div>
        </div>

        {/* Card 6: Online Vehicles */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-4 shadow-md hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Gateway Stream</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">ONLINE</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            Sub-second latency
          </div>
        </div>
      </div>

      {/* Main Command Map Section (Requirement #9) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E51B24] animate-pulse"></div>
            <h3 className="font-display font-bold text-base text-white tracking-wide uppercase">
              Live Fleet Movement & Spatial Radar
            </h3>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              · Greater Cairo Metro District
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddBusModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#E51B24]" />
              <span>Add Bus</span>
            </button>
            <button
              onClick={() => onNavigateTab('live_tracking')}
              className="px-3 py-1.5 rounded-lg bg-[#E51B24]/15 hover:bg-[#E51B24]/25 border border-[#E51B24]/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Full Screen Radar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Leaflet Map */}
        <LiveCommandMap
          height="460px"
          onSelectVehicle={(v) => setInspectVehicle(v)}
        />
      </div>

      {/* Live Vehicle Monitoring Section (Requirement #11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-white tracking-wide uppercase">
              Live Vehicle Monitoring
            </h3>
            <p className="text-xs text-slate-400">
              Active school transit units streaming real-time CAN-Bus and GPS metrics
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('vehicles')}
            className="text-xs font-mono text-[#E51B24] hover:underline flex items-center gap-1"
          >
            <span>View All Fleet Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {vehicles.map((bus) => {
            const isEmergency = activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE';

            return (
              <div
                key={bus.id}
                onClick={() => setInspectVehicle(bus)}
                className={`p-4 rounded-xl border bg-[#0B0F17] hover:border-slate-600 cursor-pointer transition-all shadow-md group ${
                  isEmergency
                    ? 'border-[#E51B24] bg-red-950/20 shadow-[0_0_20px_rgba(229,27,36,0.25)]'
                    : 'border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-white">{bus.id}</span>
                    <span className="text-[10px] font-mono text-slate-500">{bus.plateNumber}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      isEmergency
                        ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                        : bus.status === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isEmergency ? 'EMERGENCY' : bus.status}
                  </span>
                </div>

                {/* Body Details */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver:</span>
                    <span className="text-white font-medium truncate max-w-[130px]">{bus.driver.fullName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Students:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {bus.studentsOnBoard} <span className="text-slate-500 font-normal">/ {bus.capacity}</span>
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Speed:</span>
                    <span className="font-mono font-bold text-white tabular-nums">{bus.currentSpeed} km/h</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">GPS Link:</span>
                    <span className="font-mono text-[11px] text-emerald-400 font-semibold">{bus.gpsStatus}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Sensors:</span>
                    <span className={`font-mono text-[11px] ${isEmergency ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                      {isEmergency ? 'COLLISION' : bus.sensorsStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{bus.lastUpdate}</span>
                  <span className="text-[#E51B24] group-hover:underline">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {inspectVehicle && (
        <VehicleDetailModal
          vehicle={inspectVehicle}
          onClose={() => setInspectVehicle(null)}
          onOpenLiveMap={() => onNavigateTab('live_tracking')}
        />
      )}

      {showAddBusModal && (
        <AddVehicleModal
          isOpen={showAddBusModal}
          onClose={() => setShowAddBusModal(false)}
        />
      )}
    </div>
  );
};
