import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ChevronUp from '@/assets/icons/ChevronUp.svg?react';
import ChevronDown from '@/assets/icons/ChevronDown.svg?react';
import Calender from '@/assets/icons/CalenderXS.svg?react';
import Map from '@/assets/icons/MapS.svg?react';
import Play from '@/assets/icons/PlayS.svg?react';
import Information from '@/assets/icons/InformationS.svg?react';
import Edit from '@/assets/icons/WriteS.svg?react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ModalSimulation } from '@/components/admin/settings/Record/ModalSimulation';
import { ModalLocation } from '@/components/admin/settings/Record/ModalLocation';
import { ModalReport } from '@/components/admin/settings/Record/ModalReport';
import { Tag, type TagColor } from '@/components/common/Tag';
import { RecordGraph } from '@/components/admin/statistics/RecordGraph';
import type { RiskLevel } from '@/types/common';
import type { DisasterRecord } from '@/types/Admin';
import {
  formatDateTime,
  formatSummaryDate,
  formatYearMonth,
} from '@/utils/formatDate';
import {
  formatAddress,
  formatRecordTitle,
  getOfficialAddress,
  type KakaoAddressResult,
} from '@/utils/formatAddress';
import { useUpdateDisasterTitle } from '@/api/admin';
import { InputBox } from '@/components/common/InputBox';

interface AdminRecordCardProps {
  record: DisasterRecord;
}

export const AdminRecordCard = ({ record }: AdminRecordCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const [addressData, setAddressData] = useState<KakaoAddressResult | null>(
    null,
  );

  const [showLocation, setShowLocation] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showGroupReport, setShowGroupReport] = useState(false);

  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState(record.title);

  const { mutate: updateTitle } = useUpdateDisasterTitle(selectedRecordId ?? 0);

  const handleEditClick = (id: number, currentTitle: string) => {
    setSelectedRecordId(id);
    setNewTitle(currentTitle);
  };

  const handleSaveClick = () => {
    if (!selectedRecordId) return;
    updateTitle(newTitle, {
      onSuccess: () => setSelectedRecordId(null),
    });
  };

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

  const { variant, text } = getTagVariant(record?.latestRiskLevel);

  useEffect(() => {
    if (record.centerLatitude && record.centerLongitude) {
      getOfficialAddress(record.centerLatitude, record.centerLongitude)
        .then(setAddressData)
        .catch(console.error);
    }
  }, [record]);

  if (!addressData) return <Container>주소 로딩 중...</Container>;

  const disasterTitle = record.title
    ? record.title
    : formatRecordTitle(
        addressData,
        record.latestRiskLevel,
        record.disasterType.name,
      );

  return (
    <Container>
      <RecordWrapper>
        <div className="top">
          <div className="column4">
            <div className="date">
              {formatYearMonth(record.earliestReportTime)}
            </div>
            {selectedRecordId === record.id ? (
              <div className="row4">
                <InputBox
                  placeholder="재난 기록의 제목을 입력하세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                />
                <Button variant="white" width="48px" onClick={handleSaveClick}>
                  저장
                </Button>
                <Button
                  variant="white"
                  width="48px"
                  onClick={() => setSelectedRecordId(null)}
                >
                  취소
                </Button>
              </div>
            ) : (
              <div className="disaster">
                {disasterTitle}
                {showDetail && (
                  <Button
                    variant="white"
                    width="32px"
                    height="32px"
                    onClick={() => handleEditClick(record.id, disasterTitle)}
                  >
                    <Edit />
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="row4">
            <Tag variant="black">{record.disasterType.name}</Tag>
            <Tag variant={variant}>{text}</Tag>
          </div>
        </div>

        <div className="row6">
          <div className="row4">
            <Calender />
            {formatSummaryDate(
              record.earliestReportTime,
              record.latestReportTime,
            )}
          </div>
          <div className="border" />
          <div className="row4">
            <span>제보</span>
            {record.reportCount}건
          </div>
          <div className="border" />
          <div className="row4">
            <span>피해 지역</span>
            {formatAddress(addressData, false)}
          </div>
        </div>

        {showDetail && (
          <DetailWrapper>
            <div className="rows">
              <div className="box">
                재난 정보
                <div className="detail">
                  발생 기간
                  <span>
                    {formatDateTime(record.earliestReportTime)}
                    <br />~ {formatDateTime(record.latestReportTime)}
                  </span>
                </div>
                <div className="detail">
                  피해 지역<span>{formatAddress(addressData, true)}</span>
                </div>
                <div className="detail">
                  심각도
                  <span>{text}</span>
                </div>
              </div>
              <div className="box">
                제보 통계
                <div className="detail">
                  총 제보 수<span>{record.reportCount}건</span>
                </div>
                <RecordGraph
                  approved={record.approvedReportCount}
                  pending={record.pendingReportCount}
                  // suspicious={record.}
                />
              </div>
            </div>

            <div className="rows">
              <Button variant="white" onClick={() => setShowLocation(true)}>
                <Map />
                지도에서 보기
              </Button>
              <Button variant="white" onClick={() => setShowSimulation(true)}>
                <Play />
                시뮬레이션
              </Button>
              <Button variant="white" onClick={() => setShowGroupReport(true)}>
                <Information />
                제보 상세보기
              </Button>
            </div>
          </DetailWrapper>
        )}
      </RecordWrapper>

      <Border />

      <ToggleWrapper onClick={() => setShowDetail((prev) => !prev)}>
        <div>상세보기</div>
        {showDetail ? <ChevronUp /> : <ChevronDown />}
      </ToggleWrapper>

      <Modal isOpen={showLocation} onClose={() => setShowLocation(false)}>
        <ModalLocation
          onClose={() => setShowLocation(false)}
          groupId={record.id}
          disasterTitle={disasterTitle}
          address={formatAddress(addressData, true)}
        />
      </Modal>

      <Modal isOpen={showSimulation} onClose={() => setShowSimulation(false)}>
        <ModalSimulation
          onClose={() => setShowSimulation(false)}
          reportId={record.id}
          title={disasterTitle}
          date={formatSummaryDate(
            record.earliestReportTime,
            record.latestReportTime,
          )}
        />
      </Modal>

      <Modal isOpen={showGroupReport} onClose={() => setShowGroupReport(false)}>
        <ModalReport
          onClose={() => setShowGroupReport(false)}
          disasterTitle={disasterTitle}
          addressData={addressData}
          groupId={record.id}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const RecordWrapper = styled.div`
  padding: 20px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .column4 {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .date {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .disaster {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .row4 {
    display: flex;
    gap: 4px;
  }

  .row6 {
    display: flex;
    align-items: center;
    gap: 6px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  span {
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .border {
    width: 1px;
    height: 12px;
    background: ${({ theme }) => theme.colors.gray500};
  }
`;

const DetailWrapper = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .rows {
    display: flex;
    gap: 8px;
  }

  .box {
    width: 100%;
    padding: 16px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: ${({ theme }) => theme.colors.gray100};
    border-radius: 8px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .detail {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  span {
    text-align: right;
    color: ${({ theme }) => theme.colors.gray1000};
  }
`;

const Border = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const ToggleWrapper = styled.div`
  padding: 6px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray700};
    pointer-events: none;
  }
`;
