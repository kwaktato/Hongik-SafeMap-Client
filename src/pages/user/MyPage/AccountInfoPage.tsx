import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import Warning from '@/assets/icons/WarningS.svg?react';
import { useMyAccount } from '@/api/mypage';
import { InputBox } from '@/components/common/InputBox';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const AccountInfoPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { data } = useMyAccount();

  useEffect(() => {
    if (data) {
      setEmail(data.email);
      setPhone(data.phone);
    }
  }, [data]);

  return (
    <Container>
      <NavBar
        center={
          <TitleMainSub
            main="계정 정보"
            sub="로그인에 사용되는 계정 정보입니다"
            align="center"
          />
        }
        right={<Exit onClick={handleGoBack} />}
      />

      <InputBox title="이메일" placeholder="user@example.com" value={email} />

      <InputBox title="전화번호" placeholder="01012345678" value={phone} />

      <div className="id">
        <Warning />
        <span>
          계정 정보는 변경할 수 없습니다. 변경이 필요한 경우 고객센터로
          문의해주세요.
        </span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin: 0px 20px;
  margin-top: 76px;
  display: flex;
  flex-direction: column;
  gap: 25px;

  .id {
    padding: 8px 16px 8px 12px;
    display: flex;
    // align-items: center;
    gap: 4px;
    background: ${({ theme }) => theme.colors.red100};
    border-radius: 8px;

    color: ${({ theme }) => theme.colors.red600};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  span {
    padding-top: 4px;
  }
`;
