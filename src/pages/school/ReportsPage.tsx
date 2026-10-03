import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Download,
  Bus,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

const ATTENDANCE_TREND_DATA = [
  { day: 'Sun', present: 312, absent: 28, rate: 91 },
  { day: 'Mon', present: 325, absent: 15, rate: 95 },
  { day: 'Tue', present: 318, absent: 22, rate: 93 },
  { day: 'Wed', present: 330, absent: 10, rate: 97 },
  { day: 'Thu', present: 328, absent: 12, rate: 96 },
];

const VEHICLE_SPEED_HOURLY = [
  { hour: '06:30', avgSpeed: 32, maxSpeed: 48 },
  { hour: '07:00', avgSpeed: 41, maxSpeed: 58 },
  { hour: '07:30', avgSpeed: 38, maxSpeed: 52 },
  { hour: '08:00', avgSpeed: 29, maxSpeed: 45 },
  { hour: '08:30', avgSpeed: 18, maxSpeed: 30 },
];

const NFC_SCANS_BY_BUS = [
  { bus: 'BUS-001', scans: 48, capacity: 32 },
  { bus: 'BUS-002', scans: 38, capacity: 28 },
  { bus: 'BUS-003', scans: 56, capacity: 30 },
  { bus: 'BUS-007', scans: 36, capacity: 30 },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              OPERATIONAL ANALYTICS & AUDIT INTELLIGENCE
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Safety metrics, attendance trends, vehicle speeds, and emergency response performance
          </p>
        </div>

        <button
          onClick={() => {}}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Weekly Attendance</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">94.4%</span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +2.1% from previous week
          </span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Fleet Route Punctuality</span>
          <span className="text-2xl font-bold font-mono text-purple-400 tabular-nums">98.2%</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">Cairo Ring Road Corridor</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Avg Incident Triage</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">1.4 min</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">Detection to Paramedic</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total NFC Card Taps</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">1,842</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">99.98% hardware accuracy</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Attendance Trends Area Chart */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Daily Attendance Trend (%)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">5-day school week NFC verification</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[80, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#attendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Transit Velocity */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Transit Fleet Speed Velocity (km/h)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Morning transit corridor telemetry</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VEHICLE_SPEED_HOURLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="avgSpeed" stroke="#E51B24" strokeWidth={2.5} dot={{ fill: '#E51B24', r: 4 }} name="Avg Speed" />
                <Line type="monotone" dataKey="maxSpeed" stroke="#38BDF8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Max Speed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: NFC Scan Volumes per Bus */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                NFC Scan Volume by Transit Unit
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Boarding and deboarding card tap counts per vehicle</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NFC_SCANS_BY_BUS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="bus" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070A0F', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="scans" fill="#E51B24" radius={[4, 4, 0, 0]} name="Total Scans" />
                <Bar dataKey="capacity" fill="#334155" radius={[4, 4, 0, 0]} name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
