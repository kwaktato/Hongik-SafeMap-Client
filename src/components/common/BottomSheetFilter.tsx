import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Reset from '@/assets/icons/ResetS.svg?react';
import { Button } from '@/components/common/Button';
import { CheckBox } from '@/components/common/CheckBox';
import type { Filter, FilterState } from '@/types/common';

interface BottomSheetFilterProps {
  isOpen: boolean;
  onClose: () => void;
  height: string;
  filter: Filter;
  initialValue: FilterState;
  defaultTab: string;
  onApply: (val: FilterState) => void;
}

export const BottomSheetFilter = ({
  isOpen,
  onClose,
  height,
  filter,
  initialValue,
  defaultTab,
  onApply,
}: BottomSheetFilterProps) => {
  if (!isOpen) return null;

  const [tempFilters, setTempFilters] = useState(initialValue);
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(initialValue);
      setActiveTab(defaultTab);
    }
  }, [isOpen, initialValue, defaultTab]);

  const handleToggle = (option: string) => {
    setTempFilters((prev) => {
      const current = prev[activeTab];

      if (option === '전체') return { ...prev, [activeTab]: ['전체'] };

      let next = current.includes(option)
        ? current.filter((i) => i !== option)
        : [...current.filter((i) => i !== '전체'), option];

      return { ...prev, [activeTab]: next.length === 0 ? ['전체'] : next };
    });
  };

  const handleReset = () => {
    setTempFilters(
      Object.keys(filter).reduce(
        (acc, key) => ({ ...acc, [key]: ['전체'] }),
        {},
      ),
    );
  };

  const hasSelectedData = (tabKey: string) => {
    const selectedOption = tempFilters[tabKey];
    return selectedOption.length > 0 && !selectedOption.includes('전체');
  };

  return (
    <SheetBackground onClick={onClose}>
      <SheetContainer height={height} onClick={(e) => e.stopPropagation()}>
        <Tabs>
          {Object.entries(filter).map(([key, value]) => (
            <TabItem
              key={key}
              active={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {value.tabLabel}
              {hasSelectedData(key) && <Dot />}
            </TabItem>
          ))}
        </Tabs>

        <Border />

        <Options>
          {filter[activeTab].items.map((item) => (
            <OptionItem
              key={item.label}
              isSelected={tempFilters[activeTab].includes(item.label)}
              isAll={item.label === '전체'}
              onClick={() => handleToggle(item.label)}
            >
              <div className="item">
                {item.icon && item.icon}
                {item.label}
              </div>
              <div style={{ pointerEvents: 'none' }}>
                <CheckBox
                  checked={tempFilters[activeTab].includes(item.label)}
                  readOnly
                />
              </div>
            </OptionItem>
          ))}
        </Options>

        <Buttons>
          <Button variant="white" onClick={handleReset}>
            <Reset />
            <span>전체 초기화</span>
          </Button>
          <Button variant="red" onClick={() => onApply(tempFilters)}>
            적용하기
          </Button>
        </Buttons>
      </SheetContainer>
    </SheetBackground>
  );
};

const SheetBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 10;
  display: flex;
  align-items: flex-end;
`;

const SheetContainer = styled.div<{ height: string }>`
  width: 100%;
  height: ${({ height }) => height};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Tabs = styled.div`
  padding: 20px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TabItem = styled.div<{ active: boolean }>`
  display: flex;
  gap: 2px;
  cursor: pointer;
  color: ${({ theme, active }) =>
    active ? theme.colors.gray1000 : theme.colors.gray600};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const Dot = styled.div`
  margin-top: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.red600};
`;

const Border = styled.div`
  margin-bottom: 4px;
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const Options = styled.div`
  margin-bottom: 84px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
`;

const OptionItem = styled.div<{ isSelected: boolean; isAll: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ isAll, isSelected, theme }) => {
    if (isAll) return theme.colors.gray900;
    if (isSelected) return theme.colors.red600;
    return theme.colors.gray800;
  }};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme, isAll }) =>
    isAll ? theme.font.fontWeight.bold : theme.font.fontWeight.medium};

  .item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const Buttons = styled.div`
  padding: 20px;
  display: flex;
  gap: 6px;
  background: ${({ theme }) => theme.colors.white};

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
