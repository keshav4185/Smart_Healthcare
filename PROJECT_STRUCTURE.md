# Smart Healthcare Diagnosis and Appointment System

## 🏗️ Enterprise-Grade Architecture

This is a production-ready React application built with Vite, featuring a scalable, modular architecture for a healthcare management system.

## 🚀 Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Context API** - State Management

## 📁 Folder Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable components
│   ├── common/         # Generic UI components (Button, Input, Card, Loading)
│   ├── layout/         # Layout components (Sidebar, Navbar, MainLayout)
│   └── features/       # Feature-specific components
├── pages/              # Page components
│   ├── auth/          # Authentication pages (Login, Register)
│   ├── patient/       # Patient portal pages
│   ├── doctor/        # Doctor portal pages
│   └── admin/         # Admin portal pages
├── services/           # API services
│   └── api/           # API service layer (axios, auth, appointments, diagnosis)
├── context/            # React Context for global state (AuthContext)
├── hooks/              # Custom React hooks (useApi)
├── routes/             # Routing configuration (ProtectedRoute, router)
├── utils/              # Utility functions (helpers, errorHandler)
├── constants/          # Constants and configurations (apiEndpoints, roles)
├── App.jsx            # Main App component
├── main.jsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## 🎯 Key Features

### Architecture Patterns
- **Feature-based modular structure** - Organized by business domains
- **Separation of concerns** - Clear separation between UI, logic, and data
- **Service layer pattern** - Centralized API communication
- **Protected routes** - Role-based access control (RBAC)
- **Context API** - Global authentication state management

### Components
- **Layout System** - Sidebar + Navbar with responsive design
- **Reusable Components** - Button, Input, Card, Loading with variants
- **Role-based Navigation** - Dynamic menu based on user role

### Security
- **JWT Authentication** - Token-based auth with refresh mechanism
- **Protected Routes** - Route guards for authenticated users
- **Role-based Access** - Patient, Doctor, Admin role separation
- **Axios Interceptors** - Automatic token refresh and error handling

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 📋 Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Patient Routes (Role: patient)
- `/patient/dashboard` - Patient dashboard
- `/patient/symptoms` - AI symptom checker
- `/patient/appointments` - Manage appointments
- `/patient/records` - Medical records

### Doctor Routes (Role: doctor)
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - View appointments
- `/doctor/patients` - Patient management
- `/doctor/diagnoses` - Diagnosis management

### Admin Routes (Role: admin)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/doctors` - Doctor management
- `/admin/patients` - Patient management
- `/admin/appointments` - Appointment management

## 🔑 User Roles

- **PATIENT** - Can check symptoms, book appointments, view medical records
- **DOCTOR** - Can manage appointments, view patients, create diagnoses
- **ADMIN** - Full system access, user management, system configuration

## 📦 Key Files Explained

### Constants
- `apiEndpoints.js` - Centralized API endpoint definitions
- `roles.js` - User roles and status constants

### Services
- `axiosInstance.js` - Configured Axios with interceptors
- `authService.js` - Authentication API calls
- `appointmentService.js` - Appointment management API
- `diagnosisService.js` - Diagnosis and symptom API

### Context
- `AuthContext.jsx` - Global authentication state and methods

### Hooks
- `useApi.js` - Custom hook for API calls with loading/error states

### Utils
- `helpers.js` - Date formatting, validation utilities
- `errorHandler.js` - Centralized error handling

### Routes
- `ProtectedRoute.jsx` - Route guard component
- `index.jsx` - Main router configuration

## 🎨 Tailwind Configuration

Custom theme with healthcare-focused colors:
- **Primary** - Blue shades for main actions
- **Secondary** - Gray shades for secondary elements
- **Success** - Green for positive actions
- **Warning** - Orange for warnings
- **Danger** - Red for critical actions

Custom utility classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style
- `.input-field` - Input field style

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in localStorage
4. Axios interceptor adds token to all requests
5. On 401 error, automatically refresh token
6. On refresh failure, redirect to login

## 🚦 Error Handling

- API errors caught by Axios interceptors
- Centralized error handling in `errorHandler.js`
- User-friendly error messages
- Automatic retry on token expiration

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar (collapsible on mobile)
- Grid layouts adapt to screen size
- Touch-friendly UI elements

## 🔄 State Management

- **AuthContext** - User authentication state
- **Local State** - Component-level state with useState
- **API State** - Loading/error states via useApi hook

## 🧪 Development Guidelines

1. **Component Creation** - Use functional components with hooks
2. **Styling** - Use Tailwind utility classes
3. **API Calls** - Use service layer, never direct axios calls
4. **State** - Use Context for global state, useState for local
5. **Routing** - Always wrap protected routes with ProtectedRoute
6. **Error Handling** - Use try-catch and display user-friendly messages

## 📈 Scalability Features

- Modular architecture for easy feature addition
- Service layer for API abstraction
- Reusable component library
- Centralized configuration
- Role-based extensibility
- Environment-based configuration

## 🔮 Future Enhancements

- Redux/Zustand for complex state management
- React Query for server state caching
- WebSocket for real-time notifications
- PWA capabilities
- Unit and integration tests
- Storybook for component documentation
- i18n for internationalization

## 📞 Support

For issues or questions, refer to the project documentation or contact the development team.
