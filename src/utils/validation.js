export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
};

export const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return /^[0-9]{10}$/.test(digits);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  let strength = 0;
  if (validation.hasUpperCase) strength++;
  if (validation.hasLowerCase) strength++;
  if (validation.hasNumber) strength++;
  if (validation.hasSpecialChar) strength++;
  if (password.length >= 12) strength++;
  if (strength <= 2) return { level: 'Weak', color: 'red' };
  if (strength <= 3) return { level: 'Medium', color: 'orange' };
  return { level: 'Strong', color: 'green' };
};

// Returns error string or '' if valid
export const getFieldError = (name, value, formData = {}) => {
  switch (name) {
    case 'name':
      return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    case 'email':
      return !validateEmail(value) ? 'Enter a valid email address' : '';
    case 'phone':
      if (/[a-zA-Z]/.test(value)) return 'Phone number must contain only digits';
      if (value.replace(/\D/g, '').length !== 10) return 'Phone number must be exactly 10 digits';
      return '';
    case 'password':
      return value.length < 8 ? 'Password must be at least 8 characters' : '';
    case 'confirmPassword':
      return value !== formData.password ? 'Passwords do not match' : '';
    case 'licenseNumber':
      return value.trim().length < 3 ? 'Enter a valid license number' : '';
    case 'hospital':
      return value.trim().length < 2 ? 'Hospital name is required' : '';
    case 'experience':
      return value.trim().length === 0 ? 'Experience is required' : '';
    case 'education':
      return value.trim().length < 2 ? 'Education is required' : '';
    default:
      return '';
  }
};
