import styled from 'styled-components';
import Clock from '@/assets/icons/ClockXS.svg?react';
import False from '@/assets/icons/FalseXS.svg?react';
import Exact from '@/assets/icons/ExactXS.svg?react';
import Helpful from '@/assets/icons/HelpfulXS.svg?react';
import Useless from '@/assets/icons/UselessXS.svg?react';
import { useReportEvaluation } from '@/api/report';
import { Tag } from '@/components/common/Tag';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { ReportBase } from '@/types/Report';
import { formatDateTime } from '@/utils/formatDate';

interface UserReportCardProps {
  report: ReportBase;
}

export const UserReportCard = ({ report }: UserReportCardProps) => {
  const { handleNavigate } = useHandleNavigate();

  const { data: evaluation } = useReportEvaluation(report.id);

  const disasterTagVariant =
    !(report.status === '승인' || '검증됨') && report.trustScore < 75
      ? 'white'
      : 'black';

  return (
    <Container onClick={() => handleNavigate(`/user/report/${report.id}`)}>
      <div className="title">{report.disasterDescription}</div>

      <div className="middle">
        <div className="date">
          <Clock />
          {formatDateTime(report.createdAt)}
        </div>

        <div className="tag">
          <Tag variant={disasterTagVariant}>{report.disasterType.name}</Tag>
          {report.status === '승인' || report.status === '검증됨' ? (
            <Tag variant="blue">
              <Exact />
              검증됨
            </Tag>
          ) : report.trustScore < 75 || report.status === 'AI 신뢰도 의심' ? (
            <Tag variant="red">
              <False />
              AI 신뢰도 의심
            </Tag>
          ) : null}
        </div>
      </div>

      <div className="border" />

      <ReviewWrapper>
        <div className="review">
          <div className="option">
            <Helpful />
            도움됨
          </div>
          <div className="count">{evaluation?.helpfulCount}</div>
        </div>
        <div className="review">
          <div className="option">
            <Useless />
            도움 안됨
          </div>
          <div className="count">{evaluation?.notHelpfulCount}</div>
        </div>
        {/* <div className="review">
          <div className="option">
            <Exact />
            정확
          </div>
          <div className="count">2</div>
        </div>
        <div className="review">
          <div className="option">
            <False />
            허위
          </div>
          <div className="count">1</div>
        </div> */}
      </ReviewWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 12px;

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .middle {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 2px;
    color: ${({ theme }) => theme.colors.gray600};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .tag {
    display: flex;
    gap: 4px;
  }

  .border {
    margin: 0px -20px;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const ReviewWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;

  .review {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .option {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .count {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
