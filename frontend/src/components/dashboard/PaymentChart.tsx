import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { usePaymentChartData } from '../../hooks/usePayments';
import Spinner from '../ui/Spinner';

export default function PaymentChart() {
  const { data: chartData, isLoading } = usePaymentChartData();

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Pagos por Mes
      </h3>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          Sin datos disponibles
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            <Bar
              dataKey="paid"
              name="Pagados"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Pendientes"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
