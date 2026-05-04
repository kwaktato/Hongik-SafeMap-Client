import { styled } from 'styled-components';
import { useState } from 'react';
import Logo from '@/assets/icons/Logo.svg?react';
import Hide from '@/assets/icons/HideS.svg?react';
import Show from '@/assets/icons/ShowS.svg?react';
import Kakao from '@/assets/icons/KakaoLogin.svg?react';
import Naver from '@/assets/icons/NaverLogin.svg?react';
import Next from '@/assets/icons/LoginNext.svg?react';
import { useGeneralLoginMutation } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { GeneralLoginRequest } from '@/types/Auth';

export const LoginPage = () => {
  const { handleNavigate } = useHandleNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { mutate: login } = useGeneralLoginMutation();

  const handleLoginClick = () => {
    const loginRequest: GeneralLoginRequest = {
      email: email,
      password: password,
    };
    // console.log(loginRequest);
    login(loginRequest, {
      onSuccess: (response) => {
        if (response.status === 'ADMIN') {
          handleNavigate('/admin');
        } else {
          handleNavigate('/user');
        }

        setEmail('');
        setPassword('');
      },
      onError: () => {
        alert('로그인 실패! 이메일과 비밀번호를 확인해주세요.');
      },
    });
  };

  return (
    <Container>
      <Logo />

      <LoginWrapper>
        <InputBox
          placeholder="아이디를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputBox
          placeholder="비밀번호를 입력하세요"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={showPassword ? <Hide /> : <Show />}
          onClick={toggleShowPassword}
        />
        <Button
          variant="gray"
          style={{ marginTop: '16px' }}
          onClick={handleLoginClick}
        >
          로그인
        </Button>
      </LoginWrapper>

      <SocialWrapper>
        <div className="else-wrapper">
          <div className="border" />
          <div className="else">또는</div>
          <div className="border" />
        </div>

        <div className="social">
          <Kakao />
          <Naver />
        </div>

        <div className="signup" onClick={() => handleNavigate('/signup')}>
          가입하기
          <Next />
        </div>
      </SocialWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 0px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const LoginWrapper = styled.div`
  margin-top: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const SocialWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  .else-wrapper {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .else {
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.gray600};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .border {
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray300};
  }

  .social {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .signup {
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
