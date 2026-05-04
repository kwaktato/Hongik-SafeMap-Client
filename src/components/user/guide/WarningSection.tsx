import styled from 'styled-components';
import Warning from '@/assets/icons/Warning.svg?react';

interface WarningSectionProps {
  warnings: string[] | undefined;
}

export const WarningSection = ({ warnings }: WarningSectionProps) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      {warnings.map((warning, index) => (
        <div key={index} className="warning">
          <Warning /> <span>{warning}</span>
        </div>
      ))}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  margin: 72px 0px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  .warning {
    padding: 5px 12px 5px 8px;

    display: flex;
    gap: 6px;
    border: 1.5px solid ${({ theme }) => theme.colors.gray400};
    border-radius: 8px;

    span {
      padding: 8px 0px;
      color: ${({ theme }) => theme.colors.gray1000};
      font-size: ${({ theme }) => theme.font.fontSize.body16};
      font-weight: ${({ theme }) => theme.font.fontWeight.medium};
    }

    svg {
      color: ${({ theme }) => theme.colors.red600};
      flex-shrink: 0;
    }
  }
`;
