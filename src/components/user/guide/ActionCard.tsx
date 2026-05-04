import styled from 'styled-components';
import { useState } from 'react';
import Chevron from '@/assets/icons/ChevronUp.svg?react';
import type { Actions } from '@/types/SafetyTips';

interface ActionCardProps {
  index: number;
  guide: Actions;
}

export const ActionCard = ({ index, guide }: ActionCardProps) => {
  const [showAction, setShowAction] = useState(false);

  return (
    <ActionWrapper down={showAction}>
      <div className="top" onClick={() => setShowAction(!showAction)}>
        <div className="left">
          <div className="number">{index + 1}</div>
          <div className="situation">{guide.title}</div>
        </div>
        <ActionToggle down={showAction} />
      </div>
      {showAction && <Action>{guide.guide}</Action>}
    </ActionWrapper>
  );
};

const ActionWrapper = styled.div<{ down: boolean }>`
  padding: ${({ down }) => (down ? '6px 12px 12px 16px' : '6px 12px 6px 16px')};
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .number {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.red600};
    border-radius: 4px;

    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.font.fontSize.detail11};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .situation {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
    line-height: 32px;
  }
`;

const Action = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const ActionToggle = styled(Chevron)<{ down: boolean }>`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray600};
  transform: ${({ down }) => (down ? 'none' : 'rotate(180deg)')};
  transition: transform 0.7s ease;
`;
