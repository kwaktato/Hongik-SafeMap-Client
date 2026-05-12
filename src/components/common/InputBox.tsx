import type React from 'react';
import styled from 'styled-components';

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;

  width?: string;
  height?: string;
  placeholder?: string;
  value?: string;

  icon?: React.ReactNode;
  iconBottom?: string;
  iconRight?: string;
  onClick?: () => void;
}

export const InputBox = ({
  title,

  width = '100%',
  height = '44px',
  placeholder,
  value,

  icon,
  iconBottom = '10px',
  iconRight = '16px',
  onClick: onClick,

  ...props
}: InputBoxProps) => {
  return (
    <InputWrapper bottom={iconBottom} right={iconRight}>
      {title && <Title className="input">{title}</Title>}

      <Input
        width={width}
        height={height}
        placeholder={placeholder}
        value={value}
        {...props}
      />

      {icon && (
        <div className="icon" onClick={onClick}>
          {icon}
        </div>
      )}
    </InputWrapper>
  );
};

const InputWrapper = styled.div<{ bottom: string; right: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

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

const Title = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body18};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const Input = styled.input<{ width: string; height: string }>`
  box-sizing: border-box;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
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
