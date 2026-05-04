import type React from 'react';
import styled from 'styled-components';

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  placeholder?: string;
  value?: string;
  icon?: React.ReactNode;
  bottom?: string;
  right?: string;
  onClick?: () => void;
}

export const InputBox = ({
  title,
  placeholder,
  value,
  icon,
  bottom = '10px',
  right = '16px',
  onClick,
  ...props
}: InputBoxProps) => {
  return (
    <InputWrapper bottom={bottom} right={right}>
      {title && <div className="input">{title}</div>}
      <Input placeholder={placeholder} value={value} {...props} />
      {icon && (
        <div className="icon" onClick={onClick}>
          {icon}
        </div>
      )}
    </InputWrapper>
  );
};

const InputWrapper = styled.div<{ bottom: string; right: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  .input {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .icon {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.gray800};

    position: absolute;
    bottom: ${({ bottom }) => bottom};
    right: ${({ right }) => right};
    cursor: pointer;
  }
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:hover,
  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.colors.gray800};
    border: 1px solid ${({ theme }) => theme.colors.gray800};
  }
`;
