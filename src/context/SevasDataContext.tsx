import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Vehicle,
  Student,
  NfcScanRecord,
  EmergencyAlert,
  SchoolRegistrationRequest,
  SchoolEntity,
  ParentNotification,
  AuditLogEntry,
  AiDetectionTelemetry,
  EmergencySeverity,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_STUDENTS,
  INITIAL_NFC_SCANS,
  INITIAL_SCHOOL_REQUESTS,
  INITIAL_SCHOOLS,
  INITIAL_PARENT_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  AI_TELEMETRY_DEFAULT,
} from '../services/mockData';

interface SevasDataContextType {
  // Vehicles
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  selectedVehicle: Vehicle | null;
  setSelectedVehicleId: (id: string | null) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'status' | 'currentSpeed' | 'gpsStatus' | 'sensorsStatus' | 'studentsOnBoard' | 'lastUpdate' | 'currentLocation' | 'routeWaypoints' | 'routeIndex'>) => void;
  updateVehicleStatus: (id: string, status: Vehicle['status']) => void;

  // Students
  students: Student[];
  selectedStudentId: string | null;
  selectedStudent: Student | null;
  setSelectedStudentId: (id: string | null) => void;
  addStudent: (student: Omit<Student, 'id' | 'isOnBoard' | 'attendanceStatus' | 'lastScanTime'>) => void;
  toggleStudentBoarding: (studentId: string) => void;

  // NFC Attendance
  nfcScans: NfcScanRecord[];
  simulateNfcScan: (studentId: string, eventType?: 'BOARD' | 'DEBOARD' | 'SCHOOL_ARRIVAL') => { success: boolean; message: string; record?: NfcScanRecord };

  // Emergency Management
  activeEmergency: EmergencyAlert | null;
  emergencyHistory: EmergencyAlert[];
  simulateAccident: (vehicleId: string, severity?: EmergencySeverity, fireDetected?: boolean) => void;
  triggerDriverSos: (vehicleId: string, emergencyType?: string) => EmergencyAlert;
  resolveEmergency: (emergencyId: string, resolutionNotes?: string) => void;
  handleParentNotificationDecision: (emergencyId: string, approved: boolean, schoolAdminName: string) => void;

  // School Registration Requests (SEVAS Team)
  schoolRequests: SchoolRegistrationRequest[];
  submitSchoolRequest: (data: Omit<SchoolRegistrationRequest, 'id' | 'requestDate' | 'status'>) => void;
  approveSchoolRequest: (requestId: string, reviewerName: string) => { username: string; tempPass: string };
  rejectSchoolRequest: (requestId: string, reviewerName: string, reason: string) => void;

  // Schools Directory
  schools: SchoolEntity[];

  // Parent Notifications
  parentNotifications: ParentNotification[];

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, actor: string, actorRole: any, target: string, details: string) => void;

  // AI Telemetry
  aiTelemetry: AiDetectionTelemetry;

  // System & GPS simulation
  isSimulationActive: boolean;
  toggleSimulation: () => void;
  focusedMapCoords: { lat: number; lng: number } | null;
  setFocusedMapCoords: (coords: { lat: number; lng: number } | null) => void;
}

const SevasDataContext = createContext<SevasDataContextType | undefined>(undefined);

export const SevasDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [nfcScans, setNfcScans] = useState<NfcScanRecord[]>(INITIAL_NFC_SCANS);

  // Active Emergency State - Initial state has one severe accident detected on BUS-007 for testing
  const [activeEmergency, setActiveEmergency] = useState<EmergencyAlert | null>({
    id: 'EMG-2026-904',
    vehicleId: 'BUS-007',
    vehiclePlate: 'ق أ س 1824',
    severity: 'SEVERE',
    time: '10:42 AM',
    timestamp: Date.now() - 1000 * 60 * 12,
    locationName: 'Cairo Ring Road (Near New Cairo Choueifat Exit)',
    coordinates: { lat: 30.0074, lng: 31.4289 },
    studentsOnBoard: 18,
    estimatedInjured: 4,
    fireDetected: false,
    driverName: 'Ahmed Mohamed Ibrahim Hassan',
    driverPhone: '+20 100 234 5678',
    driverBloodType: 'O+',
    description: 'High deceleration impact detected by vehicle accelerometer (>4.8G). AI Computer Vision model detected lateral roll risk. Immediate paramedic dispatched.',
    status: 'ACTIVE',
    parentNotificationStatus: 'PENDING',
    aiConfidence: {
      accidentConfidence: 0.97,
      injuryConfidence: 0.91,
      fireConfidence: 0.02,
    },
  });

  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyAlert[]>([]);
  const [schoolRequests, setSchoolRequests] = useState<SchoolRegistrationRequest[]>(INITIAL_SCHOOL_REQUESTS);
  const [schools] = useState<SchoolEntity[]>(INITIAL_SCHOOLS);
  const [parentNotifications, setParentNotifications] = useState<ParentNotification[]>(INITIAL_PARENT_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [aiTelemetry] = useState<AiDetectionTelemetry>(AI_TELEMETRY_DEFAULT);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [focusedMapCoords, setFocusedMapCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Add audit log helper
  const addAuditLog = useCallback((action: string, actor: string, actorRole: any, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action,
      actor,
      actorRole,
      target,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  }, []);

  // Real-time simulated GPS vehicle movement along waypoints
  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((bus) => {
          // If bus is in emergency, it holds position
          if (activeEmergency && activeEmergency.vehicleId === bus.id && activeEmergency.status === 'ACTIVE') {
            return {
              ...bus,
              currentSpeed: 0,
              status: 'EMERGENCY',
              lastUpdate: 'Live telemetry active',
            };
          }

          if (bus.status === 'OFFLINE' || bus.routeWaypoints.length < 2) {
            return bus;
          }

          const nextIndex = (bus.routeIndex + 1) % bus.routeWaypoints.length;
          const targetCoords = bus.routeWaypoints[nextIndex];
          const varianceLat = (Math.random() - 0.5) * 0.0006;
          const varianceLng = (Math.random() - 0.5) * 0.0006;
          const randomSpeed = Math.floor(35 + Math.random() * 15);

          return {
            ...bus,
            routeIndex: nextIndex,
            currentLocation: {
              lat: Number((targetCoords.lat + varianceLat).toFixed(5)),
              lng: Number((targetCoords.lng + varianceLng).toFixed(5)),
            },
            currentSpeed: randomSpeed,
            lastUpdate: 'Just now',
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulationActive, activeEmergency]);

  // Selected vehicle object
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

  // Selected student object
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || null;

  // Add new vehicle
  const addVehicle = (vehicleData: Omit<Vehicle, 'status' | 'currentSpeed' | 'gpsStatus' | 'sensorsStatus' | 'studentsOnBoard' | 'lastUpdate' | 'currentLocation' | 'routeWaypoints' | 'routeIndex'>) => {
    const newBus: Vehicle = {
      ...vehicleData,
      status: 'ONLINE',
      currentSpeed: 35,
      gpsStatus: 'ACTIVE',
      sensorsStatus: 'NORMAL',
      studentsOnBoard: 0,
      lastUpdate: 'Just registered',
      currentLocation: { lat: 30.0254, lng: 31.4913 },
      routeWaypoints: [
        { lat: 30.0254, lng: 31.4913 },
        { lat: 30.0350, lng: 31.4820 },
        { lat: 30.0450, lng: 31.4700 },
      ],
      routeIndex: 0,
    };

    setVehicles((prev) => [newBus, ...prev]);
    addAuditLog(
      'VEHICLE_REGISTERED',
      'School Admin',
      'SCHOOL_ADMIN',
      newBus.id,
      `Vehicle ${newBus.id} (${newBus.plateNumber}) successfully enrolled in fleet.`
    );
  };

  const updateVehicleStatus = (id: string, status: Vehicle['status']) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  // Add new student
  const addStudent = (studentData: Omit<Student, 'id' | 'isOnBoard' | 'attendanceStatus' | 'lastScanTime'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `STU-${100 + students.length + 1}`,
      isOnBoard: false,
      attendanceStatus: 'ABSENT',
    };

    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog(
      'STUDENT_REGISTERED',
      'School Admin',
      'SCHOOL_ADMIN',
      newStudent.fullName,
      `Student ${newStudent.fullName} (${newStudent.studentId}) registered with NFC ID: ${newStudent.nfcId}.`
    );
  };

  const toggleStudentBoarding = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newBoardStatus = !s.isOnBoard;
        return {
          ...s,
          isOnBoard: newBoardStatus,
          attendanceStatus: newBoardStatus ? 'ON_BOARD' : 'PRESENT',
          lastScanTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      })
    );
  };

  // Simulate NFC Scan
  const simulateNfcScan = (studentId: string, eventType: 'BOARD' | 'DEBOARD' | 'SCHOOL_ARRIVAL' = 'BOARD') => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student card not recognized in SEVAS registry' };
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const targetVehicle = student.assignedVehicleId || 'BUS-001';

    const newScan: NfcScanRecord = {
      id: `SCAN-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.fullName,
      nfcId: student.nfcId,
      vehicleId: targetVehicle,
      scanTime: nowStr,
      eventType,
      status: 'SUCCESS',
    };

    setNfcScans((prev) => [newScan, ...prev]);

    // Update student status
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const isOnBoard = eventType === 'BOARD';
        const attendanceStatus = eventType === 'BOARD' ? 'ON_BOARD' : 'PRESENT';
        return {
          ...s,
          isOnBoard,
          attendanceStatus,
          lastScanTime: nowStr,
        };
      })
    );

    // Update vehicle passenger count
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== targetVehicle) return v;
        const delta = eventType === 'BOARD' ? 1 : -1;
        return {
          ...v,
          studentsOnBoard: Math.max(0, Math.min(v.capacity, v.studentsOnBoard + delta)),
        };
      })
    );

    // Create mock parent notification
    const newNotif: ParentNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      parentName: student.parent1Name,
      studentName: student.fullName,
      type: eventType === 'BOARD' ? 'STUDENT_BOARDED' : 'STUDENT_ARRIVED',
      message: `${student.fullName} ${eventType === 'BOARD' ? 'boarded ' + targetVehicle : 'safely arrived'} at ${nowStr}.`,
      timestamp: nowStr,
      deliveryChannel: 'WHATSAPP',
      deliveryStatus: 'DELIVERED',
    };

    setParentNotifications((prev) => [newNotif, ...prev]);

    addAuditLog(
      'NFC_TAP_EVENT',
      'Hardware Reader SEV-NFC-01',
      'SCHOOL_ADMIN',
      student.fullName,
      `NFC ID ${student.nfcId} scanned. Event: ${eventType} on ${targetVehicle}.`
    );

    return {
      success: true,
      message: `Card scan authorized for ${student.fullName} (${eventType})`,
      record: newScan,
    };
  };

  // Simulate accident trigger
  const simulateAccident = (vehicleId: string, severity: EmergencySeverity = 'SEVERE', fireDetected: boolean = false) => {
    const targetBus = vehicles.find((v) => v.id === vehicleId) || vehicles[3] || vehicles[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAlert: EmergencyAlert = {
      id: `EMG-${Date.now().toString().slice(-4)}`,
      vehicleId: targetBus.id,
      vehiclePlate: targetBus.plateNumber,
      severity,
      time: nowTime,
      timestamp: Date.now(),
      locationName: 'Cairo Ring Road — East Sector Corridor',
      coordinates: targetBus.currentLocation,
      studentsOnBoard: targetBus.studentsOnBoard || 18,
      estimatedInjured: severity === 'SEVERE' ? 4 : severity === 'MEDIUM' ? 1 : 0,
      fireDetected,
      driverName: targetBus.driver.fullName,
      driverPhone: targetBus.driver.phone,
      driverBloodType: targetBus.driver.bloodType,
      description: `Impact event triggered by CAN-Bus G-sensor threshold exceedance (>4.5G). Camera CV model confirms structural deceleration. Emergency state declared.`,
      status: 'ACTIVE',
      parentNotificationStatus: 'PENDING',
      aiConfidence: {
        accidentConfidence: 0.98,
        injuryConfidence: 0.89,
        fireConfidence: fireDetected ? 0.85 : 0.02,
      },
    };

    setActiveEmergency(newAlert);

    // Update vehicle status
    setVehicles((prev) =>
      prev.map((v) => (v.id === targetBus.id ? { ...v, status: 'EMERGENCY', currentSpeed: 0 } : v))
    );

    // Focus map
    setFocusedMapCoords(targetBus.currentLocation);

    addAuditLog(
      'EMERGENCY_TRIGGERED',
      'AI Detection Pipeline (DEMO SIMULATION)',
      'SEVAS_TEAM_LEADER',
      targetBus.id,
      `Accident detected on ${targetBus.id}. Severity: ${severity}. AI Confidence: 98%.`
    );
  };

  // Immediate Driver Emergency SOS Trigger
  const triggerDriverSos = (vehicleId: string, emergencyType: string = 'DRIVER_MANUAL_SOS') => {
    const targetBus = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAlert: EmergencyAlert = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      vehicleId: targetBus.id,
      vehiclePlate: targetBus.plateNumber,
      severity: 'SEVERE',
      time: nowTime,
      timestamp: Date.now(),
      locationName: `${targetBus.assignedRoute.split('—')[1]?.trim() || 'Cairo Transit Corridor'} (Driver Cockpit SOS)`,
      coordinates: targetBus.currentLocation,
      studentsOnBoard: targetBus.studentsOnBoard || 18,
      estimatedInjured: 0,
      fireDetected: false,
      driverName: targetBus.driver.fullName,
      driverPhone: targetBus.driver.phone,
      driverBloodType: targetBus.driver.bloodType,
      description: `CRITICAL DRIVER SOS BROADCAST: Driver ${targetBus.driver.fullName} declared an immediate high-priority emergency from onboard mobile terminal. Paramedics (123) and School Emergency Dispatch alerted.`,
      status: 'ACTIVE',
      parentNotificationStatus: 'PENDING',
      aiConfidence: {
        accidentConfidence: 0.99,
        injuryConfidence: 0.85,
        fireConfidence: 0.05,
      },
    };

    setActiveEmergency(newAlert);

    // Update vehicle status immediately to EMERGENCY and speed to 0
    setVehicles((prev) =>
      prev.map((v) => (v.id === targetBus.id ? { ...v, status: 'EMERGENCY', currentSpeed: 0 } : v))
    );

    // Focus map immediately on accident locus
    setFocusedMapCoords(targetBus.currentLocation);

    addAuditLog(
      'DRIVER_SOS_TRIGGERED',
      targetBus.driver.fullName,
      'SCHOOL_ADMIN',
      targetBus.id,
      `DRIVER EMERGENCY SOS INITIATED: Immediate high-priority alert broadcasted for ${targetBus.id} (${targetBus.plateNumber}) with ${targetBus.studentsOnBoard} students onboard.`
    );

    return newAlert;
  };

  // Resolve emergency
  const resolveEmergency = (emergencyId: string, resolutionNotes: string = 'Situation verified and contained by paramedics and school transport team.') => {
    if (!activeEmergency || activeEmergency.id !== emergencyId) return;

    const resolvedAlert: EmergencyAlert = {
      ...activeEmergency,
      status: 'RESOLVED',
    };

    setEmergencyHistory((prev) => [resolvedAlert, ...prev]);
    setActiveEmergency(null);

    // Reset vehicle status back to ONLINE
    setVehicles((prev) =>
      prev.map((v) => (v.id === activeEmergency.vehicleId ? { ...v, status: 'ONLINE', currentSpeed: 30 } : v))
    );

    addAuditLog(
      'EMERGENCY_RESOLVED',
      'School Admin',
      'SCHOOL_ADMIN',
      activeEmergency.vehicleId,
      `Emergency ${emergencyId} marked as RESOLVED. Notes: ${resolutionNotes}`
    );
  };

  // Handle Parent Notification decision by School Admin
  const handleParentNotificationDecision = (emergencyId: string, approved: boolean, schoolAdminName: string) => {
    if (!activeEmergency || activeEmergency.id !== emergencyId) return;

    const updatedAlert: EmergencyAlert = {
      ...activeEmergency,
      parentNotificationStatus: approved ? 'CONFIRMED' : 'DECLINED',
      parentNotifiedAt: approved ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    };

    setActiveEmergency(updatedAlert);

    if (approved) {
      // Create emergency notifications for parents of students on board this vehicle
      const affectedStudents = students.filter((s) => s.assignedVehicleId === activeEmergency.vehicleId && s.isOnBoard);
      const newNotifs: ParentNotification[] = (affectedStudents.length > 0 ? affectedStudents : students.slice(0, 4)).map((s) => ({
        id: `NOTIF-EMG-${s.id}-${Date.now().toString().slice(-4)}`,
        parentName: s.parent1Name,
        studentName: s.fullName,
        type: 'EMERGENCY_ALERT',
        message: `EMERGENCY ALERT: Bus ${activeEmergency.vehicleId} encountered a traffic event at ${activeEmergency.time}. School safety team and emergency medical response are actively on-site. Your child ${s.fullName} is under medical care and evaluation. Stand by for official liaison updates.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        deliveryChannel: 'WHATSAPP',
        deliveryStatus: 'DELIVERED',
      }));

      setParentNotifications((prev) => [...newNotifs, ...prev]);
    }

    addAuditLog(
      approved ? 'PARENT_ALERT_APPROVED' : 'PARENT_ALERT_DECLINED',
      schoolAdminName,
      'SCHOOL_ADMIN',
      activeEmergency.vehicleId,
      `School Admin explicitly ${approved ? 'CONFIRMED' : 'DECLINED'} parent WhatsApp broadcast for Emergency ${emergencyId}. Decision recorded in compliance log.`
    );
  };

  // Submit school registration request
  const submitSchoolRequest = (data: Omit<SchoolRegistrationRequest, 'id' | 'requestDate' | 'status'>) => {
    const newReq: SchoolRegistrationRequest = {
      ...data,
      id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      requestDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'PENDING',
    };

    setSchoolRequests((prev) => [newReq, ...prev]);
    addAuditLog(
      'SCHOOL_REGISTRATION_SUBMITTED',
      data.fullName,
      'SCHOOL_ADMIN',
      data.schoolName,
      `Application filed by ${data.fullName} (${data.professionalTitle}) for ${data.schoolName}.`
    );
  };

  // Approve school request by SEVAS Team
  const approveSchoolRequest = (requestId: string, reviewerName: string) => {
    const req = schoolRequests.find((r) => r.id === requestId);
    if (!req) return { username: '', tempPass: '' };

    const firstWord = req.fullName.split(' ')[0].toLowerCase();
    const generatedUsername = `${firstWord}.admin${Math.floor(10 + Math.random() * 89)}`;
    const temporaryPassword = `SEVAS#${Math.floor(1000 + Math.random() * 9000)}!`;

    setSchoolRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              generatedUsername,
              temporaryPassword,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : r
      )
    );

    addAuditLog(
      'SCHOOL_REQUEST_APPROVED',
      reviewerName,
      'SEVAS_TEAM_LEADER',
      req.schoolName,
      `Account approved. Generated credentials: Username [${generatedUsername}], Temp Password dispatched to mock WhatsApp (+20 ${req.whatsappNumber}).`
    );

    return { username: generatedUsername, tempPass: temporaryPassword };
  };

  // Reject school request
  const rejectSchoolRequest = (requestId: string, reviewerName: string, reason: string) => {
    setSchoolRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              notes: `Rejected: ${reason}`,
            }
          : r
      )
    );

    addAuditLog(
      'SCHOOL_REQUEST_REJECTED',
      reviewerName,
      'SEVAS_TEAM_LEADER',
      requestId,
      `Registration request rejected. Reason: ${reason}`
    );
  };

  const toggleSimulation = () => {
    setIsSimulationActive((prev) => !prev);
  };

  return (
    <SevasDataContext.Provider
      value={{
        vehicles,
        selectedVehicleId,
        selectedVehicle,
        setSelectedVehicleId,
        addVehicle,
        updateVehicleStatus,

        students,
        selectedStudentId,
        selectedStudent,
        setSelectedStudentId,
        addStudent,
        toggleStudentBoarding,

        nfcScans,
        simulateNfcScan,

        activeEmergency,
        emergencyHistory,
        simulateAccident,
        triggerDriverSos,
        resolveEmergency,
        handleParentNotificationDecision,

        schoolRequests,
        submitSchoolRequest,
        approveSchoolRequest,
        rejectSchoolRequest,

        schools,
        parentNotifications,

        auditLogs,
        addAuditLog,

        aiTelemetry,

        isSimulationActive,
        toggleSimulation,
        focusedMapCoords,
        setFocusedMapCoords,
      }}
    >
      {children}
    </SevasDataContext.Provider>
  );
};

export const useSevasData = () => {
  const context = useContext(SevasDataContext);
  if (!context) {
    throw new Error('useSevasData must be used within a SevasDataProvider');
  }
  return context;
};
