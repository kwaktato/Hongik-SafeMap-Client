import { styled } from 'styled-components';
import { useEffect, useState } from 'react';
import Warning from '@/assets/icons/WarningS.svg?react';

interface ToastProps {
  text: string;
}

export const Toast = ({ text }: ToastProps) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastWrapper fade={fade}>
      <Message>
        <Warning />
        {text}
      </Message>
    </ToastWrapper>
  );
};

const ToastWrapper = styled.div<{ fade: boolean }>`
  padding: 12px;
  display: flex;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.gray1000};
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);

  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 100px;
  z-index: 10;

  opacity: ${({ fade }) => (fade ? 0 : 1)};
  transition: opacity 1.2s ease;
`;

const Message = styled.span`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  white-space: nowrap;
`;
