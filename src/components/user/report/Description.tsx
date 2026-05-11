import styled from 'styled-components';
import Location from '@/assets/icons/PositionXS.svg?react';
import Time from '@/assets/icons/ClockXS.svg?react';
import { formatSimpleDate } from '@/utils/formatDate';
import type { ReportDetailResponse } from '@/types/Report';
import { Tag, type TagColor } from '@/components/common/Tag';
import type { DisasterReportStatus, RiskLevel } from '@/types/common';

interface DescriptionProps {
  report: ReportDetailResponse | undefined;
}

export const Description = ({ report }: DescriptionProps) => {
  const getTagVariant = (level?: RiskLevel) => {
    switch (level) {
      case '긴급':
        return { variant: 'red' as TagColor, text: '매우 심각' };
      case '높음':
        return { variant: 'red' as TagColor, text: '심각' };
      case '보통':
        return { variant: 'white' as TagColor, text: '보통' };
      case '낮음':
        return { variant: 'white' as TagColor, text: '낮음' };
      default:
        return { variant: 'white' as TagColor, text: level };
    }
  };

  const { variant, text } = getTagVariant(report?.riskLevel);

  const getStatusTag = (status: DisasterReportStatus, trustScore: number) => {
    if (status === '블라인드') return null;

    if (status === '승인' || status === '검증됨') {
      return <Tag variant="blue">검증됨</Tag>;
    }

    if (status === 'AI 신뢰도 의심' || trustScore < 75) {
      if (status !== '검토대기') {
        return <Tag variant="red">AI 신뢰도 의심</Tag>;
      }
    }

    return null;
  };

  return (
    <TitleWrapper>
      <div className="text">
        <div className="type">{report?.disasterType.name}</div>
        <div className="description">{report?.disasterDescription}</div>
      </div>

      <TagWrapper>
        <div className="tags">
          위험도
          <Tag variant={variant}>{text}</Tag>
        </div>

        <div className="divider" />

        <div className="tags">
          신뢰도
          {getStatusTag(report?.status ?? '검토대기', report?.trustScore ?? 0)}
        </div>
      </TagWrapper>

      <BoxWrapper>
        <div className="info">
          <div className="left">
            <Location />
            위치
          </div>
          <div className="right">{report?.address}</div>
        </div>

        <div className="info">
          <div className="left">
            <Time />
            제보 시간
          </div>
          <div className="right">
            {formatSimpleDate(report?.createdAt ?? '', true)}
          </div>
        </div>
      </BoxWrapper>
    </TitleWrapper>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .type {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .description {
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .tags {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .divider {
    width: 1px;
    height: 16px;
    background: ${({ theme }) => theme.colors.gray500};
  }
`;

const BoxWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;

  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .info {
    display: flex;
    gap: 16px;
  }

  .left {
    width: 64px;
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
  }

  .right {
    color: ${({ theme }) => theme.colors.gray1000};
  }
`;
