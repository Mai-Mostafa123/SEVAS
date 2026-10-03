import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSevasData } from '../../context/SevasDataContext';
import { SevasLogo } from './SevasLogo';
import {
  LayoutDashboard,
  Bus,
  Map,
  Users,
  CreditCard,
  AlertTriangle,
  Cpu,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  FileCheck2,
  LogOut,
  Zap,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSimulateModal: () => void;
  onOpenDriverView?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSimulateModal,
  onOpenDriverView,
  collapsed = false,
}) => {
  const { user, logout, switchRole } = useAuth();
  const { activeEmergency, schoolRequests } = useSevasData();

  const isTeamLeader = user?.role === 'SEVAS_TEAM_LEADER' || user?.role === 'SEVAS_TEAM_MEMBER';
  const pendingRequestsCount = schoolRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#070A0F] border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col items-center justify-center bg-[#05070A]">
        {collapsed ? (
          <SevasLogo size="sm" variant="shield" showSlogan={false} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <SevasLogo size="sm" variant="full" showSlogan={true} />
          </div>
        )}
      </div>

      {/* Role / School Badge */}
      {!collapsed && (
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/50 flex items-center justify-between">
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {isTeamLeader ? 'COMMAND CENTER' : 'SCHOOL PORTAL'}
            </span>
            <span className="text-xs font-semibold text-white truncate block">
              {isTeamLeader ? 'SEVAS Fleet Operations' : user?.schoolName?.split('(')[0] || 'Al-Farabi International'}
            </span>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
              isTeamLeader ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
            }`}
          >
            {isTeamLeader ? 'SEVAS' : 'ADMIN'}
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Common & School Admin Navigation */}
        <NavItem
          id="overview"
          label="Overview"
          icon={<LayoutDashboard className="w-4 h-4" />}
          active={currentTab === 'overview'}
          onClick={() => setCurrentTab('overview')}
          collapsed={collapsed}
        />

        {isTeamLeader && (
          <>
            <div className="pt-3 pb-1 px-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
              {!collapsed && 'HQ Management'}
            </div>
            <NavItem
              id="schools_directory"
              label="Schools Directory"
              icon={<Building2 className="w-4 h-4" />}
              active={currentTab === 'schools_directory'}
              onClick={() => setCurrentTab('schools_directory')}
              collapsed={collapsed}
            />
            <NavItem
              id="school_requests"
              label="Registration Requests"
              icon={<FileCheck2 className="w-4 h-4" />}
              active={currentTab === 'school_requests'}
              onClick={() => setCurrentTab('school_requests')}
              badge={pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined}
              badgeColor="amber"
              collapsed={collapsed}
            />
          </>
        )}

        <div className="pt-3 pb-1 px-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
          {!collapsed && 'Transit & Safety'}
        </div>

        <NavItem
          id="vehicles"
          label="Vehicles Fleet"
          icon={<Bus className="w-4 h-4" />}
          active={currentTab === 'vehicles'}
          onClick={() => setCurrentTab('vehicles')}
          collapsed={collapsed}
        />

        <NavItem
          id="driver_view"
          label="Driver Mobile Cockpit"
          icon={<Smartphone className="w-4 h-4 text-amber-400" />}
          active={currentTab === 'driver_view'}
          onClick={() => {
            if (onOpenDriverView) {
              onOpenDriverView();
            } else {
              setCurrentTab('driver_view');
            }
          }}
          collapsed={collapsed}
        />

        <NavItem
          id="live_tracking"
          label="Live GPS Tracking"
          icon={<Map className="w-4 h-4" />}
          active={currentTab === 'live_tracking'}
          onClick={() => setCurrentTab('live_tracking')}
          collapsed={collapsed}
        />

        <NavItem
          id="students"
          label="Students"
          icon={<Users className="w-4 h-4" />}
          active={currentTab === 'students'}
          onClick={() => setCurrentTab('students')}
          collapsed={collapsed}
        />

        <NavItem
          id="nfc_attendance"
          label="NFC Attendance"
          icon={<CreditCard className="w-4 h-4" />}
          active={currentTab === 'nfc_attendance'}
          onClick={() => setCurrentTab('nfc_attendance')}
          collapsed={collapsed}
        />

        {/* Emergency Alert Navigation - Highlighted */}
        <NavItem
          id="emergency_center"
          label="Emergency Center"
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
          active={currentTab === 'emergency_center'}
          onClick={() => setCurrentTab('emergency_center')}
          badge={activeEmergency ? 'ACTIVE' : undefined}
          badgeColor="red"
          highlight={!!activeEmergency}
          collapsed={collapsed}
        />

        <NavItem
          id="ai_monitoring"
          label="AI Vision Telemetry"
          icon={<Cpu className="w-4 h-4" />}
          active={currentTab === 'ai_monitoring'}
          onClick={() => setCurrentTab('ai_monitoring')}
          collapsed={collapsed}
        />

        <NavItem
          id="parent_comm"
          label="Parent Alerts"
          icon={<MessageSquare className="w-4 h-4" />}
          active={currentTab === 'parent_comm'}
          onClick={() => setCurrentTab('parent_comm')}
          collapsed={collapsed}
        />

        <NavItem
          id="reports"
          label="Reports & Analytics"
          icon={<BarChart3 className="w-4 h-4" />}
          active={currentTab === 'reports'}
          onClick={() => setCurrentTab('reports')}
          collapsed={collapsed}
        />

        <NavItem
          id="settings"
          label="Settings"
          icon={<Settings className="w-4 h-4" />}
          active={currentTab === 'settings'}
          onClick={() => setCurrentTab('settings')}
          collapsed={collapsed}
        />
      </div>

      {/* Simulator Shortcut & User Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#05070A] space-y-2">
        <button
          onClick={onOpenSimulateModal}
          className="w-full bg-[#E51B24]/15 hover:bg-[#E51B24]/25 border border-[#E51B24]/50 text-red-300 hover:text-white px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          title="Simulate Accident Event"
        >
          <Zap className="w-3.5 h-3.5 text-[#E51B24] animate-pulse" />
          {!collapsed && <span>SIMULATE ACCIDENT</span>}
        </button>

        {!collapsed && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-white font-medium block truncate max-w-[140px]">
                {user?.fullName.split(' ')[0]} {user?.fullName.split(' ')[1]}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block truncate">
                {user?.username}
              </span>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: 'red' | 'amber' | 'emerald';
  highlight?: boolean;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  active,
  onClick,
  badge,
  badgeColor = 'red',
  highlight = false,
  collapsed = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-slate-800/90 text-white border-l-2 border-[#E51B24]'
          : highlight
          ? 'bg-red-950/40 text-red-300 border border-red-900/60 hover:bg-red-950/60'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
      title={label}
    >
      <div className="flex items-center gap-3 truncate">
        <span className={active ? 'text-[#E51B24]' : ''}>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>

      {!collapsed && badge && (
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
            badgeColor === 'red'
              ? 'bg-[#E51B24] text-white animate-pulse'
              : badgeColor === 'amber'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-600/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-600/40'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
