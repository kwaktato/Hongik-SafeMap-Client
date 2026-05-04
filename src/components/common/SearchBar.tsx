import styled from 'styled-components';
import Search from '@/assets/icons/SearchS.svg?react';
import Close from '@/assets/icons/TextRemove.svg?react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSearch: () => void;
  placeholder: string;
  width?: string;
  iconPosition?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onClear,
  onSearch,
  placeholder,
  width = '100%',
  iconPosition = 'right',
}: SearchBarProps) => {
  return (
    <SearchBarWrapper width={width}>
      {iconPosition === 'left' && (
        <div className="left">
          <Search onClick={onSearch} />
        </div>
      )}

      <SearchBarInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        iconPosition={iconPosition}
      />

      <div className="right">
        {value && <Close onClick={onClear} />}
        {iconPosition === 'right' && <Search onClick={onSearch} />}
      </div>
    </SearchBarWrapper>
  );
};

const SearchBarWrapper = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  position: relative;

  .left {
    position: absolute;
    top: 10px;
    left: 12px;
  }

  .right {
    display: flex;
    gap: 2px;
    align-items: center;

    position: absolute;
    top: 10px;
    right: 12px;
  }

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const SearchBarInput = styled.input<{ iconPosition: string }>`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: ${({ iconPosition }) =>
    iconPosition === 'left' ? '10px 40px' : '10px 64px 10px 12px'};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }
`;
