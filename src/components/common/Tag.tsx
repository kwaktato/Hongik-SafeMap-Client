import styled, { css } from 'styled-components';

export type TagColor =
  | 'white'
  | 'gray'
  | 'black'
  | 'red'
  | 'subRed'
  | 'blue'
  | 'subBlue';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: TagColor;
  iconTag?: boolean;
  children: React.ReactNode;
}

export const Tag = ({
  variant,
  iconTag = false,
  children,
  ...props
}: TagProps) => {
  return (
    <TagWrapper variant={variant} iconTag={iconTag} {...props}>
      {children}
    </TagWrapper>
  );
};

const TagWrapper = styled.div<{
  variant: TagColor;
  iconTag: boolean;
}>`
  padding: ${({ iconTag }) => (iconTag ? '2px 8px 2px 6px' : '2px 8px')};
  display: flex;
  align-items: center;
  jusitfy-content: center;

  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  border-radius: 8px;

  ${({ variant }) => getVariantStyle(variant)}
`;

const getVariantStyle = (variant: TagColor) => {
  switch (variant) {
    case 'white':
      return css`
        background-color: ${({ theme }) => theme.colors.white};
        color: ${({ theme }) => theme.colors.gray800};
        border: 1px solid ${({ theme }) => theme.colors.gray400};

        svg {
          color: ${({ theme }) => theme.colors.gray700};
        }
      `;
    case 'gray':
      return css`
        background-color: ${({ theme }) => theme.colors.gray300};
        color: ${({ theme }) => theme.colors.gray900};
      `;
    case 'black':
      return css`
        background-color: ${({ theme }) => theme.colors.gray900};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'red':
      return css`
        background-color: ${({ theme }) => theme.colors.red600};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'subRed':
      return css`
        background-color: ${({ theme }) => theme.colors.red200};
        color: ${({ theme }) => theme.colors.red600};
      `;
    case 'blue':
      return css`
        background-color: ${({ theme }) => theme.colors.blue600};
        color: ${({ theme }) => theme.colors.white};
      `;
    case 'subBlue':
      return css`
        background-color: ${({ theme }) => theme.colors.blue200};
        color: ${({ theme }) => theme.colors.blue600};
      `;
  }
};
