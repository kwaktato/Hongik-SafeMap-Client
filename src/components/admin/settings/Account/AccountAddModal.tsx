import styled from 'styled-components';
import { useState } from 'react';
import ModalClose from '@/assets/icons/Exit.svg?react';
import { useAdminPromoteMutation } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import type { AdminPromoteRequest } from '@/types/Admin';

interface AccountAddModalProps {
  onClose: () => void;
}

export const AccountAddModal = ({ onClose }: AccountAddModalProps) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const { mutate: postContact } = useAdminPromoteMutation();

  const handleAddAccount = () => {
    if (!isAccountValid) {
      return;
    }

    const request: AdminPromoteRequest = {
      nickname: nickname,
      email: email,
    };

    postContact(request, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        alert('관리자 계정 등록을 실패했습니다.');
      },
    });
  };

  const isAccountValid = nickname.trim() !== '' && email.trim() !== '';

  return (
    <ModalWrapper>
      <div className="top">
        관리자 계정 추가
        <ModalClose onClick={onClose} />
      </div>

      <InputBox
        title="닉네임"
        placeholder="추가할 관리자 계정의 닉네임을 입력해주세요."
        onChange={(e) => setNickname(e.target.value)}
      />
      <InputBox
        title="이메일"
        placeholder="추가할 관리자 계정의 이메일을 입력해주세요."
        onChange={(e) => setEmail(e.target.value)}
      />

      <ModalButtonWrapper>
        <Button variant="white" onClick={onClose}>
          취소
        </Button>
        <Button
          variant={isAccountValid ? 'black' : 'gray'}
          disabled={!isAccountValid}
          onClick={handleAddAccount}
        >
          추가
        </Button>
      </ModalButtonWrapper>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  svg {
    cursor: pointer;
  }
`;

const ModalButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
