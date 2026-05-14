import styled from 'styled-components';
import Logo from '@/assets/icons/LogoHome.svg?react';
import My from '@/assets/icons/My.svg?react';
import Notification from '@/assets/icons/Notification.svg?react';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

interface TitleMainSubProps {
  main: string;
  sub: string;
  align?: string;
}

export const TitleMainSub = ({
  main,
  sub,
  align = 'flex-start',
}: TitleMainSubProps) => {
  return (
    <Title align={align}>
      <div className="main">{main}</div>
      <div className="sub">{sub}</div>
    </Title>
  );
};

const Title = styled.div<{ align: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align};
  gap: 2px;

  .main {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .sub {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

interface TitleHeaderProps {
  mainTitle: string;
  subTitle: string;
  home?: boolean;
}

export const TitleHeader = ({
  home = false,
  mainTitle,
  subTitle,
}: TitleHeaderProps) => {
  const { handleNavigate } = useHandleNavigate();

  return (
    <TitleHeaderWrapper>
      {home ? <Logo /> : <TitleMainSub main={mainTitle} sub={subTitle} />}
      <div className="icons">
        <Notification />
        <My onClick={() => handleNavigate('/user/my')} />
      </div>
    </TitleHeaderWrapper>
  );
};

const TitleHeaderWrapper = styled.div`
  padding: 0px 20px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;

  .icons {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;
