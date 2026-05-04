import styled from 'styled-components';
import type React from 'react';
import Active from '@/assets/icons/BookmarkActive.svg?react';
import Disactive from '@/assets/icons/BookmarkDisactive.svg?react';
import { Button } from '@/components/common/Button';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { SafetyTipSummary } from '@/types/SafetyTips';

interface GuideCardProps {
  guide: SafetyTipSummary;
  isFavorite: boolean;
  onToggleFavorite: (guideId: string, e: React.MouseEvent) => void;
}

export const GuideCard = ({
  guide,
  isFavorite,
  onToggleFavorite,
}: GuideCardProps) => {
  const { handleNavigate } = useHandleNavigate();

  return (
    <Container>
      <div className="top">
        <div>{guide.title}</div>
        {isFavorite ? (
          <Active
            onClick={(e) => {
              onToggleFavorite(guide.id, e);
            }}
          />
        ) : (
          <Disactive
            onClick={(e) => {
              onToggleFavorite(guide.id, e);
            }}
          />
        )}
      </div>

      <div className="middle">{guide.detail}</div>

      <div className="bottom">
        <Button
          width="170px"
          variant="black"
          onClick={() => handleNavigate(`/user/guide/${guide.id}`)}
        >
          자세히 보기
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .top {
    display: flex;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .middle {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .bottom {
    margin-top: 16px;
    display: flex;
    justify-content: end;
  }
`;
