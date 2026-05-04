import styled from 'styled-components';
import { useMemo, useState } from 'react';
import { useAdminMembers } from '@/api/admin';
import { TitleHeader } from '@/components/common/TitleHeader';
import { UserCard } from '@/components/admin/UserCard';
import { SearchBar } from '@/components/common/SearchBar';

export const AdminUserPage = () => {
  const { data } = useAdminMembers();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    const allMembers = data;

    if (!searchTerm) {
      return allMembers;
    }

    return allMembers?.filter(
      (member) =>
        member.name.includes(searchTerm) || member.email.includes(searchTerm),
    );
  }, [searchTerm]);

  return (
    <Container>
      <TitleHeader
        mainTitle="사용자 관리"
        subTitle="사용자의 공신력을 지정하거나 관리할 수 있습니다"
      />

      <SearchBar
        placeholder="검색할 이름 또는 이메일을 입력해주세요."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        onSearch={() => setSearchTerm(searchTerm)}
      />

      <UserCardWrapper>
        {filteredMembers?.map((member) => (
          <UserCard key={member.id} member={member} />
        ))}
      </UserCardWrapper>

      <Guide>
        <span>공신력 사용자:</span> 정확도가 높고 신뢰할 수 있는 제보를 하는
        사용자에게 공신력을 부여하면, 해당 사용자의 제보가 강조 표시됩니다.
      </Guide>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserCardWrapper = styled.div`
  display: grid;
  gap: 12px;

  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Guide = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.subBlue};
  border: 1px solid ${({ theme }) => theme.colors.mainBlue};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.mainBlue};
  font-size: ${({ theme }) => theme.font.fontSize.text14};
  font-weight: ${({ theme }) => theme.font.fontWeight.regular};

  span {
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;
