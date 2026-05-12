import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Count from '@/assets/icons/InformationXS.svg?react';
import Time from '@/assets/icons/ClockXS.svg?react';
import Chevron from '@/assets/icons/ChevronRight.svg?react';
import { Tag, type TagColor } from '@/components/common/Tag';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { DisasterGroupDetail } from '@/types/Report';
import {
  formatRecordTitle,
  getOfficialAddress,
  type KakaoAddressResult,
} from '@/utils/formatAddress';
import { formatDateTime, formatSimpleDate } from '@/utils/formatDate';
import { formatTextTruncate } from '@/utils/formatText';

interface BottomSheetReportProps {
  isOpen: boolean;
  onClose: () => void;
  group: DisasterGroupDetail;
}

export const BottomSheetReport = ({
  isOpen,
  onClose,
  group,
}: BottomSheetReportProps) => {
  if (!isOpen) return null;

  const { handleNavigate } = useHandleNavigate();

  const [addressData, setAddressData] = useState<KakaoAddressResult | null>(
    null,
  );

  useEffect(() => {
    if (group.centerLatitude && group.centerLongitude) {
      getOfficialAddress(group.centerLatitude, group.centerLongitude)
        .then(setAddressData)
        .catch(console.error);
    }
  }, [group]);

  if (!addressData) return <div>주소 로딩 중...</div>;

  const disasterTitle = group.title
    ? group.title
    : formatRecordTitle(
        addressData,
        group.latestRiskLevel,
        group.disasterType.name,
      );

  const tag = {
    긴급: {
      variant: 'red' as TagColor,
      text: '긴급',
    },
    높음: {
      variant: 'red' as TagColor,
      text: '긴급',
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

  const dangerousTag = tag[group.latestRiskLevel];

  return (
    <SheetBackground onClick={onClose}>
      <SheetContainer onClick={(e) => e.stopPropagation()}>
        <TitleWrapper>
          <div className="top">
            <div className="title">{disasterTitle}</div>
            <div className="right">
              <div>현재 위험도</div>
              <Tag variant={dangerousTag.variant}>{dangerousTag.text}</Tag>
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
              <Time />
              제보 시간
            </div>
            {formatSimpleDate(group.earliestReportTime)} ~{' '}
            {formatSimpleDate(group.latestReportTime)}
          </div>
        </TitleWrapper>

        <Border />

        <ReportsWrapper>
          {group.reports.map((report, index) => (
            <Report onClick={() => handleNavigate(`/user/report/${report.id}`)}>
              <div className="text">
                <div className="report">
                  <div>#제보 {index + 1}</div>
                  <span>
                    {formatTextTruncate(report.disasterDescription, 25)}
                  </span>
                </div>
                <div className="time">
                  <Time />
                  {formatDateTime(report.createdAt)}
                </div>
              </div>
              <Chevron />
            </Report>
          ))}
        </ReportsWrapper>
      </SheetContainer>
    </SheetBackground>
  );
};

const SheetBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SheetContainer = styled.div`
  width: 100%;
  max-height: 432px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  padding: 16px 20px;
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

  .right {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
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
`;

const Border = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const ReportsWrapper = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
`;

const Report = styled.div`
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.gray700};

  .text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .report {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  span {
    color: ${({ theme }) => theme.colors.gray900};
  }

  .time {
    display: flex;
    align-items: flex-end;

    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
