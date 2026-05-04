import styled from 'styled-components';
import { NavBar } from '@/components/common/NavBar';
import Exit from '@/assets/icons/Exit.svg?react';
import { useGetMyReports } from '@/api/mypage';
import { UserReportCard } from '@/components/user/mypage/UserReportCard';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { PageableRequest } from '@/types/Pageable';
// import type { ReportBase } from '@/types/Report';

export const MyReportPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const pageable: PageableRequest = {
    page: 0,
    size: 100,
  };

  const { data: report } = useGetMyReports(pageable);

  // const dummyReports: ReportBase[] = [
  //   {
  //     id: 1,
  //     disasterType: '화재',
  //     riskLevel: '긴급',
  //     disasterDescription:
  //       '서울시 강남구 소재 아파트에서 화재 발생, 대피 권고 중',
  //     address: '서울특별시 강남구 역삼동 123-45',
  //     status: '검토대기',
  //     createdAt: '2026-03-20T19:30:00Z',
  //   },
  //   {
  //     id: 2,
  //     disasterType: '홍수',
  //     riskLevel: '높음',
  //     disasterDescription: '부산 해운대구 일대 많은 비로 침수 피해 발생',
  //     address: '부산광역시 해운대구 우동 678-90',
  //     status: '승인',
  //     createdAt: '2026-03-19T15:45:00Z',
  //   },
  //   {
  //     id: 3,
  //     disasterType: '지진',
  //     riskLevel: '보통',
  //     disasterDescription: '경북 포항 인근 지진 발생, 인명 피해는 없는 상태',
  //     address: '경상북도 포항시 북구 12-34',
  //     status: '블라인드',
  //     createdAt: '2026-03-18T10:00:00Z',
  //   },
  //   {
  //     id: 4,
  //     disasterType: '태풍',
  //     riskLevel: '낮음',
  //     disasterDescription: '제주도 인근 태풍 이동 중, 큰 피해 없을 전망',
  //     address: '제주특별자치도 제주시 56-78',
  //     status: '허위정보',
  //     createdAt: '2026-03-17T23:00:00Z',
  //   },
  // ];

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
