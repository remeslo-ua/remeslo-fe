import * as yup from 'yup';

const baseSchema = yup.object().shape({
  login: yup.string().required("Login is required"),
  password: yup.string().required("Password is required").matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]*$/, "Password can only contain letters, numbers, and special characters"),
});

export const loginSchema = baseSchema;

export const registerSchema = baseSchema.shape({
  passwordConfirm: yup.string().required('Confirm password is required').oneOf([yup.ref('password')], 'The passwords do not match'),
});