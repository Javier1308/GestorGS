import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import BuildingsPage from '../pages/BuildingsPage';
import PaymentsPage from '../pages/PaymentsPage';
import WorkOrdersPage from '../pages/WorkOrdersPage';
import SettingsPage from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/edificios',
        element: <BuildingsPage />,
      },
      {
        path: '/pagos',
        element: <PaymentsPage />,
      },
      {
        path: '/tickets',
        element: <WorkOrdersPage />,
      },
      {
        path: '/configuracion',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
