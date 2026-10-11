import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordField from '../components/auth/PasswordField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../utils/validation';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type SignUpErrors = Partial<Record<keyof SignUpForm, string>>;

const initialForm: SignUpForm = { name: '', email: '', password: '', confirmPassword: '' };

const validate = ({ name, email, password, confirmPassword }: SignUpForm): SignUpErrors => ({
  ...(!name.trim() && { name: 'Name is required' }),
  ...(!isValidEmail(email) && { email: 'Enter a valid email address' }),
  ...(password.length < MIN_PASSWORD_LENGTH && {
    password: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  }),
  ...(confirmPassword !== password && { confirmPassword: 'Passwords do not match' }),
});

export default function SignUpPage() {
  const { signUp } = useAuth();

  const [form, setForm] = useState<SignUpForm>(initialForm);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField =
    (field: keyof SignUpForm) => (event: ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      // GuestRoute redirects once the session starts
      await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start recording expenses and set a monthly budget."
      footer={
        <>
          Already have an account?{' '}
          <Link component={RouterLink} to="/signin" sx={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </>
      }
    >
      <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <TextField
          label="Full name"
          autoComplete="name"
          autoFocus
          value={form.name}
          onChange={updateField('name')}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField('email')}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={updateField('password')}
          error={Boolean(errors.password)}
          helperText={errors.password ?? `At least ${MIN_PASSWORD_LENGTH} characters`}
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
        />
        <Button type="submit" variant="contained" size="large" loading={submitting}>
          Create account
        </Button>
      </Stack>
    </AuthLayout>
  );
}
