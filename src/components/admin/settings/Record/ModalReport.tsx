import styled from 'styled-components';
import ModalClose from '@/assets/icons/Exit.svg?react';
import Count from '@/assets/icons/InformationXS.svg?react';
import Clock from '@/assets/icons/ClockXS.svg?react';
import Position from '@/assets/icons/PositionXS.svg?react';
import CheckIcon from '@/assets/icons/ExactXS.svg?react';
import FalseIcon from '@/assets/icons/FalseXS.svg?react';
import { Tag, type TagColor } from '@/components/common/Tag';
import { formatDateTime, formatSimpleDate } from '@/utils/formatDate';
import { formatAddress, type KakaoAddressResult } from '@/utils/formatAddress';
import { useAdminReportGroupDetail } from '@/api/admin';

interface ModalReportProps {
  onClose: () => void;
  addressData: KakaoAddressResult | null;
  disasterTitle: string;
  groupId: number;
}

export const ModalReport = ({
  onClose,
  addressData,
  disasterTitle,
  groupId,
}: ModalReportProps) => {
  const { data: group } = useAdminReportGroupDetail(groupId);

  if (!group) return null;

  const tag = {
    긴급: {
      variant: 'red' as TagColor,
      text: '긴급',
      level: '매우 심각',
    },
    높음: {
      variant: 'red' as TagColor,
      text: '높음',
      level: '심각',
    },
    보통: {
      variant: 'black' as TagColor,
      text: '보통',
      level: '보통',
    },
    낮음: {
      variant: 'white' as TagColor,
      text: '낮음',
      level: '낮음',
    },
  };
  const riskTag = tag[group.latestRiskLevel];

  return (
    <ModalWrapper>
      <DisasterWrapper>
        <div className="row">
          <div className="modal">재난 제보 기록</div>
          <ModalXImg onClick={onClose} />
        </div>

        <div className="title">{disasterTitle}</div>

        <div className="row10">
          <div className="row4">
            <div className="tag">재난 유형</div>
            <Tag variant="black">{group.disasterType.name}</Tag>
          </div>
          <div className="divider" />
          <div className="row4">
            <div className="tag">현재 위험도</div>
            <Tag variant={riskTag.variant}>{riskTag.text}</Tag>
          </div>
        </div>

        <InfoWrapper>
          <div className="info">
            <div className="left">
              <Count />
              제보 건수
            </div>
            <div className="right">{group.reportCount}건</div>
          </div>

          <div className="info">
            <div className="left">
              <Clock />
              발생 기간
            </div>
            <div className="right">
              {formatSimpleDate(group.earliestReportTime, true)} ~{' '}
              {formatSimpleDate(group.latestReportTime, true)}
            </div>
          </div>

          {addressData && (
            <div className="info">
              <div className="left">
                <Position />
                발생 장소
              </div>
              <div className="right">{formatAddress(addressData, true)}</div>
            </div>
          )}
        </InfoWrapper>
      </DisasterWrapper>

      <Border />

      <ReportsWrapper>
        {group.reports.map((report) => (
          <ReportCard>
            <div className="row">
              <div className="report">제보 #{report.id}</div>

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

            <div className="description">{report.disasterDescription}</div>

            <InfoWrapper>
              {report.trustScore && (
                <div className="info">
                  <div className="left">
                    <Count />
                    AI 신뢰도 점수
                  </div>
                  <Tag variant={report.trustScore >= 75 ? 'black' : 'red'}>
                    {report.trustScore}점
                  </Tag>
                </div>
              )}

              <div className="info">
                <div className="left">
                  <Clock />
                  제보 시간
                </div>
                <div className="right">{formatDateTime(report.createdAt)}</div>
              </div>

              <div className="info">
                <div className="left">
                  <Position />
                  제보 장소
                </div>
                <div className="right">{report.address}</div>
              </div>

              <div className="info">
                <div className="left">
                  <Clock />
                  제보 위험도
                </div>
                <Tag variant={tag[report.riskLevel].variant}>
                  {tag[report.riskLevel].level}
                </Tag>
              </div>
            </InfoWrapper>
          </ReportCard>
        ))}
      </ReportsWrapper>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 20px;
  width: 560px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  position: relative;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .row2 {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .row4 {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .row10 {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .divider {
    width: 1px;
    height: 12px;
    background: ${({ theme }) => theme.colors.gray500};
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .right {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const DisasterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .modal {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title22};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .title {
    margin-top: -4px;
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head30};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .tag {
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const ModalXImg = styled(ModalClose)`
  cursor: pointer;
`;

const Border = styled.div`
  margin: 0px -20px;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const ReportsWrapper = styled.div`
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;

  /* 1. 전체 스크롤바 너비 */
  &::-webkit-scrollbar {
    width: 12px;
  }

  /* 2. 스크롤바 트랙 (바탕) */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 3. 스크롤바 막대 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray500};
    border-radius: 12px;
    border: 4px solid ${({ theme }) => theme.colors.white};
  }

  & {
    scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
  }
`;

const ReportCard = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .report {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .description {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
