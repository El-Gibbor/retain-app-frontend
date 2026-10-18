import { Alert, Snackbar } from '@mui/material';
import { useSyncExternalStore } from 'react';
import { slowRequestStore } from '../../api/client';

export default function ServerWakeNotice() {
  const slow = useSyncExternalStore(slowRequestStore.subscribe, slowRequestStore.getSnapshot);

  return (
    <Snackbar open={slow} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="info" variant="filled" sx={{ width: '100%' }}>
        Waking up the server. The first request after a quiet spell can take up to a minute.
      </Alert>
    </Snackbar>
  );
}
