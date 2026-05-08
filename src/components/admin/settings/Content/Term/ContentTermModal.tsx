import styled from 'styled-components';
import { useState } from 'react';
import ModalClose from '@/assets/icons/Exit.svg?react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { Button } from '@/components/common/Button';
import { ContentTermSection } from '@/components/admin/settings/Content/Term/ContentTermSection';

export interface TermItem {
  id: number;
  title: string;
  content: string;
}

interface ContentTermModalProps {
  onClose: () => void;
  title: string;
  initialTerms: TermItem[];
  onSave: (terms: TermItem[]) => void;
}

export const ContentTermModal = ({
  onClose,
  title,
  initialTerms,
  onSave,
}: ContentTermModalProps) => {
  const [terms, setTerms] = useState<TermItem[]>(initialTerms);

  const handleUpdate = (id: number, newTitle: string, newContent: string) => {
    setTerms((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: newTitle, content: newContent } : t,
      ),
    );
  };

  const handleDelete = (id: number) => {
    if (terms.length <= 1) return;
    setTerms((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdd = () => {
    const newId =
      terms.length > 0 ? Math.max(...terms.map((t) => t.id)) + 1 : 1;
    setTerms([...terms, { id: newId, title: '', content: '' }]);
  };

  return (
    <ModalWrapper>
      <div className="top">
        <div>{title}</div>
        <ModalClose onClick={onClose} />
      </div>

      <div className="terms">
        {terms.map((term) => (
          <ContentTermSection
            key={term.id}
            term={term}
            canDelete={terms?.length > 1}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Button variant="white" style={{ flexShrink: '0' }} onClick={handleAdd}>
        <Plus />
        <span>새로운 조항 추가</span>
      </Button>

      <Button
        variant="red"
        style={{ flexShrink: '0' }}
        onClick={() => onSave(terms)}
      >
        저장
      </Button>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 600px;
  max-height: 75vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  svg {
    cursor: pointer;
  }

  .terms {
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;

    /* 1. 전체 스크롤바 너비 */
    &::-webkit-scrollbar {
      width: 12px;
    }

    /* 2. 스크롤바 트랙 (바탕) */
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    /* 3. 스크롤바 막대 (움직이는 부분) */
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.gray500};
      border-radius: 12px;
      border: 4px solid ${({ theme }) => theme.colors.white};
    }

    & {
      scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
    }
  }
`;
