# SEVAS — Smart Emergency Vehicle Alert System

> **“EVERY SECOND SAVES A LIFE.”**

SEVAS is a full-stack smart transportation, student safety, and emergency response command platform designed specifically for school transit fleets, regional emergency medical services, and automated parent communication.

---

## 1. Official Brand Identity & Visual Language

SEVAS utilizes the official visual identity throughout the entire platform:
- **Primary Canvas**: Near-black / deep void (`#05070A`) with hairline borders (`#1F2937`)
- **Primary Accent**: SEVAS Crimson Red (`#E51B24`) with subtle volumetric glow
- **Secondary Accent**: Pure White (`#FFFFFF`) and High-Contrast Typography
- **Core Emblem**: The Knight's Shield containing a white forward-facing vehicle with a radiating emergency siren and bilateral red ECG heartbeat pulse waveforms
- **Slogan**: **“EVERY SECOND SAVES A LIFE.”**

---

## 2. Technology Stack & Architecture

```
SEVAS/
├── src/                          # React + TypeScript + Vite + Tailwind CSS Frontend
│   ├── components/
│   │   ├── common/               # Official SevasLogo, Header, Sidebar
│   │   ├── map/                  # Leaflet Dark Matter Interactive Transit Map
│   │   ├── emergency/            # Critical Alert Banner, Simulator, Modals
│   │   ├── nfc/                  # Hardware Terminal RFID Reader Simulation
│   │   ├── vehicles/             # Fleet Enrollment & Inspection Profilers
│   │   └── students/             # Student Enrollment & Biometric Health Manifest
│   ├── context/                  # AuthContext (RBAC) & SevasDataContext (Telemetry)
│   ├── pages/
│   │   ├── auth/                 # Login Portal & School Administrative Registration
│   │   ├── school/               # Overview, Fleet, Radar, NFC, Emergencies, AI, Reports
│   │   └── team/                 # SEVAS Operations, Requests Review, Schools Network
│   └── services/                 # Mock Cairo Transit Telemetry & Simulated WebSocket
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL relational models & indexes
│   └── src/                      # NestJS / Express API controllers & WebSocket broker
│
└── ai-service/
    └── main.py                   # Python / FastAPI Computer Vision Microservice (YOLOv11)
```

---

## 3. Demo Credentials (Immediate Testing)

| Role | Username | Password | Default Scope |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `school.admin` | `school@admin2026` | Al-Farabi Modern International School |
| **SEVAS Team Leader** | `retaj.leader` | `sevas@leader2026` | National Emergency Command & School Approvals |
| **Parent Portal** | `parent.demo` | `parent@2026` | Student Attendance & Transit Tracking |

*Tip: You can also use the role switcher located at the top-right of the dashboard header to switch perspectives instantly.*

---

## 4. Key Interactive Capabilities

### A. Real-Time Moving GPS Simulation
- Vehicles (`BUS-001`, `BUS-002`, `BUS-003`, `BUS-007`) stream real-time coordinates along predefined Cairo highway corridors (Ring Road, New Cairo, Maadi, Nasr City).
- Interactive Leaflet map with dark CartoDB tiles, speed indicators, street-level zooming, and click-to-inspect drawers.

### B. Contactless NFC Attendance Terminal
- Prominent visual RFID card reader hardware representation.
- Click **"SIMULATE CARD TAP"** with any student card to trigger real-time boarding or school entrance logging.
- Automatically updates bus occupancy and dispatches simulated WhatsApp arrival alerts.

### C. Emergency Response & Paramedic Dispatch
- Active collision on `BUS-007` (Cairo Ring Road) with simulated accelerometer impact (>4.8G).
- Paramedic 123 emergency dispatch integration.
- **School Admin Explicit Consent**: Decision dialog (**YES** / **NO**) to broadcast emergency WhatsApp alerts to parents, with every decision permanently recorded in the regulatory audit log.
- **"SIMULATE ACCIDENT"**: Development sandbox button to trigger new collision events on any bus with customizable severity and fire detection flags.

### D. AI & Computer Vision Telemetry (FastAPI)
- Multi-camera stream viewports (Roadway horizon and interior passenger cabin).
- Multi-spectral confidence scores (**DEMO VALUES**):
  - Accident Detection: **97%**
  - Passenger Detection: **94%**
  - Injury Estimation: **91%**
  - Fire/Smoke Detection: **2%**
  - Vehicle Condition: **96%**

### E. School Registration Request Flow
- Enforces strict **four-part full name validation** (e.g., *"Ahmed Mohamed Ali Hassan"*).
- When submitted, routes to the SEVAS Team Leader dashboard for review, approval, username generation, and mock WhatsApp credential dispatch.

---

## 5. Local Setup & Execution

### Frontend Development
```bash
# Install dependencies
npm install

# Start Vite development server on port 3000
npm run dev
```

### AI Service (FastAPI)
```bash
cd ai-service
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

### Database Migration (Prisma)
```bash
npx prisma migrate dev --name init
```
