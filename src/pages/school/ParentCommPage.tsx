import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import {
  MessageSquare,
  CheckCheck,
  Check,
  Clock,
  AlertTriangle,
  Search,
  Send,
  Radio,
} from 'lucide-react';

export const ParentCommPage: React.FC = () => {
  const { parentNotifications } = useSevasData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNotifs = parentNotifications.filter((n) => {
    const matchesSearch =
      n.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              PARENT COMMUNICATION & WHATSAPP BROADCAST
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Automated boarding alerts, arrival notifications, and incident broadcast telemetry
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>WHATSAPP BUSINESS API (MOCK PIPELINE ACTIVE)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parent name, student, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#E51B24]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto font-mono text-xs overflow-x-auto">
          {[
            { id: 'ALL', label: 'ALL NOTIFICATIONS' },
            { id: 'EMERGENCY_ALERT', label: 'EMERGENCY ALERTS' },
            { id: 'STUDENT_BOARDED', label: 'BOARDING' },
            { id: 'STUDENT_ARRIVED', label: 'ARRIVAL' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Stream Table */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Parent Broadcast Dispatch Log
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {filteredNotifs.length} outbound dispatches
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono">
              No parent notifications matching the current criteria.
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const isEmergency = item.type === 'EMERGENCY_ALERT';

              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isEmergency ? 'bg-red-950/20' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{item.parentName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300 font-mono">Student: {item.studentName}</span>
                      <span className="text-slate-500">·</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isEmergency
                            ? 'bg-[#E51B24] text-white animate-pulse'
                            : item.type === 'STUDENT_BOARDED'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={`text-xs ${isEmergency ? 'text-red-200 font-medium' : 'text-slate-300'}`}>
                      "{item.message}"
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 font-mono text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>

                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{item.deliveryChannel}: {item.deliveryStatus}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
