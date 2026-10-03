import React from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import {
  Building2,
  Bus,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Phone,
  MapPin,
} from 'lucide-react';

export const SchoolsDirectoryPage: React.FC = () => {
  const { schools, vehicles, students, activeEmergency, schoolRequests } = useSevasData();

  const totalSchools = schools.length;
  const activeBuses = vehicles.length;
  const totalStudents = students.length;
  const activeAlerts = activeEmergency && activeEmergency.status === 'ACTIVE' ? 1 : 0;
  const pendingRequests = schoolRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              ENROLLED EDUCATIONAL INSTITUTIONS DIRECTORY
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            SEVAS National Transit Network: campus profiles, fleet deployments, and safety compliance
          </p>
        </div>
      </div>

      {/* System-Wide Statistics (Requirement #27) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Schools</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalSchools}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Vehicles</span>
          <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">{activeBuses}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Students</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{totalStudents}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Alerts</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${activeAlerts > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {activeAlerts}
          </span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Pending Requests</span>
          <span className={`text-2xl font-bold font-mono tabular-nums ${pendingRequests > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {pendingRequests}
          </span>
        </div>
      </div>

      {/* Schools Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">{school.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E51B24]" />
                  <span>{school.district}</span>
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                {school.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Fleet Size</span>
                <span className="text-white font-bold">{school.activeBusesCount} Buses</span>
              </div>
              <div className="bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">Students</span>
                <span className="text-emerald-400 font-bold">{school.totalStudentsCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Administrator:</span>
                <span className="text-slate-200 font-medium">{school.adminName}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Contact:</span>
                <span className="text-slate-300">{school.adminPhone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
