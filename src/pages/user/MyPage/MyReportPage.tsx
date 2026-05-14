import styled from 'styled-components';
import { useState } from 'react';
import { NavBar } from '@/components/common/NavBar';
import Exit from '@/assets/icons/Exit.svg?react';
import { useGetMyReports } from '@/api/mypage';
import { UserReportCard } from '@/components/user/mypage/UserReportCard';
import { Pagination } from '@/components/common/Pagination';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { PageableRequest } from '@/types/Pageable';

export const MyReportPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [currentPage, setCurrentPage] = useState(0);

  const pageable: PageableRequest = {
    page: currentPage,
    size: 5,
  };

  const { data: report } = useGetMyReports(pageable);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

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

      {report && report.totalPages > 1 && (
        <Pagination
          currentPage={report.currentPage}
          totalPages={report.totalPages}
          onPageChange={handlePageChange}
          isFirst={report.first}
          isLast={report.last}
        />
      )}
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

  .pagination {
    padding: 12px 0px;
  }
`;

const NavCenter = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;
