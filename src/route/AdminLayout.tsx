import styled from 'styled-components';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ADMIN_SIDE_BAR } from '@/constant/MenuItems';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  const currentMenu =
    ADMIN_SIDE_BAR.filter((menu) => !menu.isAction).find((menu) => {
      if (pathname.includes('/admin/settings') && menu.key === 'settings')
        return true;
      return pathname === menu.path;
    }) || ADMIN_SIDE_BAR[0];

  return (
    <Container>
      <TitleWrapper>
        <div className="menu-title">{currentMenu.title}</div>
        <div className="menu-detail">{currentMenu.description}</div>
      </TitleWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 120px 60px 60px 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .menu-title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head34};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .menu-detail {
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const ContentWrapper = styled.main``;
