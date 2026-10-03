import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSevasData } from '../../context/SevasDataContext';
import { SevasLogo } from '../../components/common/SevasLogo';
import {
  School,
  ShieldCheck,
  Users,
  CheckCircle2,
  Lock,
  User,
  ArrowRight,
  ChevronLeft,
  Building,
  Phone,
  FileCheck,
} from 'lucide-react';

interface LoginPortalProps {
  onSuccessLogin?: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onSuccessLogin }) => {
  const { login, validateFourPartName } = useAuth();
  const { submitSchoolRequest } = useSevasData();

  // Mode: 'PORTAL' | 'SCHOOL_SELECT' | 'SCHOOL_LOGIN' | 'SCHOOL_REGISTER' | 'SEVAS_TEAM' | 'PARENT'
  const [mode, setMode] = useState<'PORTAL' | 'SCHOOL_LOGIN' | 'SCHOOL_REGISTER' | 'SEVAS_TEAM' | 'PARENT'>('PORTAL');

  // School Login States
  const [username, setUsername] = useState('school.admin');
  const [password, setPassword] = useState('school@admin2026');

  // SEVAS Team States
  const [teamUsername, setTeamUsername] = useState('retaj.leader');
  const [teamPassword, setTeamPassword] = useState('sevas@leader2026');

  // Parent States
  const [parentPhone, setParentPhone] = useState('+20 100 555 4321');

  // School Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Handle School Login
  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, 'SCHOOL_ADMIN', 'Al-Farabi Modern International School');
    if (onSuccessLogin) onSuccessLogin();
  };

  // Handle SEVAS Team Login
  const handleTeamLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(teamUsername, 'SEVAS_TEAM_LEADER');
    if (onSuccessLogin) onSuccessLogin();
  };

  // Handle Parent Login
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(parentPhone, 'PARENT');
    if (onSuccessLogin) onSuccessLogin();
  };

  // Handle School Admin Registration Request (#7 Requirement)
  const handleSchoolRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // CRITICAL: Must validate exactly 4 name parts
    const nameCheck = validateFourPartName(regFullName);
    if (!nameCheck.valid) {
      setRegError(nameCheck.error || 'Full Name must contain exactly four name parts.');
      return;
    }

    if (!regNationalId || !regPhone || !regSchoolName || !regTitle) {
      setRegError('Please complete all required administrative registration fields.');
      return;
    }

    submitSchoolRequest({
      fullName: regFullName.trim(),
      nationalId: regNationalId.trim(),
      phoneNumber: regPhone.trim(),
      whatsappNumber: regWhatsapp.trim() || regPhone.trim(),
      professionalTitle: regTitle.trim(),
      schoolName: regSchoolName.trim(),
    });

    setRegSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background glow and subtle cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E51B24]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar with Demo Credentials Notice */}
      <div className="p-4 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono text-slate-400">SEVAS TELEMETRY NETWORK ACTIVE</span>
        </div>

        {/* Demo Credentials Quick Info */}
        <div className="text-[11px] font-mono bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hidden sm:flex items-center gap-3">
          <span>Demo: <strong className="text-white">school.admin</strong> / <strong className="text-slate-400">school@admin2026</strong></span>
          <span className="text-slate-600">|</span>
          <span>Leader: <strong className="text-[#E51B24]">retaj.leader</strong> / <strong className="text-slate-400">sevas@leader2026</strong></span>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 max-w-xl mx-auto w-full">
        {/* Official Brand Logo Lockup */}
        <div className="mb-8 flex flex-col items-center">
          <SevasLogo size="xl" variant="full" showSlogan={true} />
        </div>

        {/* 1. Main Portal Screen */}
        {mode === 'PORTAL' && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <button
              onClick={() => setMode('SCHOOL_LOGIN')}
              className="w-full p-4 rounded-xl bg-[#0B0F17] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 rounded-lg bg-blue-950/70 border border-blue-900/60 text-blue-400 group-hover:scale-105 transition-transform">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    SCHOOL LOGIN
                  </h3>
                  <p className="text-xs text-slate-400">
                    Administrative command center, fleet tracking, and student safety
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setMode('SEVAS_TEAM')}
              className="w-full p-4 rounded-xl bg-[#0B0F17] hover:bg-slate-900 border border-slate-800 hover:border-red-900/40 transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-900/60 text-[#E51B24] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    SEVAS TEAM LOGIN
                  </h3>
                  <p className="text-xs text-slate-400">
                    System operations, school registration review, and emergency grid
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#E51B24] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setMode('PARENT')}
              className="w-full p-4 rounded-xl bg-[#0B0F17] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-900/60 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    PARENT LOGIN
                  </h3>
                  <p className="text-xs text-slate-400">
                    Student attendance verification and transit tracking liaison
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}

        {/* 2. School Login Form */}
        {mode === 'SCHOOL_LOGIN' && (
          <div className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setMode('PORTAL')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return</span>
              </button>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                School Command Access
              </span>
            </div>

            <form onSubmit={handleSchoolLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                  Username or Administrator Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#05070A] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#05070A] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Enter Command Center
              </button>
            </form>

            {/* Link to Registration Request */}
            <div className="pt-3 border-t border-slate-800 text-center">
              <p className="text-slate-400 text-xs mb-2">New school transit administrator?</p>
              <button
                type="button"
                onClick={() => setMode('SCHOOL_REGISTER')}
                className="text-xs text-[#E51B24] hover:underline font-semibold font-mono"
              >
                + Create Administrative Account (Request Access)
              </button>
            </div>
          </div>
        )}

        {/* 3. Create Administrative Account (Registration Request #7) */}
        {mode === 'SCHOOL_REGISTER' && (
          <div className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-300 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setMode('SCHOOL_LOGIN')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
              <span className="text-xs font-mono font-bold text-[#E51B24] uppercase">
                School Registration Request
              </span>
            </div>

            {regSuccess ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Application Filed Successfully</h4>
                <p className="text-xs text-slate-300">
                  Your administrative request has been routed to the <strong>SEVAS Operations Team</strong> for accreditation verification.
                </p>
                <div className="p-3 bg-[#05070A] rounded-lg text-slate-400 text-[11px] font-mono text-left space-y-1">
                  <p>Workflow Sequence:</p>
                  <p className="text-white">1. Request submitted by School Admin</p>
                  <p className="text-amber-400">2. SEVAS Team reviews accreditation</p>
                  <p className="text-emerald-400">3. Credentials generated & sent via WhatsApp mock dispatch</p>
                </div>
                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setMode('SCHOOL_LOGIN');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  Return to School Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSchoolRegister} className="space-y-3 text-xs">
                {regError && (
                  <div className="p-2.5 bg-red-950/50 border border-red-800 rounded-lg text-red-300 text-[11px]">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                    Full Name * (MUST contain exactly 4 name parts)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmed Mohamed Ali Hassan"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Example: "Ahmed Mohamed Ali Hassan" (Valid) · "Ahmed Hassan" (Invalid)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                      National ID * (14 digits)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="28001010101234"
                      value={regNationalId}
                      onChange={(e) => setRegNationalId(e.target.value)}
                      className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Head of Student Transportation"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cairo Modern International Academy"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E51B24]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+20 100 123 4567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                      WhatsApp Dispatch Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+20 100 123 4567"
                      value={regWhatsapp}
                      onChange={(e) => setRegWhatsapp(e.target.value)}
                      className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  SEVAS WhatsApp Notification Service: Account credentials will be dispatched to your registered WhatsApp upon approval.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Submit Registration Request
                </button>
              </form>
            )}
          </div>
        )}

        {/* 4. SEVAS Team Login Form */}
        {mode === 'SEVAS_TEAM' && (
          <div className="w-full bg-[#0B0F17] border border-red-900/60 rounded-xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setMode('PORTAL')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return</span>
              </button>
              <span className="text-xs font-mono font-bold text-[#E51B24] uppercase">
                SEVAS Command Personnel
              </span>
            </div>

            <form onSubmit={handleTeamLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                  Team Leader / Member Handle
                </label>
                <input
                  type="text"
                  required
                  value={teamUsername}
                  onChange={(e) => setTeamUsername(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                  Command Authorization Key
                </label>
                <input
                  type="password"
                  required
                  value={teamPassword}
                  onChange={(e) => setTeamPassword(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-[#E51B24]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold text-xs shadow-[0_0_15px_rgba(229,27,36,0.4)] transition-colors"
              >
                Authenticate SEVAS Session
              </button>
            </form>
          </div>
        )}

        {/* 5. Parent Login Form */}
        {mode === 'PARENT' && (
          <div className="w-full bg-[#0B0F17] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setMode('PORTAL')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return</span>
              </button>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Parent Portal
              </span>
            </div>

            <form onSubmit={handleParentLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                  Registered Guardian Mobile / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Enter Parent Dashboard
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 font-mono z-10 border-t border-slate-900">
        SEVAS © 2026 Smart Emergency Vehicle Alert System · All Rights Reserved
      </footer>
    </div>
  );
};
