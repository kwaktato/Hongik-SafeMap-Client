import styled from 'styled-components';
import Gragh from '@/assets/icons/GraghS.svg?react';
import Search from '@/assets/icons/SearchS.svg?react';
import User from '@/assets/icons/UserS.svg?react';
import Warning from '@/assets/icons/WarningS.svg?react';
import Hide from '@/assets/icons/HideS.svg?react';
import { useAdminDashboard } from '@/api/admin';
import { StatusCard } from '@/components/admin/dashboard/StatusCard';
import { RecentReportCard } from '@/components/admin/dashboard/RecentReportCard';

export const AdminDashboardPage = () => {
  const { data } = useAdminDashboard();

  return (
    <Container>
      <StatusWrapper>
        <StatusCard
          title="총 제보 수"
          status="전체 등록된 제보"
          count={data?.totalReports ?? 0}
          icon={<Gragh />}
          variant={'red'}
        />
        <StatusCard
          title="검토 대기"
          status="관리자가 검토하지 않은 제보"
          count={data?.falseReports ?? 0}
          icon={<Search />}
          variant={'gray'}
        />
        <StatusCard
          title="총 사용자"
          status="전체 등록된 제보"
          count={data?.totalUsers ?? 0}
          icon={<User />}
          variant={'darkGray'}
        />
        <StatusCard
          title="신뢰도 의심"
          status="자동 감지된 의심 제보"
          count={data?.suspiciousReports ?? 0}
          icon={<Warning />}
          variant={'gray'}
        />
        <StatusCard
          title="블라인드 처리"
          status="관리자가 블라인드 처리한 제보"
          count={data?.blindedReports ?? 0}
          icon={<Hide />}
          variant={'gray'}
        />
        <StatusCard
          title="공신력 사용자"
          status={`총 ${data?.credibleUsers}명 중`}
          count={data?.credibleUsers ?? 0}
          icon={<></>}
          variant={'lightGray'}
        />
      </StatusWrapper>

      <RecentWrpper>
        <div className="text">
          <div className="title">최근 활동</div>
          <div className="detail">
            최근 등록된 제보 및 주요 이벤트를 확인할 수 있습니다.
          </div>
        </div>

        <div className="report">
          {data?.recentReports.map((report) => (
            <RecentReportCard report={report} />
          ))}
        </div>
      </RecentWrpper>

      <Authorization>
        <span>관리자 권한</span>
        <div>
          이 페이지는 관리자만 접근할 수 있습니다. 제보 검토 및 사용자 관리
          기능을 통해 시스템의 신뢰성을 유지할 수 있습니다.
        </div>
      </Authorization>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusWrapper = styled.div`
  display: grid;
  gap: 20px;

  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 892px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1264px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RecentWrpper = styled.div`
  margin-top: 68px;
  margin-bottom: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  .text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head30};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .detail {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .report {
    display: grid;
    gap: 20px;

    grid-template-columns: repeat(1, 1fr);

    @media (min-width: 892px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1264px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const Authorization = styled.div`
  padding: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.blue100};

  color: ${({ theme }) => theme.colors.blue600};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  span {
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;
