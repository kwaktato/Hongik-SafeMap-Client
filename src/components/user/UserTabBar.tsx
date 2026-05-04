import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { USER_TABS } from '@/constant/MenuItems';

export const UserTabBar = () => {
  return (
    <TabBarWrapper>
      {USER_TABS.map((tab) => (
        <TabItem key={tab.key} to={tab.path} end={tab.end}>
          {tab.icon}
          <span>{tab.label}</span>
        </TabItem>
      ))}
    </TabBarWrapper>
  );
};

const TabBarWrapper = styled.div`
  padding-bottom: 4px;
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-bewtween;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.white};

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

const TabItem = styled(NavLink)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray600};

  span {
    font-size: ${({ theme }) => theme.font.fontSize.detail10};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  svg {
    width: 36px;
    height: 36px;
  }

  &.active {
    color: ${({ theme }) => theme.colors.gray1000};
  }
`;
