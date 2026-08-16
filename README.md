# Zero Trust Access Control Platform

A production-aligned, modular Zero Trust Architecture (ZTA) security platform built with TypeScript and Node.js, implementing the NIST SP 800-207 Zero Trust specification across 12 independent modules.

---

## ⚠️ Project Status

| Module | Status |
|---|---|
| Module 0  — Core Utilities | ✅ Complete |
| Module 1  — Identity & Authentication | ✅ Complete |
| Module 2  — Device Trust | ✅ Complete |
| Module 3  — Context Engine | ✅ Complete |
| Module 4  — Behavior Analytics | ✅ Complete |
| Module 5  — Trust Score Engine | ✅ Complete |
| Module 6  — Policy Engine | ✅ Complete |
| Module 7  — Policy Enforcement Point | ✅ Complete |
| Module 8  — Resource Layer | ✅ Complete |
| Module 9  — Monitoring & Telemetry | ✅ Complete |
| Module 10 — Admin & Governance | ✅ Complete |
| Module 11 — Server Runtime & Deployment | ✅ Complete |
| Module 12 — Frontend Layer | ✅ Complete |
| Module 13 — Developer SDK & Integration Gateway | 🔧 In Progress |

---

## Overview

Zero Trust Architecture eliminates implicit trust from every layer of a system. This platform enforces the principle of **Never Trust, Always Verify** by evaluating every access request against five independent signal sources before making an access decision.

Traditional security models trust users and devices inside a network perimeter. This platform treats every request — regardless of origin — as untrusted until verified through identity, device posture, location context, behavioral patterns, and resource sensitivity.

---

## Core Principles

- **Verify Explicitly** — Every request evaluated against all available signals simultaneously
- **Least Privilege Access** — Minimum permissions for minimum time, no permanent access
- **Assume Breach** — Architecture designed as if an attacker is already present

---

## Architecture

The platform is organised into four layers:

```
LAYER 1 — CLIENT & INTEGRATION     Module 12 (Frontend)
LAYER 2 — RUNTIME & ROUTING        Module 11 (Server)
LAYER 3 — ZERO TRUST PIPELINE      Modules 1 – 7
LAYER 4 — RESOURCES & GOVERNANCE   Modules 0, 8 – 10
```

### Request Pipeline

```
Client Request
    ↓
Module 11  — Runtime receives and starts pipeline
    ↓
Module 1   — Identity verified (password + MFA)
    ↓
Module 2   — Device posture evaluated (OS, AV, encryption)
    ↓
Module 3   — Context analysed (location, network, time)
    ↓
Module 4   — Behavior compared against baseline
    ↓
Module 5   — Trust Score calculated (0 – 100)
    ↓
Module 6   — Policy Engine decides (ALLOW / DENY / STEP-UP)
    ↓
Module 7   — Enforcement Point executes decision
    ↓
Module 8   — Protected resource served (if allowed)
    ↓
Module 9   — All events logged and monitored
    ↓
Module 10  — Audit trail updated
```

---

## Trust Score Formula

The Trust Score is the mathematical core of the pipeline. It aggregates signals from four independent modules into a normalised score between 0 and 100.

```
Trust Score = ( IT + DT + NT + BT − RS ) ÷ 85 × 100
```

| Signal | Max Points | What It Measures |
|---|---|---|
| Identity Trust (IT) | 25 | MFA, login history, password strength, role |
| Device Trust (DT) | 25 | OS patch, antivirus, encryption, certificate |
| Network / Location (NT) | 15 | VPN, known IP, geo-location, public Wi-Fi |
| Behavior Trust (BT) | 20 | Access patterns, frequency, sequence, travel |
| Resource Sensitivity (RS) | −15 | Penalty for accessing sensitive resources |

| Score | Decision |
|---|---|
| 80 – 100 | ALLOW — full access granted |
| 50 – 79 | STEP-UP — limited access + MFA required |
| 0 – 49 | DENY — access blocked + alert triggered |

---

## Module Breakdown

### Module 0 — Core Utilities
Shared infrastructure used by all modules. Contains configuration, environment validation, structured logging, error classes, reusable utilities, and TypeScript contracts that define inter-module data shapes. No business logic.

### Module 1 — Identity & Authentication
Verifies user identity through password authentication and Multi-Factor Authentication. Issues short-lived JWT tokens. Produces identity confidence signals for downstream modules. Does not make access decisions.

### Module 2 — Device Trust
Evaluates device posture at request time. Checks OS patch level, antivirus presence, disk encryption status, and network type. Produces HEALTHY / DEGRADED / HIGH-RISK device rating. Evaluated per request, not at registration.

### Module 3 — Context Engine
Analyses environmental signals including geographic location, network type, and access time. Detects impossible travel, Tor/proxy usage, and time-based anomalies. All context treated as untrusted.

### Module 4 — Behavior Analytics
Establishes a normal behavioral baseline per identity. Detects deviations including request frequency spikes, unusual resource access sequences, and pattern anomalies. Primary defence against insider threats and account takeover.

### Module 5 — Trust Score Engine
Aggregates signals from Modules 1–4 into a normalised trust score using the weighted formula above. Provides human-readable explanation of score composition. Never makes access decisions.

### Module 6 — Policy Engine
Evaluates trust score against access policies for the requested resource. Produces ALLOW, DENY, or STEP-UP decisions. Policies are defined as code — explicit, versioned, and auditable.

### Module 7 — Policy Enforcement Point
Executes the decision produced by Module 6. Routes requests to allow handler, deny handler, or step-up authentication handler. Logs every enforcement action. Never re-evaluates or modifies decisions.

### Module 8 — Resource Layer
Represents protected applications, APIs, and data systems. Resources are completely trust-agnostic — they receive only requests forwarded by Module 7. No resource is directly accessible.

### Module 9 — Monitoring & Telemetry
Collects and normalises log events from all pipeline modules. Generates alerts for anomalous patterns. Feeds security insights back into the governance layer. Never makes enforcement decisions.

### Module 10 — Admin & Governance
Human control plane for policy management, audit trail review, and emergency access overrides. All overrides are time-bound and fully logged. Multi-party approval required for sensitive operations.

### Module 11 — Server Runtime & Deployment
Bootstraps the application server, exposes public API endpoints, and orchestrates the Zero Trust pipeline. Serves the frontend as static files from the same process. Supports local development and cloud deployment.

### Module 12 — Frontend Layer
User-facing dashboard providing login portal, MFA prompts, trust score visualisation, device health display, and admin control panel. Communicates exclusively with Module 11 API. No direct database access.

### Module 13 — Developer SDK & Integration Gateway *(In Progress)*
Will provide typed SDK libraries for web applications, mobile apps, microservices, and IoT devices. Will include client-type normalisation adapters, secure handshake, and standardised request/response contracts.

---

## Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Language | TypeScript | Static typing enforces inter-module contracts at compile time |
| Runtime | Node.js | Lightweight, native to TypeScript, strong security ecosystem |
| Frontend | React + Vite | Fast build, TypeScript native, modern component model |
| Authentication | JWT + bcrypt | Industry standard, stateless, short-lived tokens |
| Logging | Structured JSON | Machine-readable, correlatable across modules |
| Deployment | Render | Single service hosting frontend and backend |

---

## Requirements

### System Requirements

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| TypeScript | 5.x or higher |
| Operating System | Windows 10 / Ubuntu 20.04 / macOS 12 |

### Environment Variables

Create a `.env` file in the project root. All variables are required for production:

```env
# Application
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=minimum-64-character-random-string-here
JWT_EXPIRY=15m
MFA_SECRET=minimum-64-character-random-string-here

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
BCRYPT_ROUNDS=12
TOKEN_EXPIRY_MINUTES=15
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=30

# Frontend (for local development)
VITE_API_URL=http://localhost:3000
```

### Dependencies

The project uses the following core packages:

**Backend**
```
express          — HTTP server framework
jsonwebtoken     — JWT generation and verification
bcryptjs         — Password hashing
dotenv           — Environment variable loading
winston          — Structured logging
cors             — Cross-origin request handling
helmet           — HTTP security headers
express-rate-limit — Request rate limiting
```

**Frontend**
```
react            — UI framework
react-dom        — DOM rendering
vite             — Build tool
typescript       — Type checking
axios            — HTTP client for API calls
```

**Development**
```
typescript       — TypeScript compiler
ts-node          — TypeScript execution for development
nodemon          — Auto-restart on file changes
@types/node      — Node.js type definitions
@types/express   — Express type definitions
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ezhilraghavan20/zero-trust-app.git
cd zero-trust-app
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd modules/module-12-frontend
npm install
cd ../..
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values.

### 5. Build the Project

```bash
npm run build
```

### 6. Start the Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

---

## Development

### Run in Development Mode

```bash
# Terminal 1 — Backend with hot reload
npx nodemon

# Terminal 2 — Frontend dev server
cd modules/module-12-frontend
npm run dev
```

### Type Check Without Building

```bash
npx tsc --noEmit
```

### Run Frontend Build Only

```powershell
# PowerShell
cd modules/module-12-frontend
npm run build
```

---

## Deployment

The application is deployed as a single service on Render, serving both the backend API and frontend from one process.

### Render Configuration

```yaml
services:
  - type: web
    name: zero-trust-app
    runtime: node
    buildCommand: npm run build
    startCommand: node dist/modules/module-11-runtime/server/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

### Build Process

1. Frontend is compiled by Vite into `modules/module-12-frontend/dist`
2. TypeScript backend is compiled into `dist/`
3. Module 11 serves the frontend dist as static files
4. All API routes remain available under `/api/`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Platform health check |
| GET | /status | Detailed service status |
| POST | /api/auth/login | Identity authentication |
| POST | /api/auth/mfa | MFA verification |
| POST | /api/access/request | Zero Trust access evaluation |
| GET | /api/admin/audit | Audit trail (admin only) |
| GET | /api/admin/policies | Policy management (admin only) |

---

## Security Features

- Multi-Factor Authentication on every login
- Short-lived JWT tokens (15 minute expiry)
- Per-request device posture evaluation
- Continuous behavioral baseline monitoring
- Geographic anomaly detection
- Impossible travel detection
- Rate limiting on all authentication endpoints
- HTTP security headers via Helmet
- Immutable audit trail for all access decisions
- CORS policy enforcement

---

## Compliance Alignment

| Standard | Coverage |
|---|---|
| NIST SP 800-207 | Full Zero Trust Architecture alignment |
| ISO 27001 | Audit trail, access control, incident logging |
| SOC 2 | Continuous monitoring, policy documentation |

---

## Project Structure

```
zero-trust-app/
├── modules/
│   ├── module-0-core/
│   ├── module-1-identity/
│   ├── module-2-device-trust/
│   ├── module-3-context-engine/
│   ├── module-4-behavior-analytics/
│   ├── module-5-trust-score/
│   ├── module-6-policy-engine/
│   ├── module-7-enforcement-point/
│   ├── module-8-resource-layer/
│   ├── module-9-monitoring/
│   ├── module-10-admin/
│   ├── module-11-runtime/
│   ├── module-12-frontend/
│   └── module-13-integration-sdk/     ← In Progress
├── .env.example
├── .gitignore
├── package.json
├── render.yaml
├── tsconfig.json
└── README.md
```

---

## Author

**Ezhil Raghavan**
Pre-Final Year — Computer Science and Engineering
Arunai Engineering College, Tamil Nadu

---

## License

MIT License — see LICENSE file for details.
