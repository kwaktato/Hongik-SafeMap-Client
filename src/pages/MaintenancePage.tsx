import { styled } from 'styled-components';
import Warning from '@/assets/icons/WarningError.svg?react';
import { Button } from '@/components/common/Button';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const MaintenancePage = () => {
  const { handleNavigate } = useHandleNavigate();

  return (
    <Container>
      <Warning />
      <div className="title">서비스 점검 안내</div>
      <div className="detail">
        더 안정적인 서비스를 위해 현재 시스템 점검을 진행하고 있습니다.
        <br />
        이용에 불편을 드려 죄송합니다. 잠시 후 다시 시도해 주세요.
      </div>

      <Bottom>
        <Button variant="black" onClick={() => handleNavigate('/')}>
          이전 화면으로
        </Button>
      </Bottom>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  text-align: center;

  .title {
    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .detail {
    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Bottom = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;
