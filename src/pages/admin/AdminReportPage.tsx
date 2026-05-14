import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useAdminReports } from '@/api/admin';
import { AdminReportCard } from '@/components/admin/reports/AdminReportCard';
import { SearchBar } from '@/components/common/SearchBar';
import { Dropdown } from '@/components/common/Dropdown';
import { Pagination } from '@/components/common/Pagination';
import type { AdminReportParams } from '@/types/Admin';
import type { DisasterReportStatus } from '@/types/common';

export const AdminReportPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['전체 제보']);

  const getStatusParams = (
    selectedOptions: string[],
  ): DisasterReportStatus[] | undefined => {
    if (selectedOptions.includes('전체 제보') || selectedOptions.length === 0) {
      return undefined;
    }
    return selectedOptions as DisasterReportStatus[];
  };

  const params: AdminReportParams = useMemo(
    () => ({
      page: currentPage,
      size: 6,
      statuses: getStatusParams(selectedStatus),
    }),
    [selectedStatus, currentPage],
  );
  const { data } = useAdminReports(params);

  const filteredReports = useMemo(() => {
    let reports = data?.reports || [];

    if (searchTerm) {
      reports = reports.filter(
        (report) =>
          report.description.includes(searchTerm) ||
          report.disasterType.name.includes(searchTerm) ||
          report.reviewComment.includes(searchTerm),
      );
    }

    return reports;
  }, [searchTerm, selectedStatus, data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 100);
  };

  return (
    <Container>
      <div className="top">
        <SearchBar
          placeholder="검색할 제보의 제목을 입력해주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          onSearch={() => setCurrentPage(0)}
          width="560px"
        />

        <Dropdown
          title="전체 제보"
          options={[
            '전체 제보',
            '승인',
            '블라인드',
            '검토대기',
            '검증됨',
            'AI 신뢰도 의심',
          ]}
          selectedOption={selectedStatus}
          setSelectedOption={setSelectedStatus}
          style={{ width: '180px' }}
          isMulti={true}
        />
      </div>

      <div className="reports">
        {filteredReports?.map((report) => (
          <AdminReportCard report={report} />
        ))}
      </div>

      {data && data.totalPages > 0 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          isFirst={data.first}
          isLast={data.last}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;

  .top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .reports {
    display: grid;
    align-items: start;
    gap: 20px;

    grid-template-columns: repeat(1, 1fr);

    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1600px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
