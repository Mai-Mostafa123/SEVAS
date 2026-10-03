import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSevasData } from '../../context/SevasDataContext';
import {
  Radio,
  Wifi,
  Cpu,
  AlertCircle,
  UserCheck,
  Shield,
  ChevronRight,
  Bus,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenSimulateModal: () => void;
  onToggleDriverView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSimulateModal,
  onToggleDriverView,
}) => {
  const { user, switchRole } = useAuth();
  const { activeEmergency, isSimulationActive } = useSevasData();

  const tabTitleMap: { [key: string]: string } = {
    overview: 'Mission Command Overview',
    vehicles: 'School Buses & Fleet Telemetry',
    live_tracking: 'Live Transit Radar & GPS Map',
    students: 'Student Manifest & Safety Profiles',
    nfc_attendance: 'NFC Contactless Gate & Bus Attendance',
    emergency_center: 'Emergency Response Command Center',
    ai_monitoring: 'AI Computer Vision & Accident Telemetry',
    parent_comm: 'Automated Parent WhatsApp Dispatch',
    reports: 'Operational Analytics & Audit Reports',
    settings: 'System Telemetry & Device Configurations',
    schools_directory: 'Enrolled Schools Network Directory',
    school_requests: 'Administrative Onboarding Requests',
  };

  return (
    <header className="h-14 bg-[#070A0F] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Contextual Breadcrumb & Current View */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-display font-bold tracking-wider text-slate-400 uppercase text-[11px]">
          SEVAS
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-semibold text-white tracking-wide">
          {tabTitleMap[currentTab] || 'Command Center'}
        </span>
      </div>

      {/* Zone 2: Real-time System Connectivity Status */}
      <div className="hidden md:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] text-slate-400">WS GATEWAY:</span>
          <span className="text-[11px] text-emerald-400 font-semibold">CONNECTED</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Wifi className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] text-slate-400">GPS TELEMETRY:</span>
          <span className="text-[11px] text-blue-300 font-semibold">
            {isSimulationActive ? 'LIVE (STREAM)' : 'IDLE'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] text-slate-400">EDGE AI:</span>
          <span className="text-[11px] text-purple-300 font-semibold">YOLOv11 30 FPS</span>
        </div>
      </div>

      {/* Zone 3: Quick Role Switcher for Testing & Admin Badge */}
      <div className="flex items-center gap-2.5">
        {/* Driver View Quick Launch */}
        <button
          onClick={onToggleDriverView}
          className="px-2.5 py-1.5 rounded-lg bg-[#E51B24]/15 hover:bg-[#E51B24]/25 border border-[#E51B24]/40 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          title="Toggle Mobile Driver Cockpit View"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#E51B24]" />
          <span className="hidden sm:inline">Driver View</span>
        </button>

        {/* Testing Role Switcher */}
        <div className="flex items-center bg-[#05070A] border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => switchRole('SCHOOL_ADMIN')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              user?.role === 'SCHOOL_ADMIN'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to School Admin perspective"
          >
            School Admin
          </button>
          <button
            onClick={() => switchRole('SEVAS_TEAM_LEADER')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              user?.role === 'SEVAS_TEAM_LEADER'
                ? 'bg-[#E51B24] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to SEVAS Team Leader perspective"
          >
            SEVAS Leader
          </button>
        </div>

        {/* Emergency Alert Indicator if active */}
        {activeEmergency && (
          <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-800 text-red-300 px-2.5 py-1 rounded-lg text-xs font-mono font-bold animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">CRITICAL ALERT</span>
          </div>
        )}
      </div>
    </header>
  );
};
