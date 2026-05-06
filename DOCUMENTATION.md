# Smart Healthcare Diagnosis & Appointment System

## Project Overview

A full-stack Smart Healthcare web application built with React + Node.js.
Patients can check symptoms using AI, upload medical scans for AI analysis, book appointments with verified doctors, manage medical records, and reset their password via email.
Doctors manage appointments, patients, and prescriptions. Admins verify doctor registrations.

---

## Tech Stack

#Doctor verification
National Medical Commission (NMC) registry. You can verify doctor license numbers against it.

Option 1: NMC Registry (Free - Manual)
Go to: https://www.nmc.org.in/information-desk/indian-medical-register/

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
| Cloudinary | 2.10.0 | Cloud file storage (upgraded) |
| PDFKit | 0.18.0 | PDF generation |
| Nodemon | 3.1.3 | Dev auto-restart |
| Helmet | latest | HTTP security headers |
| express-rate-limit | latest | Auth route rate limiting |
| express-validator | latest | Input validation |
| express-mongo-sanitize | latest | NoSQL injection prevention |

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
- Attaches user object to `req.user` (excluding password, refreshToken, resetPasswordToken, resetPasswordExpires)
- Returns `401` with specific message: `Token expired` or `Token invalid`
- Returns `401` if token missing or user not found

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
- `helmet` — sets HTTP security headers on every response
- `express-mongo-sanitize` — strips `$` and `.` from request body to prevent NoSQL injection
- Rate limiting on `/login`, `/register`, `/forgot-password` — max 10 requests per 15 min
- Input validation via `express-validator` on all auth routes
- Email enumeration fix — forgot password always returns same message regardless of email existence
- `authMiddleware` strips `resetPasswordToken` and `resetPasswordExpires` from `req.user`
- JWT env variable guard — server throws clear error if `JWT_SECRET` is missing
- Global error handler — all unhandled errors return clean JSON, never crash the server

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
| Rate Limiting | Auth routes protected against brute force (10 req / 15 min) |
| Input Validation | All auth routes validated via express-validator |
| NoSQL Injection Prevention | express-mongo-sanitize strips malicious operators |
| HTTP Security Headers | helmet sets 11 security headers on every response |
| Pagination | All list APIs support ?page=&limit= |
| MongoDB Indexes | All 4 collections indexed for fast queries |

---

## Pagination

All heavy list APIs support `?page=&limit=` query parameters.

| Endpoint | Default Limit | Returns |
|---|---|---|
| `GET /api/admin/doctors` | 10 | `{ doctors, total, page, pages }` |
| `GET /api/doctor/patients` | 10 | `{ patients, total, page, pages }` |
| `GET /api/diagnosis/history` | 10 | `{ diagnoses, total, page, pages }` |

---

## MongoDB Indexes

Indexes added to all 4 collections for faster query performance.

| Collection | Index |
|---|---|
| users | `email`, `role + status` |
| appointments | `patientId`, `doctorId`, `doctorId + date + status` |
| diagnoses | `patientId + createdAt` |
| medicalrecords | `patientId`, `doctorId` |

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

---

## Database Schema Tables

This project uses **4 MongoDB collections**. The tables below incorporate all fields with their data types and descriptions.

---

### Table 1: User (Collection: `users`)

This table stores all users — patients, doctors, and admins — in a single collection with role-based fields.

| Sr.No | Attribute | Data Type | Description |
|---|---|---|---|
| 1 | _id | ObjectId | Primary Key; auto-generated MongoDB document ID. |
| 2 | name | String(trim) | Full name of the user. Required. |
| 3 | email | String(lowercase) | Unique email address used for login. Required. |
| 4 | password | String(min:6) | Bcrypt-hashed password. Required. |
| 5 | role | String(enum) | User role: `patient`, `doctor`, or `admin`. Default: `patient`. |
| 6 | phone | String | Mobile number of the user. |
| 7 | address | String | Residential address of the user. |
| 8 | profilePhoto | String | URL/path to profile photo. Default: `''`. |
| 9 | dob | Date | Date of birth. (Patient field) |
| 10 | bloodGroup | String | Blood group (e.g., A+, O-). (Patient field) |
| 11 | age | Number | Age of the patient. (Patient field) |
| 12 | gender | String(enum) | Gender: `Male`, `Female`, or `Other`. (Patient field) |
| 13 | specialty | String | Medical specialty (e.g., Cardiologist). (Doctor field) |
| 14 | licenseNumber | String | Medical license number. (Doctor field) |
| 15 | hospital | String | Hospital or clinic name. (Doctor field) |
| 16 | experience | Number | Years of experience. (Doctor field) |
| 17 | education | String | Educational qualifications. (Doctor field) |
| 18 | certificate | String | Certificate details. (Doctor field) |
| 19 | documents.degreeCertificate | String | URL/path to degree certificate file. (Doctor field) |
| 20 | documents.idProof | String | URL/path to ID proof file. (Doctor field) |
| 21 | documents.selfieWithId | String | URL/path to selfie with ID file. (Doctor field) |
| 22 | verificationStatus | String(enum) | Admin verification: `pending`, `approved`, `rejected`. Default: `pending`. (Doctor field) |
| 23 | isVerified | Boolean | Whether doctor is verified. Default: `false`. (Doctor field) |
| 24 | status | String(enum) | Doctor status: `pending`, `verified`, `rejected`. Default: `pending`. (Doctor field) |
| 25 | rating | Number | Doctor rating score. Default: `0`. (Doctor field) |
| 26 | fee | Number | Consultation fee amount. (Doctor field) |
| 27 | available | Boolean | Doctor availability toggle. Default: `true`. (Doctor field) |
| 28 | refreshToken | String | JWT refresh token for session management. (Auth field) |
| 29 | resetPasswordToken | String | SHA-256 hashed token for password reset. (Auth field) |
| 30 | resetPasswordExpires | Date | Expiry datetime for password reset token (15 min). (Auth field) |
| 31 | createdAt | DateTime | Account creation timestamp. Auto-generated by Mongoose. |
| 32 | updatedAt | DateTime | Last update timestamp. Auto-generated by Mongoose. |

---

### Table 2: Appointment (Collection: `appointments`)

This table stores all appointment bookings between patients and doctors.

| Sr.No | Attribute | Data Type | Description |
|---|---|---|---|
| 1 | _id | ObjectId | Primary Key; auto-generated MongoDB document ID. |
| 2 | patientId | ObjectId (FK → User) | Reference to the patient who booked the appointment. Required. |
| 3 | doctorId | ObjectId (FK → User) | Reference to the doctor for the appointment. Required. |
| 4 | date | Date | Appointment date. Required. |
| 5 | timeSlot | String | Selected time slot (e.g., `10:00 AM`). Required. |
| 6 | reason | String | Reason for the appointment. |
| 7 | symptoms | Array[String] | List of symptoms reported by the patient. |
| 8 | status | String(enum) | Appointment status: `pending`, `confirmed`, `completed`, `cancelled`. Default: `pending`. |
| 9 | fee | Number | Consultation fee for the appointment. |
| 10 | type | String(enum) | Appointment type: `In-person` or `Video`. Default: `In-person`. |
| 11 | createdAt | DateTime | Booking creation timestamp. Auto-generated by Mongoose. |
| 12 | updatedAt | DateTime | Last update timestamp. Auto-generated by Mongoose. |

---

### Table 3: Diagnosis (Collection: `diagnoses`)

This table stores AI-generated diagnosis records for patients based on submitted symptoms.

| Sr.No | Attribute | Data Type | Description |
|---|---|---|---|
| 1 | _id | ObjectId | Primary Key; auto-generated MongoDB document ID. |
| 2 | patientId | ObjectId (FK → User) | Reference to the patient who received the diagnosis. Required. |
| 3 | symptoms | Array[String] | List of symptoms submitted by the patient. |
| 4 | severity | String | Severity level reported (e.g., mild, moderate, severe). |
| 5 | duration | String | Duration of symptoms (e.g., `2 days`, `1 week`). |
| 6 | condition | String | AI-predicted medical condition. |
| 7 | specialist | String | Recommended type of specialist (e.g., Cardiologist). |
| 8 | urgency | String | Urgency level: `low`, `medium`, `high`, or `emergency`. |
| 9 | recommendations | String | AI-generated recommendations for the patient. |
| 10 | createdAt | DateTime | Diagnosis creation timestamp. Auto-generated by Mongoose. |
| 11 | updatedAt | DateTime | Last update timestamp. Auto-generated by Mongoose. |

---

### Table 4: MedicalRecord (Collection: `medicalrecords`)

This table stores all medical records including lab reports, prescriptions, and scan uploads for patients.

| Sr.No | Attribute | Data Type | Description |
|---|---|---|---|
| 1 | _id | ObjectId | Primary Key; auto-generated MongoDB document ID. |
| 2 | patientId | ObjectId (FK → User) | Reference to the patient who owns the record. Required. |
| 3 | doctorId | ObjectId (FK → User) | Reference to the doctor who created the record (optional). |
| 4 | type | String(enum) | Record type: `Lab Report`, `Prescription`, `X-Ray`, `CT Scan`, `MRI`, `MRI Scan`. Required. |
| 5 | title | String | Title or name of the medical record. Required. |
| 6 | fileUrl | String | URL/path to the uploaded file (image or PDF). |
| 7 | fileSize | String | Size of the uploaded file (e.g., `2.4 MB`). |
| 8 | symptoms | Array[String] | Symptoms associated with this record. |
| 9 | findings | String | Medical findings or notes from the doctor or AI scan analysis. |
| 10 | status | String(enum) | Record status: `Active` or `Completed`. Default: `Active`. |
| 11 | createdAt | DateTime | Record creation timestamp. Auto-generated by Mongoose. |
| 12 | updatedAt | DateTime | Last update timestamp. Auto-generated by Mongoose. |

---

### Table Summary

| Sr.No | Collection Name | Model File | Total Fields | Purpose |
|---|---|---|---|---|
| 1 | users | User.js | 32 | Stores patients, doctors, and admins with role-based fields |
| 2 | appointments | Appointment.js | 12 | Tracks all appointment bookings between patients and doctors |
| 3 | diagnoses | Diagnosis.js | 11 | Stores AI-generated symptom diagnosis history per patient |
| 4 | medicalrecords | MedicalRecord.js | 12 | Stores lab reports, prescriptions, and scan uploads per patient |

---

## Changelog

---

### Session 1 — Database Schema Documentation
- Added full **Database Schema Tables** section to documentation
- Documented all 4 MongoDB collections with Sr.No, Attribute, Data Type, Description for every field
- Added Table Summary with collection names, model files, field counts, and purpose

---

### Session 2 — Security Fixes

**Backend**
| File | Change |
|---|---|
| `app.js` | Added `express-rate-limit` — `/login`, `/register`, `/forgot-password` limited to 10 req / 15 min |
| `app.js` | Added global error handler — all unhandled errors return clean JSON, server never crashes |
| `routes/auth.js` | Added `express-validator` input validation on all 6 auth routes |
| `services/authService.js` | Fixed email enumeration — forgot password always returns same message |

**Frontend**
| File | Change |
|---|---|
| `components/common/ErrorBoundary.jsx` | Created React Error Boundary — prevents full UI crash on component error |
| `main.jsx` | Wrapped `<App />` with `<ErrorBoundary>` |

---

### Session 3 — Performance & Bug Fixes

**Backend — Pagination**
| File | Change |
|---|---|
| `services/adminService.js` | `getAllDoctors` supports `page` + `limit`, returns `{ doctors, total, page, pages }` |
| `services/doctorService.js` | `getDoctorPatients` supports `page` + `limit`, returns `{ patients, total, page, pages }` |
| `services/diagnosisService.js` | `fetchDiagnosisHistory` supports `page` + `limit`, returns `{ diagnoses, total, page, pages }` |
| `controllers/adminController.js` | Reads `?page=&limit=` from query |
| `controllers/doctorController.js` | Reads `?page=&limit=` from query |
| `controllers/diagnosisController.js` | Reads `?page=&limit=` from query |

**Backend — MongoDB Indexes**
| File | Index Added |
|---|---|
| `models/User.js` | `email`, `role + status` |
| `models/Appointment.js` | `patientId`, `doctorId`, `doctorId + date + status` |
| `models/Diagnosis.js` | `patientId + createdAt` |
| `models/MedicalRecord.js` | `patientId`, `doctorId` |

**Frontend — Performance**
| File | Change |
|---|---|
| `context/AuthContext.jsx` | Added `useMemo` to provider value with full dependency array |
| `context/AppointmentContext.jsx` | Added `useMemo` to provider value with full dependency array |

**Frontend — Bug Fixes**
| File | Change |
|---|---|
| `App.jsx` | Connected `DoctorDiagnosesPage` to `/doctor/diagnoses` route (was "Coming soon...") |
| `utils/secureStorage.js` | Cleared deprecated file — tokens managed via AuthContext |

---

### Session 4 — Full Security Hardening

**Packages Installed**
| Package | Purpose |
|---|---|
| `helmet` | Sets 11 HTTP security headers on every response |
| `express-mongo-sanitize` | Strips `$` and `.` operators from req.body — prevents NoSQL injection |
| `cloudinary` upgraded to `2.10.0` | Fixed high severity vulnerability (arbitrary argument injection) |
| `multer-storage-cloudinary` upgraded to `2.2.1` | Fixed dependency vulnerability |
| Result: **0 vulnerabilities** | `npm audit` clean |

**Backend**
| File | Change |
|---|---|
| `app.js` | Added `helmet()` and `mongoSanitize()` middleware |
| `app.js` | Added `express.json({ limit: '10mb' })` to prevent large payload attacks |
| `app.js` | Added fallback port `5000`, added `.catch` with `process.exit(1)` on server start failure |
| `config/db.js` | Added `process.exit(1)` on DB connection failure — server won't silently run without DB |
| `config/db.js` | Suppressed `console.log` in production |
| `middleware/authMiddleware.js` | Strips `resetPasswordToken` + `resetPasswordExpires` from `req.user` |
| `middleware/authMiddleware.js` | Added specific error messages: `Token expired` vs `Token invalid` |
| `middleware/authMiddleware.js` | Added null token check after Bearer split |
| `utils/generateToken.js` | Added guard — throws clear error if `JWT_SECRET` env vars are missing |
| `utils/generateToken.js` | Added fallback defaults `15m` / `7d` if env vars not set |
| `utils/emailService.js` | Suppressed `console.log` in production |
| `utils/emailService.js` | Added null check on transporter before sending appointment email |
| `services/geminiService.js` | Suppressed `console.log/warn` in production |
| `services/geminiService.js` | Fixed `lastErr` reuse instead of creating new error object |
| `services/userService.js` | Fixed `req.body` mutation — now uses sanitized copy before update |
| `controllers/aiController.js` | Removed all `console.error` calls |
| `controllers/aiController.js` | Added `Array.isArray` check for symptoms input |
| `controllers/aiController.js` | Wrapped `JSON.parse(symptoms)` in try/catch |
| `controllers/userController.js` | Fixed profile photo — saves file to disk, stores URL instead of base64 in MongoDB |
| `services/appointmentService.js` | Moved reschedule inline route logic into proper `rescheduleAppointment` service function |
| `controllers/appointmentController.js` | Added `rescheduleAppointment` controller handler |
| `routes/appointments.js` | Removed all inline logic — now uses controller cleanly |

**Frontend**
| File | Change |
|---|---|
| `pages/patient/AppointmentsPage.jsx` | Added `try/catch` to `openReschedule` and `handleDateChange` |
| `pages/patient/PatientDashboard.jsx` | Removed unused `_user` variable |
| `context/AuthContext.jsx` | Fixed `useMemo` dependency array — includes all functions |
| `context/AppointmentContext.jsx` | Fixed `useMemo` dependency array — includes all functions |
