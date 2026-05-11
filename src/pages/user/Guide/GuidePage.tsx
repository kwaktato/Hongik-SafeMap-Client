import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import Bookmark from '@/assets/icons/BookmarkDisactiveS.svg?react';
import { useSafetyTipSummary } from '@/api/safetyTips';
import { TitleHeader } from '@/components/common/TitleHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { GuideCard } from '@/components/user/guide/GuideCard';
import { Tag } from '@/components/common/Tag';

export const GuidePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('safety_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data } = useSafetyTipSummary();

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem('safety_favorites');

    if (saved) {
      setFavorites(JSON.parse(saved));
    } else {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('safety_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredGuides = useMemo(() => {
    let guides = data;

    if (showFavoritesOnly) {
      guides = guides?.filter((guide) => favorites.includes(guide.id));
    }

    if (searchTerm) {
      guides = guides?.filter(
        (guide) =>
          guide.title.includes(searchTerm) || guide.detail.includes(searchTerm),
      );
    }

    return guides;
  }, [searchTerm, showFavoritesOnly, data]);

  return (
    <Container>
      <TitleHeader
        mainTitle="유형별 행동 요령"
        subTitle="재난 상황에서 안전을 지키는 필수 행동 지침을 확인하세요"
      />

      <SearchBar
        placeholder="행동 요령 검색"
        value={searchTerm}
        onSearch={() => setSearchTerm(searchTerm)}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        iconPosition="left"
      />

      <Tag
        variant={showFavoritesOnly ? 'red' : 'white'}
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        style={{
          width: '84px',
          height: '20px',
          padding: '6px 4px 6px 8px',
        }}
      >
        북마크만 보기
        <Bookmark />
      </Tag>

      <CardWrapper>
        {filteredGuides?.map((guide) => {
          const isFavorite = favorites.includes(guide.id);

          return (
            <GuideCard
              key={guide.id}
              guide={guide}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          );
        })}
      </CardWrapper>
    </Container>
  );
};

const Container = styled.div`
  margin: 72px 20px;

  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const CardWrapper = styled.div`
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
