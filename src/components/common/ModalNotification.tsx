import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ModalClose from '@/assets/icons/Exit.svg?react';
import { Toast } from '@/components/common/Toast';
import { handleAllowNotification } from '@/firebase';

interface ModalProps {
  onClose: () => void;
}

export const ModalNotification = ({ onClose }: ModalProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handleClick = async () => {
    // const notificationResult = await handleAllowNotification();
    // if (notificationResult === 'granted') {
    //   document.body.style.overflowY = 'scroll';
    //   showToast('알림 허용이 완료되었습니다.');
    //   document.body.style.overflowY = 'scroll';
    //   onClose();
    // }

    try {
      const result = await handleAllowNotification();
      if (result === 'granted') {
        showToast('알림 허용이 완료되었습니다.');
        onClose();
      }
    } catch (err) {
      alert('알림 설정 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalWrapper>
      <ModalXImg onClick={onClose} />

      {toastMessage && <Toast text={toastMessage} />}
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 56px 20px 20px 20px;
  width: 272px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
`;

const ModalXImg = styled(ModalClose)`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;

const ModalLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalTitleLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  text-align: center;
`;

const ModalDetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  line-height: 140%;
  text-align: center;
`;

const ModalButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
