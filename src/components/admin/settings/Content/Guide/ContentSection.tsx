import styled from 'styled-components';
import { useState } from 'react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useAdminDisasterType } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { ContentDetail } from '@/components/admin/settings/Content/Guide/ContentDetail';

export const ContentSection = () => {
  const [selectedId, setSelectedId] = useState(0);
  const [isShowing, setIsShowing] = useState(false);

  const { data: disasterTypes } = useAdminDisasterType();

  const handleEditClick = (disasterId: number) => {
    setSelectedId(disasterId);
    setIsShowing(true);
  };

  const handleAddClick = () => {
    setSelectedId(0);
    setIsShowing(true);
  };

  return (
    <Container>
      <TypeWrapper>
        {disasterTypes?.map((disaster) => (
          <Type key={disaster.id}>
            <div className="left">
              <img src={disaster.iconUrl} alt={disaster.name} />
              {disaster.name}
            </div>

            <Button
              variant="white"
              width="60px"
              height="36px"
              onClick={() => handleEditClick(disaster.id)}
            >
              편집
            </Button>
          </Type>
        ))}

        <Button variant="white" height="100%" onClick={handleAddClick}>
          <Plus />
          <span>추가하기</span>
        </Button>
      </TypeWrapper>

      {isShowing && (
        <ContentDetail
          selectedId={selectedId}
          onClose={() => setIsShowing(false)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const TypeWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;
  background: ${({ theme }) => theme.colors.white};

  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Type = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray100};

  .left {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;
