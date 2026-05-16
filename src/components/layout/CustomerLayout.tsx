import { Outlet } from 'react-router-dom';
import { Navbar, SharedFooter, WhatsAppButton } from '../shared';
import { Toaster } from '../ui/sonner';
import NotificationToast from '../customer/NotificationToast';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SharedFooter />
      <WhatsAppButton />
      <NotificationToast />
      <Toaster />
    </div>
  );
}