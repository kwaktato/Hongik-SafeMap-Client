import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Logo from '@/assets/icons/LogoAdmin.svg?react';
import { ADMIN_SIDE_BAR } from '@/constant/MenuItems';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const AdminSideBar = () => {
  const { handleNavigate } = useHandleNavigate();

  return (
    <SideBarWrapper>
      <Logo onClick={() => handleNavigate('/admin')} />

      <MenuWrapper>
        {ADMIN_SIDE_BAR.map((tab) => {
          const hasChildren = tab.children && tab.children.length > 0;

          return (
            <div key={tab.key}>
              <MenuItem to={tab.path} end={tab.end}>
                {tab.icon}
                <span>{tab.label}</span>
              </MenuItem>

              {hasChildren && (
                <SubMenuWrapper>
                  {tab.children.map((child) => (
                    <SubMenuItem key={child.key} to={child.path}>
                      {child.label}
                    </SubMenuItem>
                  ))}
                </SubMenuWrapper>
              )}
            </div>
          );
        })}
      </MenuWrapper>
    </SideBarWrapper>
  );
};

const SideBarWrapper = styled.div`
  padding: 32px 36px;
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 56px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray400};
  background: ${({ theme }) => theme.colors.white};

  position: sticky;
  top: 0;
  left: 0;

  svg {
    cursor: pointer;
  }
`;

const MenuWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const MenuItem = styled(NavLink)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray700};

  span {
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  svg {
    width: 24px;
    height: 24px;
  }

  &.active {
    color: ${({ theme }) => theme.colors.red600};
  }
`;

const SubMenuWrapper = styled.div`
  padding-top: 16px;
  padding-left: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubMenuItem = styled(NavLink)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &.active {
    color: ${({ theme }) => theme.colors.red600};
  }
`;
