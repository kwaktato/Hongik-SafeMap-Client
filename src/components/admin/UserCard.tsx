import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useUpdateMemberCredible } from '@/api/admin';
import Check from '@/assets/icons/ExactXS.svg?react';
import { Button } from '@/components/common/Button';
import { Tag } from '@/components/common/Tag';
import type { Member } from '@/types/Admin';

interface UserCardProps {
  member: Member;
}

export const UserCard = ({ member }: UserCardProps) => {
  const items = [
    { type: 'email', value: member.email, title: '이메일' },
    {
      type: 'reportCount',
      value: `${member.reportCount}`,
      title: '제보건',
    },
    { type: 'accuracy', value: member.accuracy, title: '정확도' },
  ];

  const [isCredible, setIsCredible] = useState(false);

  const { mutate: toggleCredible } = useUpdateMemberCredible(member.id);

  const handleCredibleClick = () => {
    toggleCredible(undefined, {
      onSuccess: () => {
        setIsCredible(!isCredible);
      },
    });
  };

  useEffect(() => {
    setIsCredible(member.isCredible);
  }, [member.isCredible]);

  const getVariant = (accuracy: number) => {
    if (accuracy >= 90) return 'subBlue';
    else if (accuracy >= 50) return 'gray';
    else return 'subRed';
  };

  return (
    <Container>
      <div className="top">
        <div>{member.name}</div>
        {isCredible ? (
          <Tag variant="black" iconTag={true}>
            <Check />
            공신력 사용자
          </Tag>
        ) : (
          <Tag variant="white">일반 사용자</Tag>
        )}
      </div>

      <InfoWrapper>
        <div className="leftWrapper">
          {items.map((item) => (
            <div key={item.type} className="info-title">
              {item.title}
            </div>
          ))}
        </div>
        <div className="rightWrapper">
          {items.map((item) => (
            <div key={item.type} className="info-detail">
              {item.type === 'accuracy' ? (
                <Tag variant={getVariant(member.accuracy)}>{item.value}%</Tag>
              ) : (
                item.value
              )}
            </div>
          ))}
        </div>
      </InfoWrapper>

      <Button
        variant={isCredible ? 'white' : 'black'}
        onClick={handleCredibleClick}
      >
        {isCredible ? '지정 해제' : '공신력 부여'}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  background: ${({ theme }) => theme.colors.white};

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const InfoWrapper = styled.div`
  padding: 16px;
  display: flex;
  gap: 14px;

  .leftWrapper,
  .rightWrapper {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .info-title {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .info-detail {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
