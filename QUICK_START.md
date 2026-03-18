# 🚀 Quick Start Guide - Smart Healthcare System

## ✅ What's Been Configured

### 1. Tailwind CSS Setup
- ✅ Installed: `tailwindcss`, `postcss`, `autoprefixer`
- ✅ Configuration: `tailwind.config.js` with custom healthcare theme
- ✅ PostCSS: `postcss.config.js` configured
- ✅ Styles: `src/index.css` with Tailwind directives and custom utilities

### 2. Dependencies Installed
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

### 3. Complete Folder Structure Created

```
src/
├── assets/
│   ├── icons/          # Icon files
│   └── images/         # Image files
│
├── components/
│   ├── common/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Loading.jsx
│   ├── features/       # Feature-specific components (empty - ready for expansion)
│   └── layout/         # Layout components
│       ├── MainLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── pages/
│   ├── auth/           # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── patient/        # Patient portal
│   │   ├── PatientDashboard.jsx
│   │   ├── SymptomsPage.jsx
│   │   └── AppointmentsPage.jsx
│   ├── doctor/         # Doctor portal
│   │   └── DoctorDashboard.jsx
│   └── admin/          # Admin portal
│       └── AdminDashboard.jsx
│
├── services/
│   └── api/            # API service layer
│       ├── axiosInstance.js      # Configured Axios with interceptors
│       ├── authService.js        # Authentication APIs
│       ├── appointmentService.js # Appointment APIs
│       └── diagnosisService.js   # Diagnosis APIs
│
├── context/
│   └── AuthContext.jsx # Global authentication state
│
├── hooks/
│   └── useApi.js       # Custom hook for API calls
│
├── routes/
│   ├── index.jsx       # Main router configuration
│   └── ProtectedRoute.jsx # Route guard component
│
├── utils/
│   ├── helpers.js      # Utility functions (date, validation)
│   └── errorHandler.js # Error handling utilities
│
├── constants/
│   ├── apiEndpoints.js # API endpoint constants
│   └── roles.js        # User roles and status constants
│
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## 🎯 Key Features Implemented

### 1. Layout System
- **Sidebar**: Role-based navigation menu with icons
- **Navbar**: User profile display with logout
- **MainLayout**: Wrapper combining Sidebar + Navbar

### 2. Authentication System
- Login page with form validation
- Register page with role selection
- AuthContext for global state
- JWT token management with auto-refresh

### 3. Protected Routes
- Role-based access control (RBAC)
- Automatic redirect for unauthorized users
- Support for Patient, Doctor, Admin roles

### 4. API Service Layer
- Axios instance with interceptors
- Automatic token injection
- Token refresh on 401 errors
- Centralized error handling

### 5. Reusable Components
- **Button**: Multiple variants (primary, secondary, danger, success, outline)
- **Input**: With label, validation, and error display
- **Card**: Container with optional title and header actions
- **Loading**: Spinner with fullscreen option

### 6. Pages Created
- ✅ Login
- ✅ Register
- ✅ Patient Dashboard
- ✅ Doctor Dashboard
- ✅ Admin Dashboard
- ✅ Symptoms Page (AI diagnosis)
- ✅ Appointments Page (booking & management)

## 🏃 How to Run

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access the Application
Open browser: `http://localhost:5173`

### 3. Test Routes
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

## 🔐 User Roles

### Patient (role: 'patient')
- Dashboard: `/patient/dashboard`
- Symptoms Checker: `/patient/symptoms`
- Appointments: `/patient/appointments`
- Medical Records: `/patient/records`

### Doctor (role: 'doctor')
- Dashboard: `/doctor/dashboard`
- Appointments: `/doctor/appointments`
- Patients: `/doctor/patients`
- Diagnoses: `/doctor/diagnoses`

### Admin (role: 'admin')
- Dashboard: `/admin/dashboard`
- Users: `/admin/users`
- Doctors: `/admin/doctors`
- Patients: `/admin/patients`
- Appointments: `/admin/appointments`

## 🎨 Tailwind Custom Classes

### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

### Cards
```jsx
<div className="card">Card Content</div>
```

### Inputs
```jsx
<input className="input-field" />
```

## 📝 Usage Examples

### 1. Using AuthContext
```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication methods
}
```

### 2. Making API Calls
```jsx
import { useApi } from './hooks/useApi';
import { authService } from './services/api/authService';

function MyComponent() {
  const { loading, error, execute } = useApi();
  
  const handleLogin = async () => {
    const result = await execute(authService.login, credentials);
    if (result.success) {
      // Handle success
    }
  };
}
```

### 3. Creating Protected Routes
```jsx
<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
  <PatientDashboard />
</ProtectedRoute>
```

## 🔧 Configuration Files

### tailwind.config.js
- Custom color palette for healthcare theme
- Extended font families
- Custom shadows

### postcss.config.js
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### .env.example
- API base URL configuration
- Copy to `.env` for local development

## 📦 Next Steps

1. **Connect to Backend API**
   - Update `VITE_API_BASE_URL` in `.env`
   - Test authentication endpoints

2. **Add More Features**
   - Medical records page
   - Doctor patient management
   - Admin user management
   - Real-time notifications

3. **Enhance UI**
   - Add more reusable components
   - Implement toast notifications
   - Add loading skeletons
   - Improve mobile responsiveness

4. **Testing**
   - Add unit tests (Jest + React Testing Library)
   - Add E2E tests (Cypress/Playwright)

5. **Optimization**
   - Code splitting
   - Lazy loading routes
   - Image optimization
   - Performance monitoring

## 🐛 Troubleshooting

### Tailwind styles not working?
1. Check `tailwind.config.js` content paths
2. Ensure `index.css` has Tailwind directives
3. Restart dev server

### Routes not working?
1. Check if user is authenticated
2. Verify user role matches route requirements
3. Check browser console for errors

### API calls failing?
1. Verify backend is running
2. Check `.env` file configuration
3. Inspect network tab in browser DevTools

## 📚 Documentation

- Full documentation: `PROJECT_STRUCTURE.md`
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Axios: https://axios-http.com

---

**Built with ❤️ for Smart Healthcare System**
