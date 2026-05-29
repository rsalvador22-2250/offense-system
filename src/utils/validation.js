export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStudentNumber = (num) => {
  return num && num.length >= 5;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};
