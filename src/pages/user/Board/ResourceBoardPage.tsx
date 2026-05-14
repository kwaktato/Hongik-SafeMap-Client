import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import Down from '@/assets/icons/FilterDown.svg?react';
import ResetIcon from '@/assets/icons/FilterReset.svg?react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useResourceList } from '@/api/board';
import { RESOURCE_BOARD_FILTER } from '@/constant/Filter';
import { TitleHeader } from '@/components/common/TitleHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { PostCard } from '@/components/user/board/PostCard';
import { Pagination } from '@/components/common/Pagination';
import { BottomSheetFilter } from '@/components/common/BottomSheetFilter';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type {
  FilterState,
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from '@/types/common';
import type { ResourceParams } from '@/types/Post';

export const ResourceBoardPage = () => {
  const { handleNavigate } = useHandleNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('type');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    type: ['전체'],
    category: ['전체'],
    status: ['전체'],
  });

  const params: ResourceParams = useMemo(
    () => ({
      category:
        appliedFilters.category[0] === '전체'
          ? undefined
          : (appliedFilters.category as ResourceCategory[]),
      status:
        appliedFilters.status[0] === '전체'
          ? undefined
          : (appliedFilters.status as ResourceStatus[]),
      type:
        appliedFilters.type[0] === '전체'
          ? undefined
          : (appliedFilters.type[0] as ResourceType),
      page: currentPage,
      size: 6,
    }),
    [appliedFilters, currentPage],
  );

  const { data } = useResourceList(params);

  useEffect(() => {
    setCurrentPage(0);
  }, [appliedFilters, searchTerm]);

  const handleOpenFilter = (tabKey: string) => {
    setActiveTab(tabKey);
    setIsSheetOpen(true);
  };

  const handleReset = () => {
    setAppliedFilters({
      type: ['전체'],
      category: ['전체'],
      status: ['전체'],
    });
  };

  const filteredPost = useMemo(() => {
    const posts = data?.reports;

    if (!searchTerm) return posts;

    return posts?.filter(
      (post) =>
        post.title.includes(searchTerm) ||
        post.description.includes(searchTerm) ||
        post.memberName.includes(searchTerm) ||
        post.location.includes(searchTerm),
    );
  }, [searchTerm, data]);

  return (
    <Container>
      <TitleHeader
        mainTitle="현장별 자원 요청/공급 게시판"
        subTitle="필요한 자원을 요청하거나 제공할 수 있습니다"
      />

      <SearchBar
        placeholder="게시물 검색"
        value={searchTerm}
        onSearch={() => setSearchTerm(searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        iconPosition="left"
      />

      <FilterWrapper>
        {Object.entries(RESOURCE_BOARD_FILTER).map(([key, value]) => {
          const selectedValues = appliedFilters[key as keyof FilterState];
          let displayLabel = value.tabLabel;
          if (!selectedValues.includes('전체')) {
            displayLabel =
              selectedValues.length > 1
                ? `${selectedValues[0]} 외 ${selectedValues.length - 1}`
                : selectedValues[0];
          }

          return (
            <Filter key={key} onClick={() => handleOpenFilter(key)}>
              {displayLabel}
              <Down />
            </Filter>
          );
        })}
        <Reset onClick={handleReset}>
          <ResetIcon />
        </Reset>
      </FilterWrapper>

      <PostWrapper>
        {filteredPost?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </PostWrapper>

      {data && data.totalPages > 0 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
          isFirst={data.first}
          isLast={data.last}
        />
      )}

      <BottomSheetFilter
        height="496px"
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filter={RESOURCE_BOARD_FILTER}
        initialValue={appliedFilters}
        defaultTab={activeTab}
        onApply={(newFilters) => {
          setAppliedFilters(newFilters);
          setIsSheetOpen(false);
        }}
      />

      <WriteButton
        onClick={() => {
          handleNavigate('/user/resource/write');
        }}
      >
        <Plus />
        게시물 작성
      </WriteButton>
    </Container>
  );
};

const Container = styled.div`
  padding: 72px 20px;

  display: flex;
  flex-direction: column;
  gap: 13px;

  .pagination {
    // position: fixed;
    // bottom: 148px;
    // left: 50%;
    // transform: translateX(-50%);

    padding: 12px 0px;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Filter = styled.div`
  padding: 6px 4px 6px 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const Reset = styled.div`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
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

const WriteButton = styled.div`
  padding: 10px 18px 10px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);

  svg {
    color: ${({ theme }) => theme.colors.red600};
  }
`;
