import styled, { css } from 'styled-components';

type ButtonColor = 'gray' | 'lightGray' | 'red' | 'black' | 'white';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonColor;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export const Button = ({
  variant = 'gray',
  children,
  width = '100%',
  height = '44px',
  ...props
}: ButtonProps) => {
  return (
    <StyledButton variant={variant} width={width} height={height} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: ButtonColor;
  width: string;
  height: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  span {
    padding-top: 3px;
  }

  ${({ variant }) => getVariantStyle(variant)}
`;

const getVariantStyle = (variant: ButtonColor) => {
  switch (variant) {
    case 'gray':
      return css`
        background-color: ${({ theme }) => theme.colors.gray600};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'lightGray':
      return css`
        background-color: ${({ theme }) => theme.colors.gray200};
        color: ${({ theme }) => theme.colors.gray700};
      `;
    case 'red':
      return css`
        background-color: ${({ theme }) => theme.colors.red600};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'black':
      return css`
        background-color: ${({ theme }) => theme.colors.gray1000};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'white':
      return css`
        background-color: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.gray1000};
        border: 1px solid ${({ theme }) => theme.colors.gray400};
      `;
  }
};
