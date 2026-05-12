import styled from 'styled-components';
import { useMemo, useRef, useState } from 'react';
import Up from '@/assets/icons/StatisticsUp.svg?react';
import Down from '@/assets/icons/StatisticsDown.svg?react';
import Calender from '@/assets/icons/CalenderXS.svg';
import Reset from '@/assets/icons/ResetS.svg?react';
import Download from '@/assets/icons/DownloadS.svg?react';
import { useAdminDisasterStatistics, useAdminDisasterType } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { StatisticsGraph } from '@/components/admin/statistics/StatisticsGraph';
import { StatisticsPieGraph } from '@/components/admin/statistics/StatisticsPieGraph';
import type { DisasterStatisticsParams } from '@/types/Admin';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StatisticsSectionProps {
  showStatistics: boolean;
  onToggle: () => void;
}

export const StatisticsSection = ({
  showStatistics,
  onToggle,
}: StatisticsSectionProps) => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedType, setSelectedType] = useState<string[]>(['전체']);
  const { data: disasters } = useAdminDisasterType();
  const disasterTypes = disasters?.map((t) => t.name) ?? [];

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const params: DisasterStatisticsParams = useMemo(
    () => ({
      disasterTypeIds: selectedType.includes('모든 유형')
        ? undefined
        : disasters
            ?.filter((d) => selectedType.includes(d.name))
            .map((d) => d.id),
      from: startDate || undefined,
      to: endDate || undefined,
    }),
    [selectedType, startDate, endDate, disasters],
  );

  const { data: statistics } = useAdminDisasterStatistics(params);

  const chartData = useMemo(() => {
    if (!statistics?.disasterTypeStats) return [];

    return statistics.disasterTypeStats.map((item) => ({
      name: item.disasterType.name,
      groupCount: statistics.totalGroupCount,
      reportCount: item.reportCount,
    }));
  }, [statistics]);

  const pieData = useMemo(() => {
    if (!statistics?.riskLevelDistribution) return [];

    const labelMap: Record<string, string> = {
      긴급: '매우 심각',
      높음: '심각',
      보통: '보통',
      낮음: '낮음',
    };

    const colorMap: Record<string, string> = {
      긴급: '#D4182E',
      높음: '#E57482',
      보통: '#B0B3BA',
      낮음: '#EEEFF1',
    };

    return statistics.riskLevelDistribution.map((item) => ({
      name: labelMap[item.riskLevel] || item.riskLevel,
      value: item.reportCount,
      fill: colorMap[item.riskLevel] || '#94A3B8',
    }));
  }, [statistics]);

  const handleExportPDF = async () => {
    if (!statsRef.current) return;

    setIsExporting(true);

    try {
      const element = statsRef.current;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const originalPadding = element.style.padding;
      element.style.padding = '40px';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => {
          return el.tagName === 'BUTTON' || el.classList.contains('no-pdf');
        },
      });

      element.style.padding = originalPadding;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`재난통계_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 파일을 생성하는 도중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <StatisticsWrapper>
      <div className="top" onClick={onToggle}>
        <div className="title">재난 통계</div>
        {showStatistics ? <Up /> : <Down />}
      </div>

      {showStatistics && (
        <Statistics ref={statsRef}>
          <div className="top">
            <div className="filters">
              <div className="date">
                <DateLabel>
                  <img src={Calender} alt="calendar" />
                  <DateInput
                    type="date"
                    value={startDate}
                    isSelected={startDate !== ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </DateLabel>
                <span>~</span>
                <DateLabel>
                  <img src={Calender} alt="calendar" />
                  <DateInput
                    type="date"
                    value={endDate}
                    isSelected={endDate !== ''}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </DateLabel>
              </div>

              <Dropdown
                title="모든 유형"
                options={['전체', ...disasterTypes]}
                selectedOption={selectedType}
                setSelectedOption={setSelectedType}
                style={{ width: '160px' }}
                isMulti={true}
              />

              <Button
                variant="white"
                width="100px"
                height="46px"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSelectedType(['모든 유형']);
                }}
              >
                <Reset />
                <span>초기화</span>
              </Button>
            </div>

            <Button
              variant="black"
              width="168px"
              disabled={isExporting}
              onClick={handleExportPDF}
            >
              <Download />
              <span>pdf 내보내기</span>
            </Button>
          </div>

          <BoxWrapper>
            <div className="box-title">통계 요약</div>
            <div className="row16">
              <SummaryItem
                label="총 재난 기록"
                value={`${statistics?.totalGroupCount ?? 0}건`}
              />
              <SummaryItem
                label="총 제보 수"
                value={`${statistics?.totalReportCount ?? 0}건`}
              />
              <SummaryItem
                label="평균 제보 수"
                value={`${statistics?.averageReportsPerGroup ?? 0}건`}
              />
              <SummaryItem
                label="가장 많은 유형"
                value={statistics?.mostFrequentDisasterType?.name ?? ''}
              />
            </div>
          </BoxWrapper>

          <div className="row16">
            <BoxWrapper style={{ width: '100%' }}>
              <div className="box-title">
                재난 유형별 발생 빈도
                <div className="box-sub">
                  <GraphDetailItem>
                    <div className="dot red" /> 발생 건수
                  </GraphDetailItem>
                  <GraphDetailItem>
                    <div className="dot gray" />총 제보 수
                  </GraphDetailItem>
                </div>
              </div>
              <StatisticsGraph data={chartData} />
            </BoxWrapper>

            <BoxWrapper style={{ width: '100%' }}>
              <div className="box-title">심각도 분포</div>
              <StatisticsPieGraph data={pieData} />
            </BoxWrapper>
          </div>
        </Statistics>
      )}
    </StatisticsWrapper>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <SummaryItemWrapper>
    {label} <div className="count">{value}</div>
  </SummaryItemWrapper>
);

const StatisticsWrapper = styled.div`
  padding: 20px 0px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray400};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};

  svg {
    cursor: pointer;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const DateLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 16px;
    z-index: 1;
    pointer-events: none;
  }
`;

const DateInput = styled.input<{ isSelected: boolean }>`
  padding: 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  outline: none;
  cursor: pointer;

  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.gray1000 : theme.colors.gray600};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.gray600};
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
`;

const Statistics = styled.div`
  padding: 24px 0px 10px 0px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .column24 {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .row16 {
    display: flex;
    gap: 16px;
  }
`;

const BoxWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};

  .box-title {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .box-sub {
    display: flex;
    align-items: center;
    gap: 14px;
  }
`;

const SummaryItemWrapper = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body18};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .count {
    color: ${({ theme }) => theme.colors.red600};
    font-size: ${({ theme }) => theme.font.fontSize.head38};
  }
`;

const GraphDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    &.red {
      background: ${({ theme }) => theme.colors.red600};
    }
    &.gray {
      background: ${({ theme }) => theme.colors.gray500};
    }
  }
`;
