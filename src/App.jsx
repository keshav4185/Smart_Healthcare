import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppointmentProvider } from './context/AppointmentContext';
import router from './routes';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppointmentProvider>
          <RouterProvider router={router} />
        </AppointmentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
