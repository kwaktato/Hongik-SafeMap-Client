import type React from 'react';
import styled, { css } from 'styled-components';

type CardVariant = 'red' | 'gray' | 'lightGray' | 'darkGray';

interface StatusCardProps {
  title: string;
  icon: React.ReactNode;
  status: string;
  count: number;
  variant: CardVariant;
}

export const StatusCard = ({
  title,
  icon,
  status,
  count,
  variant,
}: StatusCardProps) => {
  return (
    <Container variant={variant}>
      <div className="top">
        <div className="title">
          {title}
          {icon}
        </div>
        <div className="status">{status}</div>
      </div>
      <div className="count">{count}</div>
    </Container>
  );
};

const variantStyles = {
  red: css`
    background: ${({ theme }) => theme.colors.red600};
    .title {
      color: ${({ theme }) => theme.colors.white};
    }
    .title svg {
      color: ${({ theme }) => theme.colors.white};
    }
    .status {
      color: ${({ theme }) => theme.colors.red300};
    }
    .count {
      color: ${({ theme }) => theme.colors.white};
    }
  `,
  gray: css`
    background: ${({ theme }) => theme.colors.gray100};
    .title {
      color: ${({ theme }) => theme.colors.gray1000};
    }
    .title svg {
      color: ${({ theme }) => theme.colors.gray800};
    }
    .status {
      color: ${({ theme }) => theme.colors.gray700};
    }
    .count {
      color: ${({ theme }) => theme.colors.red600};
    }
  `,
  darkGray: css`
    background: ${({ theme }) => theme.colors.gray400};
    .title {
      color: ${({ theme }) => theme.colors.gray1000};
    }
    .title svg {
      color: ${({ theme }) => theme.colors.gray800};
    }
    .status {
      color: ${({ theme }) => theme.colors.gray700};
    }
    .count {
      color: ${({ theme }) => theme.colors.gray1000};
    }
  `,
  lightGray: css`
    background: ${({ theme }) => theme.colors.gray400};
    .title {
      color: ${({ theme }) => theme.colors.gray800};
    }
    .title svg {
      color: ${({ theme }) => theme.colors.gray800};
    }
    .status {
      color: ${({ theme }) => theme.colors.gray700};
    }
    .count {
      color: ${({ theme }) => theme.colors.gray800};
    }
  `,
};

const Container = styled.div<{ variant: CardVariant }>`
  padding: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  gap: 46px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;

  .top {
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .status {
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .count {
    display: flex;
    align-items: end;
    font-size: ${({ theme }) => theme.font.fontSize.head38};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  ${({ variant }) => variantStyles[variant]}
`;
