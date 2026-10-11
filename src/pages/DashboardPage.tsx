import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? '';

  return <PageHeader title={`Welcome back, ${firstName}`} subtitle="Here is how your month is going." />;
}
