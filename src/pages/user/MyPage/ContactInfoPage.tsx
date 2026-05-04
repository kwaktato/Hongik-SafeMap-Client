import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useDeleteEmergencyContact, useEmergencyContact } from '@/api/mypage';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { Button } from '@/components/common/Button';
import { ContactInfoCard } from '@/components/user/mypage/ContactInfoCard';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { EmergencyContactResponse } from '@/types/Mypage';

export const ContactInfoPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [contacts, setContacts] = useState<EmergencyContactResponse[]>([]);

  const { data } = useEmergencyContact();

  useEffect(() => {
    if (data) {
      setContacts(data);
    }
  }, [data]);

  const handleAddContact = () => {
    const newId =
      (contacts.length > 0
        ? Math.min(...contacts.map((c) => c.emergencyContactId), 0)
        : 0) - 1;

    setContacts((prev) => [
      ...prev,
      {
        emergencyContactId: newId,
        name: '',
        relationship: '',
        phone: '',
      },
    ]);
  };

  const { mutate: deleteContact } = useDeleteEmergencyContact();
  const handleDeleteContact = (id: number) => {
    if (contacts.length <= 1) {
      alert('최소 1개의 비상연락처는 있어야 합니다.');
      return;
    }

    const isTemporaryId = id < 0;

    if (isTemporaryId) {
      setContacts((prev) => prev.filter((c) => c.emergencyContactId !== id));
      return;
    }

    deleteContact(id, {
      onError: () => {
        alert('비상연락처 삭제에 실패했습니다.');
      },
    });
  };

  // const dummyEmergencyContacts: EmergencyContactResponse[] = [
  //   {
  //     emergencyContactId: 1,
  //     name: '김철수',
  //     relationship: '형',
  //     phone: '010-1234-5678',
  //   },
  //   {
  //     emergencyContactId: 2,
  //     name: '이지은',
  //     relationship: '친구',
  //     phone: '010-9876-5432',
  //   },
  //   {
  //     emergencyContactId: 3,
  //     name: '박민영',
  //     relationship: '부모님',
  //     phone: '010-5555-6666',
  //   },
  // ];

  return (
    <Container>
      <NavBar
        center={
          <TitleMainSub
            main="비상 연락처"
            sub="긴급 상황 시 연락할 가족/지인 정보입니다"
            align="center"
          />
        }
        right={<Exit onClick={handleGoBack} />}
      />

      {/* {dummyEmergencyContacts.map((contact, index) => ( */}
      {contacts.map((contact, index) => (
        <ContactInfoCard
          key={contact.emergencyContactId}
          index={index + 1}
          contact={contact}
          onDelete={handleDeleteContact}
          canDelete={contacts.length > 1}
        />
      ))}

      <Button variant="white" onClick={handleAddContact}>
        <Plus />
        <span> 비상 연락처 추가</span>
      </Button>
    </Container>
  );
};

const Container = styled.div`
  margin: 76px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  svg {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;
