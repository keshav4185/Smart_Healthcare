# 🔐 Demo Login Credentials

The application is running in **DEMO MODE** with mock authentication (no backend required).

## Test Accounts

### Patient Account
- **Email:** `patient@demo.com`
- **Password:** `patient123`
- **Access:** Patient Dashboard, Symptoms, Appointments, Medical Records

### Doctor Account
- **Email:** `doctor@demo.com`
- **Password:** `doctor123`
- **Access:** Doctor Dashboard, Appointments, Patients, Diagnoses

---

## Switching to Real Backend

To connect to a real backend API:

1. Open `src/context/AuthContext.jsx`
2. Change import from:
   ```js
   import { mockAuthService } from '../services/api/mockAuthService';
   ```
   To:
   ```js
   import { authService } from '../services/api/authService';
   ```
3. Replace all `mockAuthService` calls with `authService`
4. Set your API URL in `.env`:
   ```
   VITE_API_BASE_URL=http://your-backend-url/api
   ```

---

**Note:** Mock mode simulates API delays and responses for realistic testing without a backend.
