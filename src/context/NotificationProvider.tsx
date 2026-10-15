import { Alert, Snackbar } from '@mui/material';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NotificationContext, type NotificationSeverity } from './notification-context';

interface Notification {
  id: number;
  message: string;
  severity: NotificationSeverity;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback((message: string, severity: NotificationSeverity = 'success') => {
    setCurrent({ id: Date.now(), message, severity });
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        key={current?.id}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={current?.severity ?? 'success'}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: '100%' }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
