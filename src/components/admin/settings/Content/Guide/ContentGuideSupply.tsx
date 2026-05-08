import styled from 'styled-components';
import Plus from '@/assets/icons/PlusS.svg?react';
import Delete from '@/assets/icons/TrashCan.svg?react';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';

interface ContentGuideSupplyProps {
  supplies: string[];
  setSupplies: (supplies: string[]) => void;
}

export const ContentGuideSupply = ({
  supplies,
  setSupplies,
}: ContentGuideSupplyProps) => {
  const handleAdd = () => setSupplies([...supplies, '']);

  const handleDelete = (index: number) =>
    setSupplies(supplies.filter((_: any, i: number) => i !== index));

  const handleChange = (index: number, value: string) => {
    const next = [...supplies];
    next[index] = value;
    setSupplies(next);
  };

  return (
    <SupplyWrapper>
      <div className="supply">
        필수 준비물
        <Button variant="white" width="120px" onClick={handleAdd}>
          <Plus />
          <span>추가하기</span>
        </Button>
      </div>

      <CardWrapper>
        {supplies.map((supply, index) => (
          <div className="input" key={index}>
            <InputBox
              placeholder="예) 구급 약품"
              value={supply}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            {supplies.length > 1 && (
              <div className="delete" onClick={() => handleDelete(index)}>
                <Delete />
              </div>
            )}
          </div>
        ))}
      </CardWrapper>
    </SupplyWrapper>
  );
};

const SupplyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .supply {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const CardWrapper = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 32px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};

  .input {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .delete {
    cursor: pointer;
  }

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.red600};
  }
`;
