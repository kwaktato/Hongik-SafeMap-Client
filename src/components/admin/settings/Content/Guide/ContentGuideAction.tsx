import styled from 'styled-components';
import Plus from '@/assets/icons/PlusS.svg?react';
import Delete from '@/assets/icons/TrashCan.svg?react';
import { Button } from '@/components/common/Button';

interface ContentGuideActionProps {
  actions: { title: string; guide: string }[];
  setActions: (actions: { title: string; guide: string }[]) => void;
}

export const ContentGuideAction = ({
  actions,
  setActions,
}: ContentGuideActionProps) => {
  const handleAdd = () => setActions([...actions, { title: '', guide: '' }]);

  const handleDelete = (index: number) =>
    setActions(actions.filter((_: any, i: number) => i !== index));

  const handleChange = (index: number, field: string, value: string) => {
    const nextActions = [...actions];
    nextActions[index] = { ...nextActions[index], [field]: value };
    setActions(nextActions);
  };

  return (
    <ActionWrapper>
      <div className="action">
        행동 요령 단계
        <Button variant="white" width="120px" onClick={handleAdd}>
          <Plus />
          <span>추가하기</span>
        </Button>
      </div>

      {actions.map((action, index) => (
        <ActionCard key={index}>
          <div className="step">
            단계 {index + 1}
            {actions.length > 1 && (
              <div className="delete" onClick={() => handleDelete(index)}>
                <Delete />
              </div>
            )}
          </div>

          <Title
            placeholder="예) 사전 준비"
            value={action.title}
            onChange={(e) => handleChange(index, 'title', e.target.value)}
          />

          <Guide
            placeholder="예) 기상 예보를 주시하고, 저지대 거주자는 대피 준비를 하세요."
            value={action.guide}
            onChange={(e) => handleChange(index, 'guide', e.target.value)}
          />
        </ActionCard>
      ))}
    </ActionWrapper>
  );
};

const ActionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const ActionCard = styled.div`
  padding: 12px 24px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};

  .step {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
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
  height: 44px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};

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
    border: 1px solid ${({ theme }) => theme.colors.gray800};
  }
`;

const Guide = styled.textarea`
  padding: 10px 16px;
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};
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
    border: 1px solid ${({ theme }) => theme.colors.gray800};
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
