import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Down from '@/assets/icons/FilterDown.svg?react';

interface DropdownStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (currentValue: string) => void;
}

export const DropdownStatus = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
  ...props
}: DropdownStatusProps) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleOutsideClick = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelectOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(value);
    setShowOptions(false);
  };

  const dropdownLabel = selectedOption.length > 0 ? selectedOption : title;

  return (
    <DropdownWrapper ref={selectRef}>
      <DropdownHeader
        isSelected={selectedOption !== ''}
        {...props}
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <div>{dropdownLabel}</div>
        <Down />
      </DropdownHeader>

      {showOptions && (
        <DropdownOptionWrapper>
          {options.map((option) => (
            <DropdownOption
              key={option}
              onClick={(e) => handleSelectOption(option, e)}
              isSelected={selectedOption.includes(option)}
            >
              {option}
            </DropdownOption>
          ))}
        </DropdownOptionWrapper>
      )}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  width: 88px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DropdownHeader = styled.div<{ isSelected: boolean }>`
  padding: 6px 8px 6px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.gray1000 : theme.colors.gray600};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray600};
    pointer-events: none;
  }
`;

const DropdownOptionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  position: absolute;
  top: 36px;
  z-index: 1;
`;

const DropdownOption = styled.div<{
  isSelected: boolean;
}>`
  padding: 8px 16px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.red600 : theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.red600};
    background: ${({ theme }) => theme.colors.red100};
  }
`;
