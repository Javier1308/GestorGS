import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastContainer from '../ui/ToastContainer';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function AppLayout() {
  // Initialize WebSocket connection
  useWebSocket();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
