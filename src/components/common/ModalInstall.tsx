import styled from 'styled-components';
import ModalClose from '@/assets/icons/Exit.svg?react';
import { Button } from '@/components/common/Button';

interface ModalProps {
  onClose: () => void;
}

export const ModalInstall = ({ onClose }: ModalProps) => {
  return (
    <ModalWrapper>
      <ModalXImg onClick={onClose} />
      <ModalLabelWrapper>
        <ModalTitleLabel>
          <div>홈화면에 추가해 알림을 받아보세요!</div>
        </ModalTitleLabel>
        <ModalDetailLabel>
          <div>
            하단 바의 "공유" 버튼을 누르고
            <br />
            "홈 화면에 추가"를 선택하세요.
          </div>
        </ModalDetailLabel>
      </ModalLabelWrapper>

      <Button variant="gray" onClick={onClose}>
        확인
      </Button>
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
