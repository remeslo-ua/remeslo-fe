export const validations = {
  email: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: { value: true, message: "Password is required" },
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  },
};