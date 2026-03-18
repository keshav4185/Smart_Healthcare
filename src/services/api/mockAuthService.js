export const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    email: 'doctor@demo.com',
    specialty: 'Cardiologist',
    experience: '10 years',
    licenseNumber: 'MH-12345',
    hospital: 'City Hospital, Mumbai',
    education: 'MBBS, MD - Cardiology',
    certificate: 'cardiology_cert.pdf',
    status: 'verified', // verified | pending | rejected
    rating: 4.8,
    fee: 800,
    available: true,
  },
  {
    id: 'd2',
    name: 'Dr. Rajesh Patil',
    email: 'rajesh@demo.com',
    specialty: 'Neurologist',
    experience: '8 years',
    licenseNumber: 'MH-67890',
    hospital: 'Apollo Hospital, Pune',
    education: 'MBBS, MD - Neurology',
    certificate: 'neurology_cert.pdf',
    status: 'verified',
    rating: 4.5,
    fee: 1000,
    available: true,
  },
  {
    id: 'd3',
    name: 'Dr. Priya Sharma',
    email: 'priya@demo.com',
    specialty: 'Pediatrician',
    experience: '5 years',
    licenseNumber: 'MH-11223',
    hospital: 'Sahyadri Hospital, Nashik',
    education: 'MBBS, MD - Pediatrics',
    certificate: 'pediatrics_cert.pdf',
    status: 'verified',
    rating: 4.7,
    fee: 600,
    available: true,
  },
  {
    id: 'd4',
    name: 'Dr. Amit Desai',
    email: 'amit@demo.com',
    specialty: 'Orthopedic',
    experience: '12 years',
    licenseNumber: 'MH-44556',
    hospital: 'Ruby Hall Clinic, Pune',
    education: 'MBBS, MS - Orthopedics',
    certificate: 'ortho_cert.pdf',
    status: 'verified',
    rating: 4.2,
    fee: 900,
    available: true,
  },
  {
    id: 'd5',
    name: 'Dr. Sneha Kulkarni',
    email: 'sneha@demo.com',
    specialty: 'Dermatologist',
    experience: '6 years',
    licenseNumber: 'MH-55667',
    hospital: 'Deenanath Mangeshkar Hospital, Pune',
    education: 'MBBS, MD - Dermatology',
    certificate: 'derma_cert.pdf',
    status: 'verified',
    rating: 4.6,
    fee: 700,
    available: true,
  },
  {
    id: 'd6',
    name: 'Dr. Vikram Joshi',
    email: 'vikram@demo.com',
    specialty: 'General Physician',
    experience: '15 years',
    licenseNumber: 'MH-77889',
    hospital: 'KEM Hospital, Mumbai',
    education: 'MBBS, MD - General Medicine',
    certificate: 'gp_cert.pdf',
    status: 'verified',
    rating: 4.9,
    fee: 500,
    available: true,
  },
  {
    id: 'd7',
    name: 'Dr. Meera Nair',
    email: 'meera@demo.com',
    specialty: 'Psychiatrist',
    experience: '9 years',
    licenseNumber: 'MH-99001',
    hospital: 'Lokmanya Hospital, Pune',
    education: 'MBBS, MD - Psychiatry',
    certificate: 'psych_cert.pdf',
    status: 'verified',
    rating: 4.8,
    fee: 1200,
    available: true,
  },
  {
    id: 'd8',
    name: 'Dr. Suresh Patil',
    email: 'suresh@demo.com',
    specialty: 'Gastroenterologist',
    experience: '11 years',
    licenseNumber: 'MH-33445',
    hospital: 'Jehangir Hospital, Pune',
    education: 'MBBS, MD, DM - Gastroenterology',
    certificate: 'gastro_cert.pdf',
    status: 'verified',
    rating: 4.4,
    fee: 1100,
    available: true,
  },
  {
    id: 'd9',
    name: 'Dr. Anita More',
    email: 'anita@demo.com',
    specialty: 'Pulmonologist',
    experience: '7 years',
    licenseNumber: 'MH-22334',
    hospital: 'Sassoon Hospital, Pune',
    education: 'MBBS, MD - Pulmonology',
    certificate: 'pulmo_cert.pdf',
    status: 'verified',
    rating: 4.3,
    fee: 850,
    available: true,
  },
  {
    id: 'd10',
    name: 'Dr. Ravi Shinde',
    email: 'ravi@demo.com',
    specialty: 'Urologist',
    experience: '10 years',
    licenseNumber: 'MH-66778',
    hospital: 'Poona Hospital, Pune',
    education: 'MBBS, MS - Urology',
    certificate: 'uro_cert.pdf',
    status: 'pending',
    rating: 4.1,
    fee: 950,
    available: true,
  },
];

const USERS = {
  [import.meta.env.VITE_PATIENT_EMAIL]: { role: 'patient', name: 'John Patient', password: import.meta.env.VITE_PATIENT_PASSWORD },
  [import.meta.env.VITE_DOCTOR_EMAIL]: { role: 'doctor', name: 'Dr. Sarah Smith', password: import.meta.env.VITE_DOCTOR_PASSWORD },
  [import.meta.env.VITE_ADMIN_EMAIL]: { role: 'admin', name: 'Admin', password: import.meta.env.VITE_ADMIN_PASSWORD },
};

export const mockAuthService = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = USERS;

    const user = users[credentials.email];

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    return {
      accessToken: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-' + Date.now(),
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'Registration successful' };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { message: 'Logged out' };
  },
};
