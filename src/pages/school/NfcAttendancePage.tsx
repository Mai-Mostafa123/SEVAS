import React from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { NfcReaderSimulation } from '../../components/nfc/NfcReaderSimulation';
import {
  CreditCard,
  CheckCircle2,
  Users,
  Bus,
  Clock,
  ArrowRight,
  Database,
  Radio,
} from 'lucide-react';

export const NfcAttendancePage: React.FC = () => {
  const { students, nfcScans } = useSevasData();

  const totalStudents = students.length;
  const onBoardCount = students.filter((s) => s.isOnBoard).length;
  const presentCount = students.filter((s) => s.attendanceStatus === 'PRESENT' || s.attendanceStatus === 'ON_BOARD').length;
  const absentCount = students.filter((s) => s.attendanceStatus === 'ABSENT').length;
  const lastScan = nfcScans[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
            NFC CONTACTLESS ATTENDANCE GATEWAY
          </h2>
          <p className="text-xs text-slate-400">
            Automated boarding verification, RFID card processing, and parent notification sync
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#05070A] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NFC BUS & GATE READERS ONLINE</span>
        </div>
      </div>

      {/* Top Statistics Strip (Requirement #18) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Students</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">{totalStudents}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Present</span>
          <span className="text-xl font-bold font-mono text-purple-400 tabular-nums">{presentCount}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">On Board Buses</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{onBoardCount}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Absent</span>
          <span className="text-xl font-bold font-mono text-slate-400 tabular-nums">{absentCount}</span>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Last NFC Scan</span>
          <span className="text-xs font-bold font-mono text-white truncate block mt-1">
            {lastScan ? `${lastScan.studentName.split(' ')[0]} (${lastScan.scanTime})` : 'Awaiting card'}
          </span>
        </div>
      </div>

      {/* Prominent Visual NFC Reader Terminal */}
      <NfcReaderSimulation />

      {/* Architectural Data Flow Diagram (Requirement #19) */}
      <div className="p-4 bg-[#070A0F] border border-slate-800/80 rounded-xl space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#E51B24] font-bold block">
          HARDWARE & BACKEND INTEGRATION PIPELINE
        </span>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
            <span>NFC Reader (Mifare 13.56MHz)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>ESP32 / IoT Controller</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-2">
            <span className="text-[#E51B24] font-bold">SEVAS API</span>
            <span className="text-slate-500 text-[10px]">(/api/nfc/tap)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL & Prisma</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />

          <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WebSocket Live Broadcast</span>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Live NFC Attendance Scan Stream
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {nfcScans.length} events processed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#05070A] border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">NFC Tag ID</th>
                <th className="py-3 px-4">Vehicle / Gate</th>
                <th className="py-3 px-4">Scan Time</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {nfcScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {scan.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {scan.studentId}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {scan.nfcId}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">
                    {scan.vehicleId}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {scan.scanTime}
                  </td>
                  <td className="py-3 px-4 text-purple-300">
                    {scan.eventType}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
