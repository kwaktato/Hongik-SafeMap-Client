import styled from 'styled-components';
import { useMemo, useState } from 'react';
import Down from '@/assets/icons/FilterDown.svg?react';
import ResetIcon from '@/assets/icons/FilterReset.svg?react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useMissingList } from '@/api/board';
import { MISSING_BOARD_FILTER } from '@/constant/Filter';
import { TitleHeader } from '@/components/common/TitleHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { PostCard } from '@/components/user/board/PostCard';
import { BottomSheetFilter } from '@/components/common/BottomSheetFilter';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type {
  FilterState,
  MissingCategory,
  MissingStatus,
} from '@/types/common';
import type { MissingParams } from '@/types/Post';

export const MissingBoardPage = () => {
  const { handleNavigate } = useHandleNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('category');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    category: ['전체'],
    status: ['전체'],
  });

  const params: MissingParams = {
    category:
      appliedFilters.category[0] === '전체'
        ? undefined
        : (appliedFilters.category[0] as MissingCategory),
    status:
      appliedFilters.status[0] === '전체'
        ? undefined
        : (appliedFilters.status[0] as MissingStatus),
    page: 0,
    size: 10,
  };

  const { data } = useMissingList(params);

  const handleOpenFilter = (tabKey: string) => {
    setActiveTab(tabKey);
    setIsSheetOpen(true);
  };

  const handleReset = () => {
    setAppliedFilters({
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
        post.currentLocation.includes(searchTerm),
    );
  }, [searchTerm, data]);

  return (
    <Container>
      <TitleHeader
        mainTitle="잃어버린 가족/반려동물/소지품 찾기"
        subTitle="실종자 및 분실물 정보를 등록하고 제보받을 수 있습니다"
      />

      <SearchBar
        placeholder="실종/분실 정보 검색"
        value={searchTerm}
        onSearch={() => setSearchTerm(searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        iconPosition="left"
      />

      <FilterWrapper>
        {Object.entries(MISSING_BOARD_FILTER).map(([key, value]) => {
          const selectedValue = appliedFilters[key as keyof FilterState][0];
          const displayLabel =
            selectedValue === '전체' ? value.tabLabel : selectedValue;

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

      <BottomSheetFilter
        height="348px"
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filter={MISSING_BOARD_FILTER}
        initialValue={appliedFilters}
        defaultTab={activeTab}
        onApply={(newFilters) => {
          setAppliedFilters(newFilters);
          setIsSheetOpen(false);
        }}
      />

      <WriteButton
        onClick={() => {
          handleNavigate('/user/missing/write');
        }}
      >
        <Plus />
        게시물 작성
      </WriteButton>
    </Container>
  );
};

const Container = styled.div`
  margin: 72px 20px;

  display: flex;
  flex-direction: column;
  gap: 13px;
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
  // align-items: start;

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
