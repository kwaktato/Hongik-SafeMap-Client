import styled from 'styled-components';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useAdminDisasterType } from '@/api/admin';
import { Button } from '@/components/common/Button';

// interface ContentTypeProps {
//   onEdit: (disaster: any) => void;
//   onAdd: () => void;
// }

// export const ContentType = ({ onEdit, onAdd }: ContentTypeProps) => {
export const ContentType = () => {
  const { data: disasters } = useAdminDisasterType();

  return (
    <Container>
      {disasters?.map((disaster) => (
        <Type key={disaster.id}>
          <div className="left">
            <img src={disaster.iconUrl} alt={disaster.name} />
            {disaster.name}
          </div>

          {/* <Button variant="white" width="60px" height="36px" onClick={onEdit}>
            편집
          </Button> */}
        </Type>
      ))}

      {/* <Button variant="white" height="100%" onClick={onAdd}> */}
      <Button variant="white" height="100%">
        <Plus />
        추가하기
      </Button>
    </Container>
  );
};

const Container = styled.div`
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
  padding: 12px 20px;
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
