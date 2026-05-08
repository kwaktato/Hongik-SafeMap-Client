import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import ChevronUp from '@/assets/icons/ChevronUp.svg?react';
import ChevronDown from '@/assets/icons/ChevronDown.svg?react';
import { CheckBox } from '@/components/common/CheckBox';

type DropdownOptionType = string | { option: React.ReactNode; value: string };

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  options: DropdownOptionType[];
  selectedOption: string | string[];
  setSelectedOption: (currentValue: any) => void;
  variant?: 'default' | 'icon';
  isMulti?: boolean;
}

export const Dropdown = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
  variant = 'default',
  isMulti = false,
  ...props
}: DropdownProps) => {
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

    if (isMulti && Array.isArray(selectedOption)) {
      if (value === '전체') {
        setSelectedOption([value]);
      } else {
        const filtered = selectedOption.filter((v) => v !== '전체');
        const nextValue = filtered.includes(value)
          ? filtered.filter((v) => v !== value)
          : [...filtered, value];

        setSelectedOption(nextValue.length === 0 ? ['전체'] : nextValue);
      }
    } else {
      setSelectedOption(value);
      setShowOptions(false);
    }
  };

  const getDropdownLabel = () => {
    if (isMulti && Array.isArray(selectedOption)) {
      if (selectedOption.length === 0 || selectedOption.includes('전체'))
        return title;
      if (selectedOption.length === 1) return selectedOption[0];
      return `${selectedOption[0]} 외 ${selectedOption.length - 1}개`;
    }
    return (selectedOption as string) || title;
  };

  return (
    <DropdownWrapper ref={selectRef}>
      <DropdownHeader
        isSelected={isMulti ? selectedOption.length > 0 : selectedOption !== ''}
        onClick={() => setShowOptions((prev) => !prev)}
        {...props}
      >
        <div>{getDropdownLabel()}</div>
        {showOptions ? <ChevronUp /> : <ChevronDown />}
      </DropdownHeader>

      {showOptions && (
        <DropdownOptionWrapper>
          {options.map((option) => {
            const isString = typeof option === 'string';
            const optionValue = isString ? option : option.value;
            const optionLabel = isString ? option : option.option;
            const isSelected =
              isMulti && Array.isArray(selectedOption)
                ? selectedOption.includes(optionValue)
                : selectedOption === optionValue;

            return (
              <DropdownOption
                key={optionValue}
                onClick={(e) => handleSelectOption(optionValue, e)}
                variant={variant}
                isSelected={isSelected}
              >
                {optionLabel}
                <div style={{ pointerEvents: 'none' }}>
                  <CheckBox checked={isSelected} readOnly />
                </div>
              </DropdownOption>
            );
          })}
        </DropdownOptionWrapper>
      )}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
`;

const DropdownHeader = styled.div<{ isSelected: boolean }>`
  padding: 4px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.gray1000 : theme.colors.gray600};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray600};
    pointer-events: none;
  }
`;

const DropdownOptionWrapper = styled.div`
  width: 100%;
  // max-height: 160px;
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
  top: 50px;
  z-index: 1;
`;

const DropdownOption = styled.div<{
  variant: 'default' | 'icon';
  isSelected: boolean;
}>`
  padding: ${({ variant }) =>
    variant === 'default' ? '13px 20px' : '11px 16px'};
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.red600 : theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.red600};
    background: ${({ theme }) => theme.colors.red100};
  }
`;
