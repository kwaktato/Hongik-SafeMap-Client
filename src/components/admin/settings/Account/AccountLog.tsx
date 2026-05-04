import styled from 'styled-components';
import { useState } from 'react';
import { useAdminActivityLogs } from '@/api/admin';
import { Button } from '@/components/common/Button';
import type { PageableRequest } from '@/types/Pageable';
import { formatDashDate } from '@/utils/formatDate';

export const AccountLog = () => {
  const pageable: PageableRequest = {
    page: 0,
    size: 100,
  };

  const { data } = useAdminActivityLogs(pageable);

  const [showAll, setShowAll] = useState(false);

  const logs = showAll ? data?.logs : data?.logs.slice(0, 3);

  return (
    <Container>
      {logs?.slice(0, 3).map((log, index) => (
        <div key={log.id}>
          <Section>
            <div className="description">{log.description}</div>
            <div className="date">{formatDashDate(log.createdAt, true)}</div>
          </Section>

          {index !== logs.length - 1 && <Border />}
        </div>
      ))}

      <Button variant="black" onClick={() => setShowAll((prev) => !prev)}>
        {showAll ? '접기' : '전체 로그 보기'}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 24px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
`;

const Section = styled.div`
  padding: 8px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .description {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .date {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Border = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;
