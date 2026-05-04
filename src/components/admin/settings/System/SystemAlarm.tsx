import styled from 'styled-components';
import { useState } from 'react';
import { Dropdown } from '@/components/common/Dropdown';
import { Toggle } from '@/components/common/Toggle';
import { useNotification, useUpdateNotification } from '@/api/notification';

export const SystemAlarm = () => {
  const [selectedOption, setSelectedOption] = useState('즉시');

  const { data } = useNotification();
  const { mutate: updateNotification } = useUpdateNotification();

  const handleToggle = (id: number, currentStatus: boolean) => {
    updateNotification({
      disasterTypeId: id,
      isEnabled: !currentStatus,
    });
  };

  return (
    <Container>
      <SectionHeader>
        알림 발송 주기
        <Dropdown
          title="즉시"
          options={['즉시', '10분', '30분', '1시간']}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          style={{ width: '120px' }}
        />
      </SectionHeader>

      <Border isDark={true} />

      {data?.map((notification, index) => (
        <div key={notification.disasterTypeId}>
          <Section>
            <div className="left">
              <img src={notification.iconUrl} />
              {notification.disasterTypeName} 알림
            </div>
            <Toggle
              checked={notification.isEnabled}
              onChange={() =>
                handleToggle(
                  notification.disasterTypeId,
                  notification.isEnabled,
                )
              }
            />
          </Section>
          {index !== data.length - 1 && <Border />}
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
`;

const SectionHeader = styled.div`
  padding: 6px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const Section = styled.div`
  padding: 8px 0px 16px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body18};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .left {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const Border = styled.div<{ isDark?: boolean }>`
  height: 1px;
  background: ${({ theme, isDark }) =>
    isDark ? theme.colors.gray600 : theme.colors.gray300};
`;
