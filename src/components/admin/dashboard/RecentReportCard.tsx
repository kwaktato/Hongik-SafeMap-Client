import styled from 'styled-components';
import Check from '@/assets/icons/ExactXS.svg?react';
import False from '@/assets/icons/FalseXS.svg?react';
import { Tag } from '@/components/common/Tag';
import { formatDateTime } from '@/utils/formatDate';
import { formatTextTruncate } from '@/utils/formatText';
import type { RiskLevel } from '@/types/common';
import type { DashboardReport } from '@/types/Admin';

interface RecentReportCardProps {
  report: DashboardReport;
}

export const RecentReportCard = ({ report }: RecentReportCardProps) => {
  const typeTagVariant = (level: RiskLevel) => {
    if (level === '긴급' || level === '높음') return 'red';
    return 'white';
  };

  return (
    <Container>
      <div className="tags">
        <Tag variant={typeTagVariant(report.riskLevel)}>
          {report.disasterType.name}
        </Tag>

        {report.status === '검증됨' && (
          <Tag variant="blue" iconTag={true}>
            <Check />
            검증됨
          </Tag>
        )}

        {report.status === 'AI 신뢰도 의심' && (
          <Tag variant="red" iconTag={true}>
            <False />
            AI 신뢰도 의심
          </Tag>
        )}

        {report.status === '승인' && (
          <Tag variant="blue" iconTag={true}>
            <Check />
            승인
          </Tag>
        )}
      </div>

      <div className="description">
        {formatTextTruncate(report.disasterDescription, 45)}
      </div>

      <div className="time">{formatDateTime(report.createdAt)}</div>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .tags {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .description {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .time {
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
