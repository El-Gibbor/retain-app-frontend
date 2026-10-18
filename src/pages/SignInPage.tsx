import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordField from '../components/auth/PasswordField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/errors';
import { isValidEmail } from '../utils/validation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface SignInErrors {
  email?: string;
  password?: string;
}

const validate = (email: string, password: string): SignInErrors => ({
  ...(!isValidEmail(email) && { email: 'Enter a valid email address' }),
  ...(!password && { password: 'Password is required' }),
});

export default function SignInPage() {
  useDocumentTitle('Sign in');
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      // GuestRoute redirects once the session starts
      await signIn({ email: email.trim(), password });
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep track of your spending."
      footer={
        <>
          New to Retain?{' '}
          <Link component={RouterLink} to="/signup" sx={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </>
      }
    >
      <Stack component="form" spacing={2.5} noValidate onSubmit={handleSubmit}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <Button type="submit" variant="contained" size="large" loading={submitting}>
          Sign in
        </Button>
      </Stack>
    </AuthLayout>
  );
}
