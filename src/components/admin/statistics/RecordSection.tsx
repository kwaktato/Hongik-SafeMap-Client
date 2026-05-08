import styled from 'styled-components';
import { useMemo, useState } from 'react';
import Calender from '@/assets/icons/CalenderXS.svg';
import Reset from '@/assets/icons/ResetS.svg?react';
import { useAdminDisasterRecords, useAdminDisasterType } from '@/api/admin';
import { AdminRecordCard } from '@/components/admin/statistics/AdminRecordCard';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';
import type { RiskLevel } from '@/types/common';
import type { DisasterRecordsParams } from '@/types/Admin';

export const RecordSection = () => {
  const [selectedRisk, setSelectedRisk] = useState<string[]>(['전체']);
  const [selectedType, setSelectedType] = useState<string>('모든 유형');
  const { data: disasters } = useAdminDisasterType();
  const disasterTypes = disasters?.map((type) => type.name) ?? [];

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const params: DisasterRecordsParams = useMemo(
    () => ({
      page: 0,
      size: 100,
      riskLevels: selectedRisk.includes('전체')
        ? undefined
        : (selectedRisk as RiskLevel[]),
      from: startDate || undefined,
      to: endDate || undefined,
    }),
    [selectedRisk, startDate, endDate],
  );

  const { data: records } = useAdminDisasterRecords(params);

  const filteredRecords = useMemo(() => {
    if (!records?.disasterRecords) return [];

    if (selectedType === '모든 유형') return records.disasterRecords;

    return records.disasterRecords.filter(
      (record) => record.disasterType.name === selectedType,
    );
  }, [records, selectedType]);

  return (
    <RecordWrapper>
      <div className="title">
        <div>재난 기록</div>
        <div className="sub">{records?.totalElements}건</div>
      </div>

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
          options={['모든 유형', ...disasterTypes]}
          selectedOption={selectedType}
          setSelectedOption={setSelectedType}
          style={{ width: '160px' }}
        />

        <Dropdown
          title="위험도"
          options={['전체', '긴급', '높음', '보통', '낮음']}
          selectedOption={selectedRisk}
          setSelectedOption={setSelectedRisk}
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
            setSelectedRisk(['전체']);
            setSelectedType('모든 유형');
          }}
        >
          <Reset />
          <span>초기화</span>
        </Button>
      </div>

      <div className="records">
        {filteredRecords.map((record) => (
          <AdminRecordCard record={record} />
        ))}
      </div>
    </RecordWrapper>
  );
};

const RecordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .records {
    display: grid;
    align-items: flex-start;
    gap: 20px;

    grid-template-columns: repeat(1, 1fr);

    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
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
