import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Phone,
  Bell,
  Cpu,
  CreditCard,
  ShieldCheck,
  FileText,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { auditLogs } = useSevasData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'CONTACTS' | 'NOTIF' | 'NFC' | 'AI' | 'AUDIT'>('CONTACTS');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Emergency Contacts
  const [ambulancePhone, setAmbulancePhone] = useState('123');
  const [policePhone, setPolicePhone] = useState('122');
  const [firePhone, setFirePhone] = useState('180');
  const [hospitalLiaison, setHospitalLiaison] = useState('+20 2 2810 5000 (Air Force Specialized Hospital New Cairo)');

  // Notification Config
  const [whatsappApiKey, setWhatsappApiKey] = useState('WA-PROD-LIVE-TOKEN-9011-HIDDEN');
  const [whatsappSenderId, setWhatsappSenderId] = useState('+20 100 000 7382 (SEVAS Official)');
  const [smsFallback, setSmsFallback] = useState(true);

  // NFC Config
  const [baudRate, setBaudRate] = useState('115200');
  const [rfidFrequency, setRfidFrequency] = useState('13.56 MHz (ISO 14443A)');

  // AI Inference Settings
  const [gSensorThreshold, setGSensorThreshold] = useState('4.5G (High Impact Threshold)');
  const [visionConfidenceFilter, setVisionConfidenceFilter] = useState('85%');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              SYSTEM CONFIGURATION & HARDWARE SETTINGS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Paramedic contact matrices, WhatsApp API webhooks, edge AI thresholds, and compliance audit trail
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto text-xs font-mono">
        {[
          { id: 'CONTACTS', label: 'Emergency Contacts' },
          { id: 'NOTIF', label: 'WhatsApp / Notifications' },
          { id: 'NFC', label: 'NFC Reader Settings' },
          { id: 'AI', label: 'AI Edge Telemetry' },
          { id: 'AUDIT', label: `System Audit Log (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-[#E51B24] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form Container */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-6 shadow-xl">
        {activeTab === 'CONTACTS' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2">
              National Emergency Dispatch Lines
            </h3>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Egyptian Ambulance Authority (Primary Paramedics)
              </label>
              <input
                type="text"
                value={ambulancePhone}
                onChange={(e) => setAmbulancePhone(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Egyptian Traffic & Road Patrol Hotline
              </label>
              <input
                type="text"
                value={policePhone}
                onChange={(e) => setPolicePhone(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Civil Defense & Fire Response
              </label>
              <input
                type="text"
                value={firePhone}
                onChange={(e) => setFirePhone(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Primary Trauma Center Emergency Partner
              </label>
              <input
                type="text"
                value={hospitalLiaison}
                onChange={(e) => setHospitalLiaison(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Emergency Contacts</span>
            </button>
          </form>
        )}

        {activeTab === 'NOTIF' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2">
              Parent Broadcast & WhatsApp Cloud API Gateway
            </h3>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                WhatsApp Business Cloud API Webhook Token
              </label>
              <input
                type="password"
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                Managed securely via server-side proxy route.
              </span>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
                Approved Verified Sender ID / Phone Number
              </label>
              <input
                type="text"
                value={whatsappSenderId}
                onChange={(e) => setWhatsappSenderId(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#05070A] border border-slate-800">
              <div>
                <span className="text-white font-semibold block">Automatic SMS Fallback</span>
                <span className="text-[10px] text-slate-400">If WhatsApp delivery fails or parent is offline</span>
              </div>
              <input
                type="checkbox"
                checked={smsFallback}
                onChange={(e) => setSmsFallback(e.target.checked)}
                className="w-4 h-4 accent-[#E51B24]"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notification Credentials</span>
            </button>
          </form>
        )}

        {activeTab === 'NFC' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs font-mono">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2 font-sans">
              Contactless NFC Reader Hardware Gateway
            </h3>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">
                RFID Carrier Frequency
              </label>
              <input
                type="text"
                value={rfidFrequency}
                onChange={(e) => setRfidFrequency(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">
                Serial Bus Baud Rate (ESP32 Gateway)
              </label>
              <input
                type="text"
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Commit NFC Hardware Config</span>
            </button>
          </form>
        )}

        {activeTab === 'AI' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl text-xs font-mono">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2 font-sans">
              Edge Computer Vision & G-Sensor Triggers
            </h3>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">
                Critical Impact G-Force Threshold
              </label>
              <input
                type="text"
                value={gSensorThreshold}
                onChange={(e) => setGSensorThreshold(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">
                Minimum YOLOv11 Bounding Box Confidence Filter
              </label>
              <input
                type="text"
                value={visionConfidenceFilter}
                onChange={(e) => setVisionConfidenceFilter(e.target.value)}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-2 rounded-lg bg-[#E51B24] hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save AI Calibration</span>
            </button>
          </form>
        )}

        {activeTab === 'AUDIT' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Immutable Regulatory Audit Trail
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Logged in accordance with student safety compliance
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#E51B24] font-bold">{log.action}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-white font-medium">{log.actor}</span>
                      <span className="text-slate-500 text-[10px]">({log.actorRole})</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
