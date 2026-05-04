import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminSideBar } from '@/components/admin/AdminSideBar';
import { AdminLayout } from '@/route/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminReportPage } from '@/pages/admin/AdminReportPage';
import { AdminStatisticPage } from '@/pages/admin/AdminStatisticPage';
import { AdminSettingSystemPage } from '@/pages/admin/AdminSettingSystemPage';
import { AdminSettingAccountPage } from '@/pages/admin/AdminSettingAccountPage';
import { AdminSettingContentPage } from '@/pages/admin/AdminSettingContentPage';

export const AdminRoute = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSideBar />

      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="reports" element={<AdminReportPage />} />
          {/* <Route path="users" element={<AdminUserPage />} /> */}
          <Route path="statistics" element={<AdminStatisticPage />} />

          <Route path="settings">
            <Route index element={<Navigate to="system" replace />} />
            <Route path="system" element={<AdminSettingSystemPage />} />
            <Route path="contents" element={<AdminSettingContentPage />} />
            <Route path="account" element={<AdminSettingAccountPage />} />
          </Route>
        </Routes>
      </AdminLayout>
    </div>
  );
};
