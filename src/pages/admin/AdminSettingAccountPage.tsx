import styled from 'styled-components';
import User from '@/assets/icons/User.svg?react';
import Stats from '@/assets/icons/Stats.svg?react';
import { SettingSection } from '@/components/admin/settings/SettingSection';
import { AccountLog } from '@/components/admin/settings/Account/AccountLog';
import { AccountManage } from '@/components/admin/settings/Account/AccountManage';

export const AdminSettingAccountPage = () => {
  return (
    <Container>
      <SettingSection
        icon={<User />}
        title="관리자 계정 관리"
        description="관리자 계정 추가 및 권한 관리"
      >
        <AccountManage />
      </SettingSection>

      <SettingSection
        icon={<Stats />}
        title="관리자 활동 로그"
        description="최근 관리자 활동 기록"
      >
        <AccountLog />
      </SettingSection>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 28px;
  display: flex;
  justify-content: spcae-between;
  gap: 80px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray400};
`;
