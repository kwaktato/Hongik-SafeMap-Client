import styled from 'styled-components';
import Count from '@/assets/icons/InformationXS.svg?react';
import Clock from '@/assets/icons/ClockXS.svg?react';
import Position from '@/assets/icons/PositionXS.svg?react';
import Type from '@/assets/icons/NotificationXS.svg?react';
import CheckIcon from '@/assets/icons/ExactXS.svg?react';
import FalseIcon from '@/assets/icons/FalseXS.svg?react';
import { Tag, type TagColor } from '@/components/common/Tag';
import type { DisasterGroupDetail } from '@/types/Report';
import { formatDateTime, formatSimpleDate } from '@/utils/formatDate';
import { formatAddress, type KakaoAddressResult } from '@/utils/formatAddress';
import { Button } from './Button';

interface ModalReportProps {
  onClose: () => void;
  addressData: KakaoAddressResult | null;
  group: DisasterGroupDetail | undefined;
}

export const ModalReport = ({
  onClose,
  addressData,
  group,
}: ModalReportProps) => {
  if (!group) return null;

  const tag = {
    긴급: {
      variant: 'red' as TagColor,
      text: '긴급',
    },
    높음: {
      variant: 'red' as TagColor,
      text: '높음',
    },
    보통: {
      variant: 'black' as TagColor,
      text: '보통',
    },
    낮음: {
      variant: 'white' as TagColor,
      text: '낮음',
    },
  };

  const riskTag = tag[group.latestRiskLevel];

  return (
    <ModalWrapper>
      <TitleWrapper>
        <div className="top">
          <div className="title">{group.disasterType.name}</div>
          <div className="right">
            <div>현재 위험도</div>
            <Tag variant={riskTag.variant}>{riskTag.text}</Tag>
          </div>
        </div>

        <div className="info">
          <div className="detail">
            <Count />
            제보 건수
          </div>
          {group.reportCount}건
        </div>

        <div className="info">
          <div className="detail">
            <Clock />
            발생 기간
          </div>
          {formatSimpleDate(group.earliestReportTime, true)} ~{' '}
          {formatSimpleDate(group.latestReportTime, true)}
        </div>

        {addressData && (
          <div className="info">
            <div className="detail">
              <Position />
              발생 장소
            </div>
            {formatAddress(addressData, true)}
          </div>
        )}

        <div className="info">
          <div className="detail">
            <Type />
            재난 유형
          </div>
          {group.disasterType.name}
        </div>
      </TitleWrapper>

      <Border />

      <ReportsWrapper>
        {group.reports.map((report) => (
          <ReportCard>
            <div className="top">
              <div className="number">제보 #{report.id}</div>

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

            {report.trustScore && (
              <div className="right">
                <div className="detail">AI 신뢰도 점수</div>
                <Tag variant={report.trustScore >= 75 ? 'black' : 'red'}>
                  {report.trustScore}점
                </Tag>
              </div>
            )}

            <div className="description">{report.disasterDescription}</div>

            <div className="infos">
              <div className="info">
                <div className="detail">
                  <Clock />
                  제보 시간
                </div>
                {formatDateTime(report.createdAt)}
              </div>

              <div className="info">
                <div className="detail">
                  <Position />
                  제보 장소
                </div>
                {report.address}
              </div>
            </div>
          </ReportCard>
        ))}
      </ReportsWrapper>

      <Button variant="white" onClick={onClose}>
        닫기
      </Button>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 20px;
  width: 440px;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  position: relative;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 10px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .detail {
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .right {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    color: ${({ theme }) => theme.colors.red600};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
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

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .description {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .infos {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
