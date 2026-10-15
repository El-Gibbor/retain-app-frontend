import {
  Box,
  Chip,
  List,
  ListItem,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Expense } from '../../types/expense';
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../../utils/format';

interface ExpenseListProps {
  expenses: Expense[];
  /** Shows skeleton rows in place of data */
  skeletonRows?: number;
}

function CategoryChip({ name }: { name: string }) {
  return <Chip label={name} size="small" variant="outlined" sx={{ maxWidth: '100%' }} />;
}

function ExpenseTable({ expenses, skeletonRows }: ExpenseListProps) {
  return (
    <TableContainer>
      <Table aria-label="Expenses">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 5 }, (_, cell) => (
                    <TableCell key={cell}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : expenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography sx={{ fontWeight: 500 }} noWrap>
                      {expense.title}
                    </Typography>
                    {expense.notes && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {expense.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <CategoryChip name={expense.category.name} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {formatCurrency(expense.amount)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ExpenseCards({ expenses, skeletonRows }: ExpenseListProps) {
  return (
    <List disablePadding aria-label="Expenses">
      {skeletonRows
        ? Array.from({ length: skeletonRows }, (_, index) => (
            <ListItem key={index} divider sx={{ py: 1.5 }}>
              <Box sx={{ width: '100%' }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            </ListItem>
          ))
        : expenses.map((expense) => (
            <ListItem key={expense.id} divider sx={{ py: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                <Typography sx={{ fontWeight: 500 }} noWrap>
                  {expense.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {formatDate(expense.date)} · {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                </Typography>
                <Box sx={{ mt: 0.75 }}>
                  <CategoryChip name={expense.category.name} />
                </Box>
              </Box>
              <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</Typography>
              </Stack>
            </ListItem>
          ))}
    </List>
  );
}

export default function ExpenseList(props: ExpenseListProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return isDesktop ? <ExpenseTable {...props} /> : <ExpenseCards {...props} />;
}
