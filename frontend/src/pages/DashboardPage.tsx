import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/notificationService';
import MetricCards from '../components/dashboard/MetricCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import PaymentChart from '../components/dashboard/PaymentChart';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getData,
  });

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Resumen general de la gestion
        </p>
      </div>

      <MetricCards data={data} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentChart />
        <RecentActivity entries={data.recentActivity} />
      </div>
    </div>
  );
}
