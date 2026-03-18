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
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/\D/g, ''));
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
