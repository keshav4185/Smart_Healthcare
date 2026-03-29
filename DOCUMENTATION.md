# Smart Healthcare Diagnosis & Appointment System

## Project Overview
A full-stack Smart Healthcare web application built for college presentation.
Patients can check symptoms using AI, upload scans for AI analysis, book appointments with verified doctors, and manage medical records.

---

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI API (gemini-2.0-flash)
- Multer (file uploads)
- Bcryptjs

---

## Project Structure

```
Smart healthcare/
├── smart-healthcare/          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Button, Card, Input, EmergencySOS
│   │   │   └── layout/        # MainLayout, Navbar, Sidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── AppointmentContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── patient/       # Dashboard, Symptoms, Appointments, DoctorList, BookAppointment, MedicalRecords
│   │   │   ├── doctor/        # Dashboard, Appointments, Patients
│   │   │   ├── admin/         # AdminDashboard
│   │   │   └── ProfilePage.jsx
│   │   ├── services/api/      # axiosInstance, authService, appointmentService, doctorService, patientService, userService, adminService
│   │   └── utils/             # validation.js, helpers.js, aiAnalysis.js, pdfGenerator.js
│   └── .env
│
└── Smart-healthcare-backend/  # Backend (Node.js)
    ├── src/
    │   ├── config/            # db.js
    │   ├── controllers/       # auth, ai, user, patient, doctor, admin, appointment
    │   ├── middleware/        # authMiddleware, roleMiddleware
    │   ├── models/            # User, Appointment, MedicalRecord, Diagnosis
    │   ├── routes/            # auth, ai, user, patient, doctor, admin, appointments
    │   ├── services/          # authService, geminiService, doctorService, patientService, userService, adminService, appointmentService
    │   └── utils/             # generateToken, response
    └── .env
```

---

## User Roles

| Role | Access |
|------|--------|
| Patient | Symptoms AI, Book Appointments, Medical Records, Scan Upload |
| Doctor | Manage Appointments, View Patients, Availability Toggle |
| Admin | Verify/Reject Doctors |

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthcare.com | admin@123 |
| Patient | Register yourself | Your password |
| Doctor | Register yourself | Your password |

---

## Key Features

### AI Features
- **Symptom Diagnosis** — Select symptoms → Gemini AI → Condition + Specialist recommendation
- **Scan Analysis** — Upload X-Ray/CT/MRI image → Gemini Vision AI → Finding + Severity + Recommendation
- **Marathi Support** — Full English/Marathi language toggle

### Appointment System
- Book appointment with verified doctors
- Date + Time slot selection
- Duplicate slot blocking (same doctor, same date, same time → blocked)
- Doctor availability toggle (Doctor can set Available/Unavailable)
- Cancel appointment

### Doctor Verification
- Doctor registers with license number
- Admin reviews and Verify/Reject
- Only verified doctors visible to patients

### Profile
- Profile photo upload
- Edit personal/professional info
- Change password
- Doctor fee management

### Emergency SOS
- Floating red button
- Quick call to 108/112/Hospital

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh token |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/diagnose | Symptom diagnosis via Gemini |
| POST | /api/ai/scan-analysis | Scan image analysis via Gemini Vision |

### Patient
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patient/dashboard | Patient dashboard data |
| GET | /api/patient/doctors | List verified doctors |
| GET | /api/patient/appointments | Patient appointments |
| GET | /api/patient/medical-records | Medical records |

### Doctor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctor/dashboard | Doctor dashboard |
| GET | /api/doctor/appointments | Doctor appointments |
| GET | /api/doctor/patients | Doctor patients |
| PUT | /api/doctor/toggle-availability | Toggle availability |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Admin stats |
| GET | /api/admin/doctors | All doctors |
| PUT | /api/admin/doctors/:id | Verify/Reject doctor |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/appointments/create | Book appointment |
| GET | /api/appointments/booked-slots | Get booked slots for date |
| PUT | /api/appointments/update/:id | Update appointment |
| DELETE | /api/appointments/cancel/:id | Cancel appointment |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/user/profile | Get profile |
| PUT | /api/user/update | Update profile |
| PUT | /api/user/change-password | Change password |
| POST | /api/user/upload-photo | Upload profile photo |

---

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_key
```

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key
NODE_ENV=development
```

---

## How to Run

### Backend
```bash
cd Smart-healthcare-backend
npm install
npm start
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

## Validation Rules
- Name: min 2 characters
- Email: valid format
- Phone: exactly 10 digits, no letters
- Password: min 8 characters
- Confirm Password: must match password

---

## Security
- JWT access token (15 min) + refresh token (7 days)
- Passwords hashed with bcryptjs (salt 10)
- Role-based route protection
- File upload: images only, max 2MB

---

## College Presentation Flow
1. Register as Patient → Login
2. Symptoms Page → Select symptoms → Get AI Diagnosis → Find Specialist
3. Doctor List → Book Appointment → Select Date/Time (booked slots grayed)
4. Register as Doctor → Admin verifies → Doctor appears in list
5. Doctor Dashboard → Toggle Availability
6. Patient Dashboard → Upload X-Ray → AI Scan Analysis
7. Profile → Update photo, fee, password
