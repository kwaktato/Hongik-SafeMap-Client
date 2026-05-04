import styled from 'styled-components';
import { matchPath, Route, Routes, useLocation } from 'react-router-dom';
import Emergency from '@/assets/icons/Emergency.svg?react';
import { UserHomePage } from '@/pages/user/UserHomePage';
import { UserReportDetailPage } from '@/pages/user/UserReportDetailPage';
import { UserReportPostPage } from '@/pages/user/UserReportPostPage';
import { ResourceBoardPage } from '@/pages/user/Board/ResourceBoardPage';
import { ResourceBoardWritePage } from '@/pages/user/Board/ResourceBoardWritePage';
import { ResourcePostPage } from '@/pages/user/Board/ResourcePostPage';
import { MissingBoardPage } from '@/pages/user/Board/MissingBoardPage';
import { MissingBoardWritePage } from '@/pages/user/Board/MissingBoardWritePage';
import { MissingPostPage } from '@/pages/user/Board/MissingPostPage';
import { GuidePage } from '@/pages/user/Guide/GuidePage';
import { GuideDetailPage } from '@/pages/user/Guide/GuideDetailPage';
import { UserMyRoute } from '@/route/UserMyRoute';
import { UserTabBar } from '@/components/user/UserTabBar';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const UserRoute = () => {
  const location = useLocation();

  const hideTabBarPaths = [
    '/user/report',
    '/user/report/:id',
    '/user/resource/write',
    '/user/resource/:id',
    '/user/missing/write',
    '/user/missing/:id',
    '/user/my',
    '/user/my/account',
    '/user/my/password',
    '/user/my/medical',
    '/user/my/contact',
    '/user/my/report',
  ];
  const shouldHideTabBar = () => {
    return hideTabBarPaths.some((pathPattern) => {
      return matchPath(pathPattern, location.pathname) !== null;
    });
  };
  const isHideTabBar = shouldHideTabBar();

  const hideReportButtonPaths = [
    '/user/report',
    '/user/report/:id',
    '/user/resource/write',
    '/user/resource/:id',
    '/user/missing/write',
    '/user/missing/:id',
    '/user/my',
    '/user/my/account',
    '/user/my/password',
    '/user/my/medical',
    '/user/my/contact',
    '/user/my/report',
  ];
  const shouldHideReportButton = () => {
    return hideReportButtonPaths.some((pathPattern) => {
      return matchPath(pathPattern, location.pathname) !== null;
    });
  };
  const isHideReportButton = shouldHideReportButton();

  const { handleNavigate } = useHandleNavigate();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <main>
        <Routes>
          <Route index element={<UserHomePage />} />

          <Route path="report" element={<UserReportPostPage />} />
          <Route path="report/:id" element={<UserReportDetailPage />} />

          <Route path="resource" element={<ResourceBoardPage />} />
          <Route path="resource/write" element={<ResourceBoardWritePage />} />
          <Route path="resource/:id" element={<ResourcePostPage />} />

          <Route path="missing" element={<MissingBoardPage />} />
          <Route path="missing/write" element={<MissingBoardWritePage />} />
          <Route path="missing/:id" element={<MissingPostPage />} />

          <Route path="guide" element={<GuidePage />} />
          <Route path="guide/:id" element={<GuideDetailPage />} />

          <Route path="my/*" element={<UserMyRoute />} />
        </Routes>
      </main>

      {!isHideReportButton && (
        <ReportButton onClick={() => handleNavigate('/user/report')}>
          <Emergency />
        </ReportButton>
      )}

      {!isHideTabBar && <UserTabBar />}
    </div>
  );
};

const ReportButton = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.red600};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  bottom: 76px;
  right: 20px;
  z-index: 5;
`;
