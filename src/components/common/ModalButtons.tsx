import styled from 'styled-components';
import React from 'react';
import ModalClose from '@/assets/icons/Exit.svg?react';
import { Button } from '@/components/common/Button';

interface ModalProps {
  onClose: () => void;
  title: string;
  detail: string;
  left: string;
  right: string;
  handleLeftBtnClick: () => void;
  handleRightBtnClick: () => void;
}

export const ModalButtons = ({
  onClose,
  title,
  detail,
  left,
  right,
  handleLeftBtnClick,
  handleRightBtnClick,
}: ModalProps) => {
  return (
    <ModalWrapper>
      <ModalXImg onClick={onClose} />
      <ModalLabelWrapper>
        <ModalTitleLabel>
          {title.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </ModalTitleLabel>
        <ModalDetailLabel>
          {detail.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </ModalDetailLabel>
      </ModalLabelWrapper>
      <ModalButtonWrapper>
        <Button variant="gray" onClick={handleLeftBtnClick}>
          {left}
        </Button>
        <Button variant="red" onClick={handleRightBtnClick}>
          {right}
        </Button>
      </ModalButtonWrapper>
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
