import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { AddStudentModal } from '../../components/students/AddStudentModal';
import { StudentProfileModal } from '../../components/students/StudentProfileModal';
import { Student } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Bus,
  MapPin,
  AlertCircle,
  CreditCard,
  Heart,
} from 'lucide-react';

interface StudentsPageProps {
  onFocusBusOnMap?: (busId: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onFocusBusOnMap }) => {
  const { students, toggleStudentBoarding } = useSevasData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'ON_BOARD' | 'PRESENT' | 'ABSENT' | 'UNREGISTERED'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Statistics
  const totalCount = students.length;
  const onBoardCount = students.filter((s) => s.isOnBoard).length;
  const presentCount = students.filter((s) => s.attendanceStatus === 'PRESENT' || s.attendanceStatus === 'ON_BOARD').length;
  const absentCount = students.filter((s) => s.attendanceStatus === 'ABSENT').length;
  const unregisteredCount = students.filter((s) => !s.isRegistered).length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nfcId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parent1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedVehicleId.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'ON_BOARD') return matchesSearch && s.isOnBoard;
    if (filterMode === 'PRESENT') return matchesSearch && (s.attendanceStatus === 'PRESENT' || s.attendanceStatus === 'ON_BOARD');
    if (filterMode === 'ABSENT') return matchesSearch && s.attendanceStatus === 'ABSENT';
    if (filterMode === 'UNREGISTERED') return matchesSearch && !s.isRegistered;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
            STUDENT MANAGEMENT & TRANSIT SAFETY
          </h2>
          <p className="text-xs text-slate-400">
            NFC card identification, sensitive medical records, and live onboard statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.4)] transition-all whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ ADD STUDENT</span>
        </button>
      </div>

      {/* Statistics Strip (Requirement #14) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Students</span>
          <span className="text-xl font-bold font-mono text-white tabular-nums">{totalCount}</span>
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
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Not Registered</span>
          <span className={`text-xl font-bold font-mono tabular-nums ${unregisteredCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {unregisteredCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, ID, NFC tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F17] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#E51B24]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto font-mono text-xs overflow-x-auto">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: 'ON_BOARD', label: `ON BOARD (${onBoardCount})` },
            { id: 'PRESENT', label: 'PRESENT' },
            { id: 'ABSENT', label: 'ABSENT' },
            { id: 'UNREGISTERED', label: `NOT REGISTERED (${unregisteredCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                filterMode === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A0F] border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Student Full Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">NFC Tag</th>
                <th className="py-3 px-4">Assigned Bus</th>
                <th className="py-3 px-4">Blood & Medical</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Profile View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{student.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Guardian: {student.parent1Name} ({student.parentPhone})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {student.studentId}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {student.classGrade}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-emerald-400 font-semibold">{student.nfcId}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-white font-bold">
                    {student.assignedVehicleId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-red-400 font-bold block">{student.bloodType}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px] block" title={student.medicalInfo}>
                      {student.medicalInfo}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        student.isOnBoard
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : student.attendanceStatus === 'PRESENT'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : !student.isRegistered
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {student.isOnBoard ? 'ON BOARD' : !student.isRegistered ? 'NOT REGISTERED' : student.attendanceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onFocusBusOnMap={onFocusBusOnMap}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};
