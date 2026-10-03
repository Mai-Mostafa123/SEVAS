export type UserRole = 
  | 'SEVAS_TEAM_LEADER' 
  | 'SEVAS_TEAM_MEMBER' 
  | 'SCHOOL_ADMIN' 
  | 'PARENT';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  email?: string;
  phone?: string;
}

export type EmergencySeverity = 'LOW' | 'MEDIUM' | 'SEVERE';

export interface GpsCoordinate {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string; // e.g. "BUS-001"
  busNumber: string;
  plateNumber: string;
  deviceId: string;
  vehicleType: string;
  capacity: number;
  assignedRoute: string;
  status: 'ONLINE' | 'OFFLINE' | 'EMERGENCY' | 'MAINTENANCE';
  currentSpeed: number; // km/h
  gpsStatus: 'ACTIVE' | 'SIGNAL_LOST' | 'CALIBRATING';
  sensorsStatus: 'NORMAL' | 'ALERT' | 'OFFLINE';
  studentsOnBoard: number;
  lastUpdate: string;
  currentLocation: GpsCoordinate;
  driver: {
    fullName: string;
    phone: string;
    whatsapp: string;
    nationalId: string;
    bloodType: string;
  };
  deviceInfo: {
    gpsModel: string;
    firmware: string;
    batteryLevel: number;
    signalStrength: number; // 0-100
  };
  routeWaypoints: GpsCoordinate[];
  routeIndex: number;
}

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  nationalId: string;
  classGrade: string;
  nfcId: string;
  bloodType: string;
  medicalInfo: string;
  allergies: string;
  parent1Name: string;
  parent2Name?: string;
  parentPhone: string;
  parentWhatsapp: string;
  emergencyContact: string;
  assignedVehicleId: string;
  isOnBoard: boolean;
  isRegistered: boolean;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'ON_BOARD' | 'DEBOARDED';
  lastScanTime?: string;
}

export interface NfcScanRecord {
  id: string;
  studentId: string;
  studentName: string;
  nfcId: string;
  vehicleId: string;
  scanTime: string;
  eventType: 'BOARD' | 'DEBOARD' | 'SCHOOL_ARRIVAL';
  status: 'SUCCESS' | 'WARNING' | 'REJECTED';
}

export interface EmergencyAlert {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  severity: EmergencySeverity;
  time: string;
  timestamp: number;
  locationName: string;
  coordinates: GpsCoordinate;
  studentsOnBoard: number;
  estimatedInjured: number;
  fireDetected: boolean;
  driverName: string;
  driverPhone: string;
  driverBloodType: string;
  description: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'RESPONDING' | 'RESOLVED';
  parentNotificationStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  parentNotifiedAt?: string;
  aiConfidence: {
    accidentConfidence: number; // e.g. 0.97
    injuryConfidence: number;
    fireConfidence: number;
  };
}

export interface SchoolRegistrationRequest {
  id: string;
  fullName: string; // Must have 4 name parts
  nationalId: string;
  phoneNumber: string;
  whatsappNumber: string;
  professionalTitle: string;
  schoolName: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  generatedUsername?: string;
  temporaryPassword?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface SchoolEntity {
  id: string;
  name: string;
  address: string;
  district: string;
  activeBusesCount: number;
  totalStudentsCount: number;
  adminName: string;
  adminPhone: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface ParentNotification {
  id: string;
  parentId?: string;
  parentName: string;
  studentName: string;
  type: 'STUDENT_BOARDED' | 'STUDENT_ARRIVED' | 'EMERGENCY_ALERT' | 'ROUTE_DELAY';
  message: string;
  timestamp: string;
  deliveryChannel: 'WHATSAPP' | 'SMS' | 'PUSH';
  deliveryStatus: 'DELIVERED' | 'SENT' | 'FAILED' | 'READ';
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  target: string;
  details: string;
  timestamp: string;
}

export interface AiDetectionTelemetry {
  accidentDetectionConfidence: number; // 97%
  passengerDetectionConfidence: number; // 94%
  injuryEstimationConfidence: number; // 91%
  fireSmokeDetectionConfidence: number; // 2%
  vehicleConditionConfidence: number; // 96%
  systemLatencyMs: number;
  inferenceFps: number;
  activeCameraStreams: number;
  modelEngine: string;
}
