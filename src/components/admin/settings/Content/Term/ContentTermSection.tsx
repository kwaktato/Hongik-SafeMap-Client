import styled from 'styled-components';
import Delete from '@/assets/icons/TrashCan.svg?react';
import type { TermSection } from '@/types/Term';

interface ContentTermSectionProps {
  term: TermSection;
  canDelete: boolean;
  onUpdate: (id: number, title: string, content: string) => void;
  onDelete: (id: number) => void;
  autoFocus?: boolean;
}

export const ContentTermSection = ({
  term,
  canDelete,
  onUpdate,
  onDelete,
  autoFocus,
}: ContentTermSectionProps) => {
  return (
    <ContentTermWrapper>
      <div className="top">
        <Title
          value={term.header}
          placeholder="조항 제목 (예: 제1조 목적)"
          onChange={(e) => onUpdate(term.id ?? 0, e.target.value, term.content)}
          autoFocus={autoFocus}
        />

        {canDelete && (
          <div className="delete" onClick={() => onDelete(term.id ?? 0)}>
            <Delete />
          </div>
        )}
      </div>

      <Content
        placeholder="조항 내용을 입력하세요."
        value={term.content}
        onChange={(e) => onUpdate(term.id ?? 0, term.header, e.target.value)}
      />
    </ContentTermWrapper>
  );
};

const ContentTermWrapper = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .delete {
    cursor: pointer;
  }

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.red600};
  }
`;

const Title = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:hover,
  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.colors.gray800};
    border: 1px solid ${({ theme }) => theme.colors.gray700};
  }
`;

const Content = styled.textarea`
  padding: 10px 16px;
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  resize: none;
  box-sizing: border-box;
  border: none;
  word-break: break-all;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:hover,
  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.colors.gray800};
    border: 1px solid ${({ theme }) => theme.colors.gray700};
  }

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
    border: 4px solid ${({ theme }) => theme.colors.gray300};
  }

  & {
    scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
  }
`;
