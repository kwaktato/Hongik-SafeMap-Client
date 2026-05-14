import { Routes, Route, Outlet } from 'react-router-dom';
import { MyPage } from '@/pages/user/MyPage/MyPage';
import { AccountInfoPage } from '@/pages/user/MyPage/AccountInfoPage';
import { PasswordChangePage } from '@/pages/user/MyPage/PasswordChangePage';
import { MedicalInfoPage } from '@/pages/user/MyPage/MedicalInfoPage';
import { ContactInfoPage } from '@/pages/user/MyPage/ContactInfoPage';
import { MyReportPage } from '@/pages/user/MyPage/MyReportPage';
import { MyResourcePostPage } from '@/pages/user/MyPage/MyResourcePostPage';
import { MyMissingPostPage } from '@/pages/user/MyPage/MyMissingPostPage';

export const UserMyRoute = () => {
  return (
    <div>
      <Routes>
        <Route index element={<MyPage />} />
        <Route path="account" element={<AccountInfoPage />} />
        <Route path="password" element={<PasswordChangePage />} />
        <Route path="medical" element={<MedicalInfoPage />} />
        <Route path="contact" element={<ContactInfoPage />} />
        <Route path="report" element={<MyReportPage />} />
        <Route path="report" element={<MyReportPage />} />
        <Route path="resource" element={<MyResourcePostPage />} />
        <Route path="missing" element={<MyMissingPostPage />} />
      </Routes>
      <Outlet />
    </div>
  );
};
