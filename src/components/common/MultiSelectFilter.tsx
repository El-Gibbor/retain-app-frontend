import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectFilterProps<T extends string> {
  id: string;
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  /** Summary shown in the closed field; defaults to the selected labels */
  renderSummary?: (selected: T[]) => string;
}

export default function MultiSelectFilter<T extends string>({
  id,
  label,
  options,
  selected,
  onChange,
  renderSummary,
}: MultiSelectFilterProps<T>) {
  const labelFor = (value: T) => options.find((option) => option.value === value)?.label ?? value;

  const handleChange = (event: SelectChangeEvent<T[]>) => {
    const { value } = event.target;
    // Browser autofill can report a comma-joined string; map it back onto known options
    if (typeof value === 'string') {
      const picked = value.split(',');
      onChange(options.filter((option) => picked.includes(option.value)).map((option) => option.value));
    } else {
      onChange(value);
    }
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select<T[]>
        labelId={`${id}-label`}
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(values) => (renderSummary ? renderSummary(values) : values.map(labelFor).join(', '))}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox size="small" checked={selected.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
