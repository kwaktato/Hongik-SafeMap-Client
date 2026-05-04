import styled from 'styled-components';
import HelpfulIcon from '@/assets/icons/HelpfulXS.svg?react';
import UselessIcon from '@/assets/icons/UselessXS.svg?react';
import type { ReportEvaluationResponse } from '@/types/Report';

interface StatisticsProps {
  evaluation: ReportEvaluationResponse | undefined;
}

export const Statistics = ({ evaluation }: StatisticsProps) => {
  return (
    <StatisticsWrapper>
      <div className="rating">
        <div className="icon">
          <Helpful />
          <div className="gray">도움됨</div>
        </div>
        <div className="black">{evaluation?.helpfulCount}</div>
      </div>

      <div className="divider" />

      <div className="rating">
        <div className="icon">
          <Useless />
          <div className="gray">도움 안됨</div>
        </div>
        <div className="black">{evaluation?.notHelpfulCount}</div>
      </div>
    </StatisticsWrapper>
  );
};

const StatisticsWrapper = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;

  .rating {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .icon {
    display: flex;
    align-items: center;
  }

  .divider {
    width: 1px;
    background: ${({ theme }) => theme.colors.gray400};
  }

  .black {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .gray {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Helpful = styled(HelpfulIcon)`
  color: ${({ theme }) => theme.colors.blue600};
`;

const Useless = styled(UselessIcon)`
  color: ${({ theme }) => theme.colors.red600};
`;
