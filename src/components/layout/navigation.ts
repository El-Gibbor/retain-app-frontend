import {
  AdminPanelSettingsOutlined,
  DashboardOutlined,
  ReceiptLongOutlined,
  SavingsOutlined,
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
  { label: 'Budget', path: '/budget', icon: SavingsOutlined },
  { label: 'Admin', path: '/admin', icon: AdminPanelSettingsOutlined, adminOnly: true },
];
