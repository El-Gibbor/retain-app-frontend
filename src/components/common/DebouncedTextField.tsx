import { TextField, type TextFieldProps } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

type DebouncedTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  initialValue: string;
  onCommit: (value: string) => void;
  delayMs?: number;
};

// Keeps typing local and only commits after a pause; remount with a new key to reset it
export default function DebouncedTextField({
  initialValue,
  onCommit,
  delayMs,
  ...props
}: DebouncedTextFieldProps) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebouncedValue(value, delayMs);
  const lastCommitted = useRef(initialValue);

  useEffect(() => {
    if (debounced === lastCommitted.current) return;
    lastCommitted.current = debounced;
    onCommit(debounced);
  }, [debounced, onCommit]);

  return <TextField {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
}
