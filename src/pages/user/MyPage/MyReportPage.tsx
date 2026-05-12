import styled from 'styled-components';
import { NavBar } from '@/components/common/NavBar';
import Exit from '@/assets/icons/Exit.svg?react';
import { useGetMyReports } from '@/api/mypage';
import { UserReportCard } from '@/components/user/mypage/UserReportCard';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { PageableRequest } from '@/types/Pageable';

export const MyReportPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const pageable: PageableRequest = {
    page: 0,
    size: 100,
  };

  const { data: report } = useGetMyReports(pageable);

  return (
    <Container>
      <NavBar
        center={<NavCenter>내 제보</NavCenter>}
        right={<Exit onClick={handleGoBack} />}
      />

      <div className="count">총 {report?.totalElements ?? 0}개의 제보</div>

      {report?.reports.map((report) => (
        <UserReportCard key={report.id} report={report} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  margin: 76px 20px 20px 20px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  .count {
    margin-top: 13px;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const NavCenter = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;
