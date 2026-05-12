import styled from 'styled-components';
import CheckIcon from '@/assets/icons/ExactXS.svg?react';
import FalseIcon from '@/assets/icons/FalseXS.svg?react';
import HelpfulIcon from '@/assets/icons/HelpfulXS.svg?react';
import UselessIcon from '@/assets/icons/UselessXS.svg?react';
import { Tag } from '@/components/common/Tag';
import type { AdminReport } from '@/types/Admin';

interface ReportSectionProps {
  report: AdminReport;
}

export const ReportSection = ({ report }: ReportSectionProps) => {
  return (
    <ReportWrapper>
      <div className="top">
        <div className="number">제보 #{report.reportId}</div>
        <div className="tags">
          <Tag variant="black">{report.disasterType.name}</Tag>

          {report.status === '검증됨' && (
            <Tag variant="blue" iconTag={true}>
              <CheckIcon />
              검증됨
            </Tag>
          )}

          {report.status === 'AI 신뢰도 의심' && (
            <Tag variant="red" iconTag={true}>
              <FalseIcon />
              AI 신뢰도 의심
            </Tag>
          )}

          {report.status === '승인' && (
            <Tag variant="blue" iconTag={true}>
              <CheckIcon />
              승인
            </Tag>
          )}

          {report.status === '블라인드' && (
            <Tag variant="gray" iconTag={true}>
              <FalseIcon />
              블라인드
            </Tag>
          )}
        </div>
      </div>

      <div className="description">{report.description}</div>

      <ReviewWrapper>
        <div className="rating">
          <div className="icon">
            <Helpful />
            <div className="option">도움됨</div>
          </div>
          <div className="count">{report.helpfulCount}</div>
        </div>

        <div className="divider" />

        <div className="rating">
          <div className="icon">
            <Useless />
            <div className="option">도움 안됨</div>
          </div>
          <div className="count">{report.notHelpfulCount}</div>
        </div>

        <div className="divider" />

        <div className="rating">
          <div className="icon">
            <Report />
            <div className="option">신고</div>
          </div>
          <div className="count">{report.accusationCount}</div>
        </div>
      </ReviewWrapper>
    </ReportWrapper>
  );
};

const ReportWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .tags {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .description {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const ReviewWrapper = styled.div`
  padding: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;

  .rating {
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
    height: 100%;
    background: ${({ theme }) => theme.colors.gray400};
  }

  .option {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .count {
    text-align: center;
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Helpful = styled(HelpfulIcon)`
  color: ${({ theme }) => theme.colors.blue600};
`;

const Useless = styled(UselessIcon)`
  color: ${({ theme }) => theme.colors.red600};
`;

const Report = styled(FalseIcon)`
  color: ${({ theme }) => theme.colors.red600};
`;
