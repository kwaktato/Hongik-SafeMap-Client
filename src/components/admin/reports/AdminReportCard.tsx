import styled from 'styled-components';
import { useState } from 'react';
import ChevronUp from '@/assets/icons/ChevronUp.svg?react';
import ChevronDown from '@/assets/icons/ChevronDown.svg?react';
import { ReportSection } from '@/components/admin/reports/ReportSection';
import { ReviewSection } from '@/components/admin/reports/ReviewSection';
import type { AdminReport } from '@/types/Admin';

interface AdminReportCardProps {
  report: AdminReport;
}

export const AdminReportCard = ({ report }: AdminReportCardProps) => {
  const [showReviewBox, setShowReviewBox] = useState(false);

  return (
    <Container>
      <ReportSection report={report} />

      {showReviewBox && <ReviewSection report={report} />}

      <Border />

      <ToggleWrapper onClick={() => setShowReviewBox((prev) => !prev)}>
        <div>{showReviewBox ? '접기' : '상세보기'}</div>
        {showReviewBox ? <ChevronUp /> : <ChevronDown />}
      </ToggleWrapper>
    </Container>
  );
};

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
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
