import styled from 'styled-components';
import { useState } from 'react';
import { NavBar } from '@/components/common/NavBar';
import Exit from '@/assets/icons/Exit.svg?react';
import { useGetMyMissingReports } from '@/api/mypage';
import { PostCard } from '@/components/user/board/PostCard';
import { Pagination } from '@/components/common/Pagination';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { PageableRequest } from '@/types/Pageable';

export const MyMissingPostPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [currentPage, setCurrentPage] = useState(0);

  const pageable: PageableRequest = {
    page: currentPage,
    size: 5,
  };

  const { data } = useGetMyMissingReports(pageable);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Container>
      <NavBar
        center={<NavCenter>내 실종 게시글</NavCenter>}
        right={<Exit onClick={handleGoBack} />}
      />

      <div className="count">총 {data?.totalElements ?? 0}개의 게시글</div>

      <PostWrapper>
        {data?.reports.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </PostWrapper>

      {data && data.totalPages > 1 && (
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

const PostWrapper = styled.div`
  display: grid;
  gap: 8px;

  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
