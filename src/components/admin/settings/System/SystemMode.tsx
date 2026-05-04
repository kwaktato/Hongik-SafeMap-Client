import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useSystemMaintenance, useUpdateSystemMaintenance } from '@/api/admin';
import { Toggle } from '@/components/common/Toggle';
import { Toast } from '@/components/common/Toast';

export const SystemMode = () => {
  const { data } = useSystemMaintenance();
  const { mutate: updateMaintenance } = useUpdateSystemMaintenance();

  const [isInspectionMode, setIsInspectionMode] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  useEffect(() => {
    if (data) {
      setIsInspectionMode(data.maintenance);
    }
  }, [data]);

  const handleToggle = () => {
    updateMaintenance(!isInspectionMode, {
      onSuccess: () => {
        setIsInspectionMode(!isInspectionMode);
        showToast(
          `점검 모드가 ${!isInspectionMode ? '활성화' : '비활성화'} 되었습니다.`,
        );
      },
      onError: () => {
        alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <Container>
      <div className="text">
        <div className="mode">서비스 점검 모드</div>
        <div className="description">
          서비스를 일시 중단하고 점검 페이지로 전환
        </div>
      </div>

      <Toggle checked={isInspectionMode} onChange={handleToggle} />

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  padding: 26px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};

  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mode {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .description {
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
