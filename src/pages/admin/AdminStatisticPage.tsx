import styled from 'styled-components';
import { useState } from 'react';
import { StatisticsSection } from '@/components/admin/statistics/StatisticsSection';
import { RecordSection } from '@/components/admin/statistics/RecordSection';

export const AdminStatisticPage = () => {
  const [showStatistics, setShowStatistics] = useState(false);

  return (
    <Container>
      <StatisticsSection
        showStatistics={showStatistics}
        onToggle={() => setShowStatistics(!showStatistics)}
      />

      <RecordSection />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;

  .title {
    display: flex;
    align-items: center;
    gap: 12px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head30};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .sub {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.head26};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .filters {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
