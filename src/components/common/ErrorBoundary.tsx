import { ErrorOutlineOutlined } from '@mui/icons-material';
import { Button, Card, Stack, Typography } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Error boundaries still require a class component in React
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Card sx={{ maxWidth: 520, mx: 'auto', my: 6, p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <ErrorOutlineOutlined color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h5" component="h1">
            Something went wrong
          </Typography>
          <Typography color="text.secondary">
            This page hit an unexpected error. Reloading usually fixes it, and your data is safe.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </Stack>
      </Card>
    );
  }
}
