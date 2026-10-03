import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, X, Save } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, vehicles } = useSevasData();
  const { validateFourPartName } = useAuth();

  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [classGrade, setClassGrade] = useState('Grade 4 — Section A');
  const [nfcId, setNfcId] = useState(`NFC-${Math.floor(10000 + Math.random() * 89999)}-EGY`);
  const [bloodType, setBloodType] = useState('O+');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [allergies, setAllergies] = useState('');

  // Parent Info
  const [parent1Name, setParent1Name] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [assignedVehicleId, setAssignedVehicleId] = useState(vehicles[0]?.id || 'BUS-001');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 4-part name validation
    const nameCheck = validateFourPartName(fullName);
    if (!nameCheck.valid) {
      setError(nameCheck.error || 'Please enter exactly four name parts.');
      return;
    }

    if (!parent1Name.trim() || !parentPhone.trim()) {
      setError('Please provide primary parent details.');
      return;
    }

    const studentId = `EGY-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addStudent({
      fullName: fullName.trim(),
      studentId,
      nationalId: nationalId || `3160${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      classGrade,
      nfcId,
      bloodType,
      medicalInfo: medicalInfo || 'None recorded',
      allergies: allergies || 'None',
      parent1Name: parent1Name.trim(),
      parentPhone,
      parentWhatsapp: parentWhatsapp || parentPhone,
      emergencyContact: emergencyContact || parentPhone,
      assignedVehicleId,
      isRegistered: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enroll New Student</h3>
              <p className="text-xs text-slate-400 font-mono">SEVAS Transit & NFC Identity Registry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Student Info */}
          <div>
            <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-800">
              01. Student Personal Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">
                  Full Name * (Must be exactly 4 parts, e.g., "Tamer Mohamed Ali Hassan")
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamer Mohamed Ali Hassan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Class / Grade *</label>
                <input
                  type="text"
                  required
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned School Bus</label>
                <select
                  value={assignedVehicleId}
                  onChange={(e) => setAssignedVehicleId(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} — {v.plateNumber} ({v.assignedRoute})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">NFC Card ID (Pre-Programmed)</label>
                <input
                  type="text"
                  value={nfcId}
                  onChange={(e) => setNfcId(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Medical Conditions & Inhaler/Medication</label>
                <input
                  type="text"
                  placeholder="e.g. Mild asthma, carries inhaler"
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Allergies (Severe Food / Medication)</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Penicillin"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider mb-3 pb-1 border-b border-slate-800">
              02. Parent & Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Parent / Guardian Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Mohamed Ali Hassan"
                  value={parent1Name}
                  onChange={(e) => setParent1Name(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Parent Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+20 100 123 4567"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Number (For Auto Alerts)</label>
                <input
                  type="text"
                  placeholder="+20 100 123 4567"
                  value={parentWhatsapp}
                  onChange={(e) => setParentWhatsapp(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Emergency Secondary Contact</label>
                <input
                  type="text"
                  placeholder="+20 111 999 8888 (Uncle / Grandparent)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,27,36,0.5)] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
