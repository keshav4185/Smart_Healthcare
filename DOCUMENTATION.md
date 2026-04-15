# Smart Healthcare Diagnosis & Appointment System

## Project Overview

A full-stack Smart Healthcare web application built with React + Node.js.
Patients can check symptoms using AI, upload medical scans for AI analysis, book appointments with verified doctors, manage medical records, and reset their password via email.
Doctors manage appointments, patients, and prescriptions. Admins verify doctor registrations.

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool + dev server |
| React Router DOM | 7.13.1 | Client-side routing |
| Axios | 1.13.6 | HTTP client |
| Tailwind CSS | 3.4.0 | Styling |
| Lucide React | 0.577.0 | Icons |
| React Icons | 5.6.0 | Additional icons |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express | 4.19.2 | Web framework |
| Mongoose | 8.4.1 | MongoDB ODM |
| JWT (jsonwebtoken) | 9.0.2 | Authentication tokens |
| Bcryptjs | 2.4.3 | Password hashing |
| Multer | 1.4.5 | File uploads |
| Nodemailer | 8.0.5 | Email sending |
| @google/generative-ai | 0.24.1 | Gemini AI integration |
| Cloudinary | 2.2.0 | Cloud file storage |
| PDFKit | 0.18.0 | PDF generation |
| Nodemon | 3.1.3 | Dev auto-restart |

---

## Project Structure

```
Smart healthcare/
├── smart-healthcare/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Button, Card, Input, Loading, Skeleton, EmergencySOS
│   │   │   └── layout/                # MainLayout, Navbar, Sidebar
│   │   ├── constants/
│   │   │   ├── apiEndpoints.js        # All API endpoint constants
│   │   │   └── roles.js               # USER_ROLES constants
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Global auth state (user, login, logout, register)
│   │   │   ├── AppointmentContext.jsx # Appointment state management
│   │   │   └── LanguageContext.jsx    # English / Marathi toggle
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   ├── patient/
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   ├── SymptomsPage.jsx
│   │   │   │   ├── AppointmentsPage.jsx
│   │   │   │   ├── DoctorListPage.jsx
│   │   │   │   ├── DoctorProfilePage.jsx
│   │   │   │   ├── BookAppointmentPage.jsx
│   │   │   │   └── MedicalRecordsPage.jsx
│   │   │   ├── doctor/
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   ├── DoctorAppointmentsPage.jsx
│   │   │   │   ├── DoctorPatientsPage.jsx
│   │   │   │   └── DoctorDiagnosesPage.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── routes/
│   │   │   ├── index.jsx              # All route definitions
│   │   │   ├── ProtectedRoute.jsx     # Auth + role guard
│   │   │   └── RoleRedirect.jsx       # Redirects to role dashboard
│   │   ├── services/api/
│   │   │   ├── axiosInstance.js       # Base HTTP client with interceptors
│   │   │   ├── authService.js         # login, register, logout, refresh
│   │   │   ├── appointmentService.js  # CRUD + booked slots
│   │   │   ├── adminService.js        # Dashboard, doctor management
│   │   │   ├── doctorService.js       # Dashboard, patients, diagnosis, availability
│   │   │   ├── patientService.js      # Dashboard, records, prescriptions, scan upload
│   │   │   ├── userService.js         # Profile, password, photo upload
│   │   │   └── diagnosisService.js    # AI predict, history
│   │   └── utils/
│   │       ├── validation.js          # Form field validators
│   │       ├── helpers.js             # Date/time formatters
│   │       ├── aiAnalysis.js          # Severity color mapping
│   │       ├── pdfGenerator.js        # PDF export
│   │       └── secureStorage.js       # Secure localStorage wrapper
│   ├── .env
│   └── package.json
│
└── Smart-healthcare-backend/          # Backend (Node.js + Express)
    ├── src/
    │   ├── config/
    │   │   ├── db.js                  # MongoDB connection
    │   │   └── cloudinary.js          # Multer disk storage config
    │   ├── constants/
    │   │   ├── roles.js               # ROLES, DOCTOR_STATUS, APPOINTMENT_STATUS
    │   │   └── symptoms.js            # Symptom rules for fallback diagnosis
    │   ├── controllers/
    │   │   ├── authController.js      # register, login, logout, refresh, forgotPassword, resetPassword
    │   │   ├── aiController.js        # diagnose, scanAnalysis
    │   │   ├── appointmentController.js
    │   │   ├── diagnosisController.js
    │   │   ├── doctorController.js
    │   │   ├── patientController.js
    │   │   ├── adminController.js
    │   │   ├── uploadController.js
    │   │   └── userController.js
    │   ├── middleware/
    │   │   ├── authMiddleware.js      # protect — verifies JWT, attaches req.user
    │   │   └── roleMiddleware.js      # authorizeRoles — checks user role
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Appointment.js
    │   │   ├── Diagnosis.js
    │   │   └── MedicalRecord.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── ai.js
    │   │   ├── user.js
    │   │   ├── patient.js
    │   │   ├── doctor.js
    │   │   ├── admin.js
    │   │   ├── appointments.js
    │   │   ├── diagnosis.js
    │   │   └── upload.js
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── geminiService.js       # Gemini AI with model fallback chain
    │   │   ├── diagnosisService.js
    │   │   ├── appointmentService.js
    │   │   ├── doctorService.js
    │   │   ├── patientService.js
    │   │   ├── adminService.js
    │   │   └── userService.js
    │   ├── utils/
    │   │   ├── emailService.js        # Gmail SMTP via Nodemailer
    │   │   ├── generateToken.js       # JWT access + refresh token generator
    │   │   └── response.js            # sendSuccess / sendError helpers
    │   └── app.js                     # Express app entry point
    ├── uploads/                       # Local file storage
    ├── .env
    └── package.json
```

---

## Database Models

### User
```
name, email, password, role (patient | doctor | admin)
phone, address, profilePhoto

Patient fields:   dob, bloodGroup, age, gender
Doctor fields:    specialty, licenseNumber, hospital, experience,
                  education, certificate, fee, available,
                  documents { degreeCertificate, idProof, selfieWithId },
                  status (pending | verified | rejected), rating

Auth fields:      refreshToken, resetPasswordToken, resetPasswordExpires
```

### Appointment
```
patientId (ref: User), doctorId (ref: User)
date, timeSlot, reason, symptoms[]
status (pending | confirmed | completed | cancelled)
fee, type (In-person | Video)
```

### Diagnosis
```
patientId (ref: User)
symptoms[], severity, duration
condition, specialist, urgency, recommendations
```

### MedicalRecord
```
patientId (ref: User), doctorId (ref: User)
type (Lab Report | Prescription | X-Ray | CT Scan | MRI | MRI Scan)
title, fileUrl, fileSize, symptoms[], findings
status (Active | Completed)
```

---

## User Roles & Access

| Role | Pages & Permissions |
|---|---|
| Patient | Dashboard, Symptoms AI, Doctor List, Book Appointment, Appointments, Medical Records, Profile |
| Doctor | Dashboard, Appointments, Patients, Diagnoses, Prescription, Toggle Availability, Profile |
| Admin | Dashboard, Doctor Verification (Approve / Reject), Profile |

---

## Authentication Flow

1. User registers or logs in → backend returns `accessToken` (15 min) + `refreshToken` (7 days)
2. Tokens stored in `localStorage`
3. Every API request → `axiosInstance` attaches `Authorization: Bearer <accessToken>`
4. On `401` response → `axiosInstance` auto-calls `/auth/refresh` → retries original request
5. If refresh fails → clears localStorage → redirects to `/login`

### Password Reset Flow
1. User submits email on `/forgot-password`
2. Backend generates a `crypto` token, hashes it with SHA-256, saves to user with 15 min expiry
3. Raw token sent in reset link via email: `/reset-password?token=<raw>`
4. User submits new password on `/reset-password`
5. Backend hashes the token again, finds matching user, validates expiry, updates password

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register patient or doctor (doctor sends multipart/form-data with documents) |
| POST | `/login` | No | Login, returns tokens + user |
| POST | `/logout` | No | Invalidates refresh token |
| POST | `/refresh` | No | Get new access + refresh tokens |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password` | No | Reset password using token |

### AI — `/api/ai`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/diagnose` | Yes | Symptom-based AI diagnosis via Gemini |
| POST | `/scan-analysis` | Yes | Medical scan image analysis via Gemini Vision |

### Patient — `/api/patient`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/dashboard` | Yes | patient | Dashboard stats |
| GET | `/doctors` | Yes | any | List all verified doctors |
| GET | `/doctors/:id` | Yes | any | Single doctor profile |
| GET | `/appointments` | Yes | patient | Patient's appointments |
| GET | `/medical-records` | Yes | patient | Medical records |
| GET | `/prescriptions` | Yes | patient | Prescriptions from doctors |
| POST | `/symptoms` | Yes | patient | Submit symptoms (fallback rule-based) |

### Doctor — `/api/doctor`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/dashboard` | Yes | doctor | Dashboard stats |
| GET | `/appointments` | Yes | doctor | Doctor's appointments |
| GET | `/patients` | Yes | doctor | Doctor's patient list |
| PUT | `/diagnosis` | Yes | doctor | Save diagnosis for appointment |
| PUT | `/toggle-availability` | Yes | doctor | Toggle available/unavailable |
| GET | `/patient-records/:patientId` | Yes | doctor | View a patient's medical records |
| POST | `/prescription` | Yes | doctor | Write prescription (saved as MedicalRecord) |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/dashboard` | Yes | admin | Platform stats |
| GET | `/doctors` | Yes | admin | All doctors (filter by status) |
| PUT | `/doctors/:id` | Yes | admin | Approve or reject a doctor |

### Appointments — `/api/appointments`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create` | Yes | Book new appointment |
| GET | `/booked-slots` | Yes | Get booked time slots for a doctor on a date |
| PUT | `/update/:id` | Yes | Update appointment |
| PUT | `/reschedule/:id` | Yes | Reschedule (new date + timeSlot, sends email) |
| DELETE | `/cancel/:id` | Yes | Cancel appointment |

### Diagnosis — `/api/diagnosis`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/predict` | Yes | patient | AI diagnosis predict + save to history |
| GET | `/history` | Yes | patient | Past diagnosis records |

### Upload — `/api/upload`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/scan` | Yes | Upload medical scan (image/pdf, max 10MB) |
| POST | `/photo` | Yes | Upload profile photo (image only, max 2MB) |

### User — `/api/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Yes | Get logged-in user profile |
| PUT | `/update` | Yes | Update profile fields |
| PUT | `/change-password` | Yes | Change password |
| POST | `/upload-photo` | Yes | Upload profile photo (memory storage, max 2MB) |

---

## Frontend Services (`src/services/api/`)

### `axiosInstance.js` — Core HTTP Client
- Sets `baseURL` from `VITE_API_BASE_URL`
- Request interceptor: auto-attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on `401` → silently refreshes token → retries request → on failure clears auth and redirects to `/login`

### `authService.js`
- `login(credentials)` — POST `/auth/login`
- `register(userData, files)` — POST `/auth/register` (FormData for doctors, JSON for patients)
- `logout(refreshToken)` — POST `/auth/logout`
- `refresh(refreshToken)` — POST `/auth/refresh`

### `appointmentService.js`
- `getPatientAppointments()`, `getDoctorAppointments()`
- `create({doctorId, date, timeSlot, reason, symptoms, type})`
- `update(id, fields)`, `cancel(id)`, `reschedule(id, date, timeSlot)`
- `getBookedSlots(doctorId, date)` — returns array of booked time strings

### `adminService.js`
- `getDashboard()`, `getDoctors(status)`, `updateDoctorStatus(id, status)`

### `doctorService.js`
- `getDashboard()`, `getPatients()`, `saveDiagnosis(payload)`, `toggleAvailability()`

### `patientService.js`
- `getDashboard()`, `getMedicalRecords()`, `getPrescriptions()`
- `uploadScan(file, type, symptoms)` — multipart/form-data

### `userService.js`
- `getProfile()`, `updateProfile(fields)`, `changePassword(current, new)`, `uploadPhoto(file)`

### `diagnosisService.js`
- `predict({symptoms, severity, duration})` — calls Gemini AI
- `getHistory()` — past diagnosis records

---

## Gemini AI Integration

### Model Fallback Chain
The backend tries models in order, moving to the next on `429 (rate limit)`:
```
gemini-2.0-flash-lite → gemini-2.0-flash → gemini-2.5-flash-lite → gemini-2.5-flash
```
Configurable via `GEMINI_MODELS` env variable.

### Symptom Diagnosis (`/api/ai/diagnose`)
Input: `symptoms[]`, `severity`, `duration`

Returns:
```json
{
  "condition": "most likely condition",
  "specialist": "type of specialist",
  "urgency": "low | medium | high | emergency",
  "recommendations": ["..."],
  "home_therapy": ["safe remedy 1", "safe remedy 2", "safe remedy 3"],
  "home_therapy_mr": ["घरगुती उपाय १", "घरगुती उपाय २", "घरगुती उपाय ३"]
}
```

### Scan Analysis (`/api/ai/scan-analysis`)
Input: image file (JPG/PNG/WebP), `scanType`, `symptoms[]`

- First validates image is a real medical scan via Gemini Vision
- Supports: X-Ray, MRI, CT Scan, Ultrasound

Returns:
```json
{
  "finding": "...",
  "predicted_symptoms_en": "...",
  "predicted_symptoms_mr": "...",
  "possible_conditions": ["..."],
  "severity": "normal | mild | moderate | severe",
  "affected_area": "...",
  "recommendation": "...",
  "home_therapy": ["..."],
  "home_therapy_mr": ["..."]
}
```

---

## Email Service

Uses Gmail SMTP via Nodemailer. Configured with `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password).

### Password Reset Email
- Sends a styled HTML email with a reset button
- Link format: `{FRONTEND_URL}/reset-password?token=<rawToken>`
- Token expires in 15 minutes
- Token is SHA-256 hashed before storing in DB

### Appointment Email (Reschedule)
- Sent to patient on reschedule with new date, time, doctor name

---

## Middleware

### `authMiddleware.js` — `protect`
- Reads `Authorization: Bearer <token>` header
- Verifies JWT with `JWT_SECRET`
- Attaches full user object to `req.user` (excluding password and refreshToken)
- Returns `401` if token missing, invalid, or user not found

### `roleMiddleware.js` — `authorizeRoles(...roles)`
- Checks `req.user.role` against allowed roles
- Returns `403` if role not permitted

---

## File Upload

### Doctor Registration Documents (Multer disk storage)
- Fields: `profilePhoto`, `degreeCertificate`, `idProof`, `selfieWithId`
- Stored in `/uploads/` with pattern: `{fieldname}_{userId}_{timestamp}.{ext}`
- Allowed: JPG, PNG, PDF — max 10MB

### Profile Photo (Memory storage)
- Stored in memory buffer, max 2MB
- Images only

### Medical Scan Upload
- Stored in `/uploads/`, max 10MB
- JPG, PNG, PDF allowed
- File read as base64 and sent to Gemini Vision API

---

## Frontend Routing

| Path | Component | Auth | Role |
|---|---|---|---|
| `/login` | Login | No | — |
| `/register` | Register | No | — |
| `/forgot-password` | ForgotPasswordPage | No | — |
| `/reset-password` | ResetPasswordPage | No | — |
| `/patient/dashboard` | PatientDashboard | Yes | patient |
| `/patient/doctors` | DoctorListPage | Yes | patient |
| `/patient/doctor/:id` | DoctorProfilePage | Yes | patient |
| `/patient/book-appointment/:doctorId` | BookAppointmentPage | Yes | patient |
| `/patient/symptoms` | SymptomsPage | Yes | patient |
| `/patient/appointments` | AppointmentsPage | Yes | patient |
| `/patient/records` | MedicalRecordsPage | Yes | patient |
| `/doctor/dashboard` | DoctorDashboard | Yes | doctor |
| `/doctor/appointments` | DoctorAppointmentsPage | Yes | doctor |
| `/doctor/patients` | DoctorPatientsPage | Yes | doctor |
| `/doctor/diagnoses` | DoctorDiagnosesPage | Yes | doctor |
| `/admin/dashboard` | AdminDashboard | Yes | admin |
| `/profile` | ProfilePage | Yes | any |
| `/unauthorized` | 403 page | No | — |
| `*` | 404 page | No | — |

---

## Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_key
```

### Backend (`.env`)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development

GEMINI_API_KEY=your_gemini_key
GEMINI_MODELS=gemini-2.0-flash-lite,gemini-2.0-flash,gemini-2.5-flash-lite,gemini-2.5-flash

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_16_char_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

---

## How to Run

### Backend
```bash
cd Smart-healthcare-backend
npm install
npm run dev        # development (nodemon)
npm start          # production
```

### Frontend
```bash
cd smart-healthcare
npm install
npm run dev
```

### Create Admin User
```bash
cd Smart-healthcare-backend
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteOne({ email: 'admin@healthcare.com' });
  const admin = new User({ name: 'Admin', email: 'admin@healthcare.com', password: 'admin@123', role: 'admin', phone: '9999999999' });
  await admin.save();
  console.log('Admin created!');
  process.exit(0);
});
"
```

---

## Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@healthcare.com | admin@123 |
| Patient | Register yourself | Your password |
| Doctor | Register yourself | Your password |

---

## Security

- JWT access token (15 min) + refresh token (7 days)
- Passwords hashed with bcryptjs (salt rounds: 10)
- Password reset token hashed with SHA-256 before DB storage
- Role-based route protection on both frontend (ProtectedRoute) and backend (authorizeRoles)
- File upload: type + size validation on every upload endpoint
- CORS restricted to `localhost:5173` and production Vercel URL

---

## Validation Rules

| Field | Rule |
|---|---|
| Name | Min 2 characters |
| Email | Valid email format |
| Phone | Exactly 10 digits, no letters |
| Password | Min 8 characters |
| Confirm Password | Must match password |

---

## Key Features Summary

| Feature | Details |
|---|---|
| AI Symptom Diagnosis | Gemini AI → condition, specialist, urgency, home remedies (EN + Marathi) |
| AI Scan Analysis | Gemini Vision → findings, severity, affected area, home remedies (EN + Marathi) |
| Medical Image Validation | Gemini validates upload is a real medical scan before analysis |
| Gemini Model Fallback | Auto-switches models on rate limit (4 model chain) |
| Appointment Booking | Date + time slot, duplicate slot blocking, In-person / Video type |
| Appointment Reschedule | New date/time with conflict check + email notification |
| Doctor Verification | Admin approves/rejects doctor with uploaded documents |
| Password Reset | Email link with 15 min expiry, SHA-256 hashed token |
| Profile Management | Photo upload, edit info, change password, doctor fee |
| Prescriptions | Doctor writes prescription → saved as MedicalRecord for patient |
| Marathi Language | Full EN/MR toggle across AI results |
| Emergency SOS | Floating button → quick call to 108 / 112 / Hospital |
| Token Auto-Refresh | Silent refresh on 401, retry original request |
| PDF Export | Medical records exportable as PDF |

---

## College Presentation Flow

1. Register as Patient → Login → redirected to Patient Dashboard
2. Symptoms Page → select symptoms + severity + duration → Gemini AI diagnosis → condition + specialist + home remedies
3. Doctor List → browse verified doctors → view profile → Book Appointment → select date + time (booked slots grayed out)
4. Register as Doctor (with documents) → Admin Dashboard → Verify doctor → doctor now visible to patients
5. Doctor Dashboard → toggle availability → manage appointments → write prescriptions
6. Patient Dashboard → upload X-Ray/MRI → AI Scan Analysis → findings + severity
7. Forgot Password → email reset link → set new password
8. Profile → update photo, info, fee, change password
