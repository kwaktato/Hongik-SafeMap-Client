import styled from 'styled-components';
import React from 'react';

interface SettingSectionProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const SettingSection = ({
  children,
  icon,
  title,
  description,
}: SettingSectionProps) => {
  return (
    <Container>
      <TitleWrapper>
        <div className="setting-title">
          {icon}
          {title}
        </div>
        <div className="setting-detail">{description}</div>
      </TitleWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .setting-title {
    display: flex;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head30};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .setting-detail {
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  svg {
    width: 40px;
    height: 40px;
  }
`;

const ContentWrapper = styled.div``;
