import React from 'react';
import { useSevasData } from '../../context/SevasDataContext';
import {
  Cpu,
  Eye,
  Flame,
  Users,
  AlertTriangle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Video,
  Camera,
} from 'lucide-react';

export const AiMonitoringPage: React.FC = () => {
  const { aiTelemetry, vehicles } = useSevasData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide uppercase">
              AI & COMPUTER VISION MONITORING
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Edge inference pipeline: real-time passenger counting, structural accident classification, and fire risk
          </p>
        </div>

        {/* DEMO VALUES REQUIRED NOTICE (#23) */}
        <div className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/80 text-amber-300 font-mono font-bold text-xs flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>DEMO DATA — PROTOTYPE MODEL ESTIMATES</span>
        </div>
      </div>

      {/* AI Telemetry Confidence Indicators Grid (Requirement #23) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Accident Detection */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Accident Detection</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {Math.round(aiTelemetry.accidentDetectionConfidence * 100)}%
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              HIGH PRECISION
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#E51B24] h-full" style={{ width: `${aiTelemetry.accidentDetectionConfidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DEMO VALUE · YOLOv11</span>
        </div>

        {/* Metric 2: Passenger Detection */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Passenger Detection</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {Math.round(aiTelemetry.passengerDetectionConfidence * 100)}%
            </span>
            <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
              ACCURATE
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${aiTelemetry.passengerDetectionConfidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DEMO VALUE · Cabin Count</span>
        </div>

        {/* Metric 3: Injury Estimation */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Injury Estimation</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {Math.round(aiTelemetry.injuryEstimationConfidence * 100)}%
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
              POSE TRIAGE
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${aiTelemetry.injuryEstimationConfidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DEMO VALUE · G-Force Matrix</span>
        </div>

        {/* Metric 4: Fire / Smoke Detection */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Fire / Smoke Risk</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {Math.round(aiTelemetry.fireSmokeDetectionConfidence * 100)}%
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              NOMINAL
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${aiTelemetry.fireSmokeDetectionConfidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DEMO VALUE · Thermal IR</span>
        </div>

        {/* Metric 5: Vehicle Condition */}
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Vehicle Condition</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {Math.round(aiTelemetry.vehicleConditionConfidence * 100)}%
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              OPTIMAL
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${aiTelemetry.vehicleConditionConfidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DEMO VALUE · Structural Integ</span>
        </div>
      </div>

      {/* Simulated Live Camera Stream Feeds */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#E51B24]" />
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
              Edge Computer Vision Multi-Stream Grid
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {aiTelemetry.inferenceFps} FPS · {aiTelemetry.systemLatencyMs}ms Inference Latency
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stream 1: BUS-007 Forward Camera */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-white">BUS-007 — Forward Roadway Horizon</span>
              </div>
              <span className="text-slate-400 text-[10px]">CAM-FRONT-01</span>
            </div>

            <div className="relative h-64 bg-[#05070A] flex items-center justify-center border-b border-slate-800 overflow-hidden">
              {/* Overlay Synthetic Computer Vision HUD */}
              <div className="absolute inset-0 p-4 font-mono text-[10px] text-emerald-400 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between">
                  <span>RES: 1920x1080 @ 30FPS</span>
                  <span>OPTICAL FLOW: STEADY</span>
                </div>
                {/* Object Detection Bounding Boxes */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="border border-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded text-white text-[10px] shadow-sm">
                    TRAFFIC_LANE [0.98] · CLEAR
                  </div>
                  <div className="absolute bottom-4 right-10 border border-blue-400/80 bg-blue-400/10 px-2 py-0.5 rounded text-white text-[10px]">
                    PEDESTRIAN_ZONE [0.94]
                  </div>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>LAT: 30.0074° N · LNG: 31.4289° E</span>
                  <span className="text-red-400 font-bold">RADAR SYNC: ACTIVE</span>
                </div>
              </div>

              {/* Grid texture */}
              <div className="w-full h-full opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Model: YOLOv11n Road Surface</span>
              <span className="text-emerald-400">Zero Hazards Detected</span>
            </div>
          </div>

          {/* Stream 2: BUS-007 Cabin Interior Camera */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-white">BUS-007 — Passenger Cabin & Aisle</span>
              </div>
              <span className="text-slate-400 text-[10px]">CAM-CABIN-02</span>
            </div>

            <div className="relative h-64 bg-[#05070A] flex items-center justify-center border-b border-slate-800 overflow-hidden">
              {/* Overlay Synthetic Computer Vision HUD */}
              <div className="absolute inset-0 p-4 font-mono text-[10px] text-purple-400 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between">
                  <span>OCCUPANCY: 18 SEATS ENGAGED</span>
                  <span>BELT_SYNC: 100%</span>
                </div>
                {/* Bounding box for student count */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="border border-purple-400/80 bg-purple-400/10 px-3 py-1 rounded text-white text-xs font-bold">
                    PASSENGERS DETECTED: 18 (CONFIDENCE: 94%)
                  </div>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>DRIVER POSE: ALERT (ATTENTION: 99%)</span>
                  <span className="text-emerald-400 font-bold">CABIN AIR: NOMINAL</span>
                </div>
              </div>

              {/* Grid texture */}
              <div className="w-full h-full opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="p-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Model: YOLOv11-Pose Passenger Classifier</span>
              <span className="text-emerald-400">Student Postures Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Architectural Pipeline Flow (Requirement #23) */}
      <div className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-[#E51B24] font-bold">
            SEVAS PYTHON / FASTAPI VISION PIPELINE SPECIFICATION
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Service: ai-service/main.py</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg space-y-1">
            <span className="text-slate-500 text-[10px] block">01. INGESTION</span>
            <span className="text-white font-bold block">Vehicle RTSP Camera</span>
            <p className="text-slate-400 text-[10px] font-sans">
              Dual 1080p H.264 streams from onboard IP camera via 4G/5G industrial gateway.
            </p>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg space-y-1">
            <span className="text-purple-400 text-[10px] block">02. FASTAPI INFERENCE</span>
            <span className="text-white font-bold block">PyTorch & TensorRT</span>
            <p className="text-slate-400 text-[10px] font-sans">
              FastAPI Python microservice executes YOLOv11 multi-class bounding box classification.
            </p>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg space-y-1">
            <span className="text-blue-400 text-[10px] block">03. BACKEND BROKER</span>
            <span className="text-white font-bold block">NestJS REST / Socket.IO</span>
            <p className="text-slate-400 text-[10px] font-sans">
              Aggregates AI telemetry with CAN-Bus accelerometer readings and GPS geofence data.
            </p>
          </div>

          <div className="p-3 bg-[#05070A] border border-slate-800 rounded-lg space-y-1">
            <span className="text-red-400 text-[10px] block">04. DISPATCH</span>
            <span className="text-white font-bold block">Incident Command Alert</span>
            <p className="text-slate-400 text-[10px] font-sans">
              Triggers visual radar warning on School Admin dashboard and WhatsApp dispatch pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
