import {
  AccountBalanceWalletOutlined,
  AdminPanelSettingsOutlined,
  DashboardOutlined,
  ReceiptLongOutlined,
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardOutlined },
  { label: 'Expenses', path: '/expenses', icon: ReceiptLongOutlined },
  { label: 'Budget', path: '/budget', icon: AccountBalanceWalletOutlined },
  { label: 'Admin', path: '/admin', icon: AdminPanelSettingsOutlined, adminOnly: true },
];
