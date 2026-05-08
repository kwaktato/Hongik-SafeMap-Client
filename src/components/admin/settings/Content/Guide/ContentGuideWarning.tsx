import styled from 'styled-components';
import Plus from '@/assets/icons/PlusS.svg?react';
import Delete from '@/assets/icons/TrashCan.svg?react';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';

interface ContentGuideWarningProps {
  warnings: string[];
  setWarnings: (warnings: string[]) => void;
}

export const ContentGuideWarning = ({
  warnings,
  setWarnings,
}: ContentGuideWarningProps) => {
  const handleAdd = () => setWarnings([...warnings, '']);

  const handleDelete = (index: number) =>
    setWarnings(warnings.filter((_: any, i: number) => i !== index));

  const handleChange = (index: number, value: string) => {
    const next = [...warnings];
    next[index] = value;
    setWarnings(next);
  };

  return (
    <WarningWrapper>
      <div className="warning">
        주의사항
        <Button variant="white" width="120px" onClick={handleAdd}>
          <Plus />
          <span>추가하기</span>
        </Button>
      </div>

      <CardWrapper>
        {warnings.map((warning, index) => (
          <div className="input" key={index}>
            <InputBox
              placeholder="예) 엘레베이터를 절대 사용하지 마세요"
              value={warning}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            {warnings.length > 1 && (
              <div className="delete" onClick={() => handleDelete(index)}>
                <Delete />
              </div>
            )}
          </div>
        ))}
      </CardWrapper>
    </WarningWrapper>
  );
};

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .warning {
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
  display: flex;
  flex-direction: column;
  gap: 20px;
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
