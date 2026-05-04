import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import TrashCan from '@/assets/icons/TrashCan.svg?react';
import {
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
} from '@/api/mypage';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import { Dropdown } from '@/components/common/Dropdown';
import { Toast } from '@/components/common/Toast';
import type {
  EmergencyContactResponse,
  EmergencyContactsRequest,
} from '@/types/Mypage';

interface ContactInfoCardProps {
  contact: EmergencyContactResponse;
  index: number;
  onDelete: (id: number) => void;
  canDelete: boolean;
}

export const ContactInfoCard = ({
  contact,
  index,
  onDelete,
  canDelete,
}: ContactInfoCardProps) => {
  const [currentContact, setCurrentContact] =
    useState<EmergencyContactResponse>(contact);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  useEffect(() => {
    setCurrentContact(contact);
  }, [contact]);

  const isContactValid =
    currentContact.name.trim() !== '' && currentContact.phone.trim() !== '';

  const isExistingContact =
    currentContact.emergencyContactId && currentContact.emergencyContactId > 0;

  const { mutate: updateContact } = useUpdateEmergencyContactMutation();
  const { mutate: postContact } = useCreateEmergencyContactMutation();

  const handleChange = useCallback(
    (
      field: keyof Omit<EmergencyContactResponse, 'emergencyContactId'>,
      value: string,
    ) => {
      setCurrentContact((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSaveContact = () => {
    if (!isContactValid) {
      showToast('비상 연락처의 이름과 연락처를 입력해주세요.');
      return;
    }

    const request: EmergencyContactsRequest = {
      name: currentContact.name,
      relationship: currentContact.relationship,
      phone: currentContact.phone,
    };

    if (isExistingContact) {
      updateContact(
        {
          emergencyContactId: currentContact.emergencyContactId,
          request,
        },
        {
          onSuccess: () => showToast('비상 연락처가 수정되었습니다.'),
          onError: () => alert('비상 연락처 수정을 실패했습니다.'),
        },
      );
    } else {
      postContact(request, {
        onError: () => alert('비상 연락처 등록을 실패했습니다.'),
      });
    }
  };

  return (
    <Container>
      <div className="top">
        <div className="contact">비상연락처 {index}</div>
        {canDelete && (
          <div
            className="delete"
            onClick={() => onDelete(currentContact.emergencyContactId)}
          >
            <TrashCan />
          </div>
        )}
      </div>

      <InputBox
        title="이름"
        placeholder="이름"
        value={currentContact.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange('name', e.target.value)
        }
      />

      <div className="dropdown">
        <div className="realtionship">관계</div>
        <Dropdown
          title="관계"
          options={['배우자', '자녀', '부모', '친구', '지인', '기타']}
          selectedOption={currentContact.relationship}
          setSelectedOption={(option: string) => {
            handleChange('relationship', option);
          }}
        />
      </div>

      <InputBox
        title="연락처"
        placeholder="01012345678"
        value={currentContact.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange('phone', e.target.value)
        }
      />

      <Button
        variant={isContactValid ? 'red' : 'gray'}
        disabled={!isContactValid}
        onClick={handleSaveContact}
      >
        비상연락처 {isExistingContact ? '수정' : '저장'}하기
      </Button>

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  padding: 17px 21px 24px 21px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .top {
    display: flex;
    justify-content: space-between;
  }

  .contact {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .delete {
    color: ${({ theme }) => theme.colors.red600};
  }

  .dropdown {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .input {
    font-size: ${({ theme }) => theme.font.fontSize.body14};
  }

  .realtionship {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
