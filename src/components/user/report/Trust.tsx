import styled from 'styled-components';
import Warning from '@/assets/icons/WarningS.svg?react';
import { ProgressBar } from '@/components/common/ProgressBar';

interface TrustProps {
  trustScore: number | undefined;
}

export const Trust = ({ trustScore }: TrustProps) => {
  const isLowTrust = trustScore !== undefined && trustScore < 75;

  return (
    <TrustWrapper>
      <div className="title">신뢰도 점수</div>
      <TrustSection>
        <span>AI 신뢰도</span>
        <span className={`trust-value ${isLowTrust ? 'low' : ''}`}>
          {trustScore}%
        </span>
      </TrustSection>

      <ProgressBar percent={trustScore ?? 0} />

      {isLowTrust && (
        <WarningWrapper>
          <Warning />
          <span>
            이 제보는 AI에 의해 부정확하거나 허위 정보로 평가되었습니다. 정보를
            신중히 확인해주세요.
          </span>
        </WarningWrapper>
      )}
    </TrustWrapper>
  );
};

const TrustWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TrustSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .trust-value {
    &.low {
      color: ${({ theme }) => theme.colors.red600};
    }
  }
`;

const WarningWrapper = styled.div`
  padding: 8px 16px 8px 12px;
  display: flex;
  // align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.red100};
  border-radius: 8px;

  svg {
    flex-shrink: 0;
  }

  color: ${({ theme }) => theme.colors.red600};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  span {
    padding-top: 4px;
  }
`;
