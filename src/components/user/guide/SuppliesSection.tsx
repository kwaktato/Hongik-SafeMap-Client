import styled from 'styled-components';
import { useState } from 'react';
import { CheckBox } from '@/components/common/CheckBox';

interface SuppliesSectionProps {
  supplies: string[] | undefined;
}

export const SuppliesSection = ({ supplies }: SuppliesSectionProps) => {
  if (!supplies || supplies.length === 0) {
    return null;
  }

  const [checkedSupplies, setCheckedSupplies] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSupplyCheck = (key: string) => {
    setCheckedSupplies((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SectionWrapper>
      {supplies?.map((supply, index) => (
        <Supply>
          <div className="left">
            <div className="number">{index + 1}</div>
            <div className="supply">{supply}</div>
          </div>

          <CheckBox
            key={supply}
            id={supply}
            checked={checkedSupplies[supply]}
            onChange={() => toggleSupplyCheck(supply)}
          />
        </Supply>
      ))}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  margin: 72px 0px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Supply = styled.div`
  padding: 8px 12px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .number {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.red600};
    border-radius: 4px;

    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.font.fontSize.detail11};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .supply {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
    line-height: 32px;
  }
`;
