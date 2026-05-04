import styled from 'styled-components';
import Notification from '@/assets/icons/Notification.svg?react';
import Setting from '@/assets/icons/Setting.svg?react';
import { SettingSection } from '@/components/admin/settings/SettingSection';
import { SystemAlarm } from '@/components/admin/settings/System/SystemAlarm';
import { SystemMode } from '@/components/admin/settings/System/SystemMode';

export const AdminSettingSystemPage = () => {
  return (
    <Container>
      <SettingSection
        icon={<Notification />}
        title="긴급 알림 설정"
        description="재난 유형별 사용자 알림 발송 설정"
      >
        <SystemAlarm />
      </SettingSection>

      <SettingSection
        icon={<Setting />}
        title="시스템 운영 모드"
        description="서비스 점검 및 긴급 대응 모드 관리"
      >
        <SystemMode />
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
