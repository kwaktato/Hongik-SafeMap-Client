import styled from 'styled-components';
import Next from '@/assets/icons/ChevronRight.svg?react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
  padding?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
  padding = '',
}: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <PaginationWrapper padding={padding} className="pagination">
      <MoveButton
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Next style={{ rotate: '180deg' }} />
        <span>이전</span>
      </MoveButton>

      <div className="pages">
        {pageNumbers.map((num) => (
          <PageButton
            key={num}
            active={num === currentPage}
            onClick={() => onPageChange(num)}
          >
            {num + 1}
          </PageButton>
        ))}
      </div>

      <MoveButton
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>다음</span>
        <Next />
      </MoveButton>
    </PaginationWrapper>
  );
};

const PaginationWrapper = styled.div<{ padding: string }>`
  padding: ${({ padding }) => padding};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .pages {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const PageButton = styled.button<{ active: boolean }>`
  width: 20px;
  height: 20px;
  background: ${({ theme, active }) => (active ? theme.colors.red600 : '')};
  border-radius: 50%;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const MoveButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray600 : theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  span {
    padding-top: 1px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
