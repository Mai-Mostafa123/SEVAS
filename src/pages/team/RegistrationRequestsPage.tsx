import React, { useState } from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import { useAuth } from '../../context/AuthContext';
import { SchoolRegistrationRequest } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Building,
  Phone,
  User,
  Clock,
  Shield,
  Send,
  Eye,
  X,
} from 'lucide-react';

export const RegistrationRequestsPage: React.FC = () => {
  const { schoolRequests, approveSchoolRequest, rejectSchoolRequest } = useSevasData();
  const { user } = useAuth();

  const [selectedReq, setSelectedReq] = useState<SchoolRegistrationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('School authorization accreditation documentation incomplete.');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalResult, setApprovalResult] = useState<{ id: string; username: string; tempPass: string } | null>(null);

  const pendingRequests = schoolRequests.filter((r) => r.status === 'PENDING');
  const pastRequests = schoolRequests.filter((r) => r.status !== 'PENDING');

  const handleApprove = (reqId: string) => {
    const creds = approveSchoolRequest(reqId, user?.fullName || 'Retaj Leader');
    setApprovalResult({ id: reqId, username: creds.username, tempPass: creds.tempPass });
  };

  const handleExecuteReject = () => {
    if (!selectedReq) return;
    rejectSchoolRequest(selectedReq.id, user?.fullName || 'Retaj Leader', rejectReason);
    setShowRejectModal(false);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck2 className="w-5 h-5 text-[#E51B24]" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              SCHOOL ADMINISTRATIVE ONBOARDING REQUESTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            SEVAS Operations review: credential generation and WhatsApp credential delivery
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/80 text-amber-300 font-mono text-xs flex items-center gap-2">
          <span>{pendingRequests.length} PENDING ACCREDITATION CHECKS</span>
        </div>
      </div>

      {/* Approval Feedback Banner */}
      {approvalResult && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-600 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>ADMINISTRATIVE ACCOUNT ACTIVATED & CREDENTIALS DISPATCHED</span>
            </div>
            <button
              onClick={() => setApprovalResult(null)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-300">
            SEVAS Credentials generated: Username: <strong className="text-white font-mono">{approvalResult.username}</strong> · Temporary Password: <strong className="text-emerald-300 font-mono">{approvalResult.tempPass}</strong>. Dispatched to administrator's WhatsApp phone via mock webhook.
          </p>
        </div>
      )}

      {/* Pending Requests Section (Requirement #28) */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
          Pending School Administrator Applications
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono bg-[#0B0F17] border border-slate-800 rounded-xl">
            No pending registration requests awaiting review.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <h4 className="font-bold text-white text-sm">{req.fullName}</h4>
                    <p className="text-xs text-[#E51B24] font-semibold">{req.professionalTitle}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{req.schoolName}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                    PENDING
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 text-[10px] block">National ID:</span>
                    <span className="text-slate-200">{req.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Submitted Date:</span>
                    <span className="text-slate-200">{req.requestDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Phone:</span>
                    <span className="text-slate-200">{req.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">WhatsApp:</span>
                    <span className="text-emerald-400">{req.whatsappNumber}</span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-[11px] text-slate-400 bg-[#05070A] p-2.5 rounded-lg border border-slate-800/80">
                    {req.notes}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setSelectedReq(req);
                      setShowRejectModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Issue Credentials</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical / Processed Requests */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Processed Administrative Requests
          </h3>
          <span className="text-xs font-mono text-slate-400">{pastRequests.length} records</span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {pastRequests.map((req) => (
            <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{req.fullName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">{req.schoolName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">{req.reviewedAt}</span>
                </div>
                {req.generatedUsername && (
                  <p className="text-[11px] font-mono text-slate-400">
                    Active Account: <span className="text-emerald-400">{req.generatedUsername}</span> · Reviewed by {req.reviewedBy}
                  </p>
                )}
                {req.notes && (
                  <p className="text-[11px] text-red-300 font-mono">{req.notes}</p>
                )}
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase self-start sm:self-auto ${
                  req.status === 'APPROVED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-red-950 text-red-300 border border-red-800'
                }`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedReq && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F17] border border-red-900/60 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Decline Registration Application</h3>
            <p className="text-xs text-slate-300">
              Provide reason for rejecting application from <strong className="text-white">{selectedReq.fullName}</strong> for {selectedReq.schoolName}.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full bg-[#05070A] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReject}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-xs font-bold text-white shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
