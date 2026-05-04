import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import Warning from '@/assets/icons/WarningXS.svg?react';
import Hide from '@/assets/icons/HideS.svg?react';
import Show from '@/assets/icons/ShowS.svg?react';
import { useUpdatePasswordMutation } from '@/api/mypage';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { InputBox } from '@/components/common/InputBox';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { PasswordRequest } from '@/types/Mypage';

export const PasswordChangePage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(true);

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    apiError: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'currentPassword':
        if (!value) errorMessage = '현재 비밀번호를 입력해주세요.';
        break;
      case 'newPassword':
        if (!value) {
          errorMessage = '새 비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          errorMessage = '새 비밀번호는 8자 이상이어야 합니다.';
        } else if (
          !/[!@#$%^&*()]/.test(value) ||
          !/[a-zA-Z]/.test(value) ||
          !/[0-9]/.test(value)
        ) {
          errorMessage = '영문, 숫자, 특수문자를 포함해야 합니다.';
        } else if (currentPassword && value === currentPassword) {
          errorMessage = '현재 비밀번호와 다른 비밀번호를 사용해주세요.';
        }
        break;
      case 'confirmNewPassword':
        if (!value) {
          errorMessage = '새 비밀번호 확인을 입력해주세요.';
        } else if (newPassword !== value) {
          errorMessage = '새 비밀번호가 일치하지 않습니다.';
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  useEffect(() => {
    const newErrors = { ...errors, apiError: '' };

    newErrors.currentPassword = validateField(
      'currentPassword',
      currentPassword,
    );
    newErrors.newPassword = validateField('newPassword', newPassword);
    newErrors.confirmNewPassword = validateField(
      'confirmNewPassword',
      confirmNewPassword,
    );

    setErrors(newErrors);
  }, [currentPassword, newPassword, confirmNewPassword]);

  const handleBlur = (fieldName: string) => {
    let errorMessage = '';
    if (fieldName === 'currentPassword') {
      errorMessage = validateField('currentPassword', currentPassword);
    } else if (fieldName === 'newPassword') {
      errorMessage = validateField('newPassword', newPassword);
    } else if (fieldName === 'confirmNewPassword') {
      errorMessage = validateField('confirmNewPassword', confirmNewPassword);
    }
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
  };

  const isErrorExist = Object.values(errors).some((msg) => msg !== '');

  const { mutate: updatePassword } = useUpdatePasswordMutation();
  const handleChangePassword = () => {
    setErrors((prev) => ({ ...prev, apiError: '' }));

    if (isErrorExist) {
      return;
    }

    const passwordRequest: PasswordRequest = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    updatePassword(passwordRequest, {
      onSuccess: () => {
        showToast('비밀번호가 성공적으로 변경되었습니다!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        handleGoBack();
      },
      onError: () => alert('비밀번호 변경에 실패했습니다.'),
    });
  };

  return (
    <Container>
      <NavBar
        center={
          <TitleMainSub
            main="비밀번호 변경"
            sub="안전한 비밀번호를 사용하세요 (최소 8자)"
            align="center"
          />
        }
        right={<Exit onClick={handleGoBack} />}
      />

      <div>
        <InputBox
          title="현재 비밀번호"
          type={showCurrentPassword ? 'text' : 'password'}
          placeholder="현재 비밀번호를 입력하세요"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onBlur={() => handleBlur('currentPassword')}
          icon={showCurrentPassword ? <Hide /> : <Show />}
          onClick={() => setShowCurrentPassword((prev) => !prev)}
        />
        {errors.currentPassword !== '' && (
          <ErrorMessage>
            <Warning />
            {errors.currentPassword}
          </ErrorMessage>
        )}
      </div>

      <div>
        <InputBox
          title="새 비밀번호"
          type={showNewPassword ? 'text' : 'password'}
          placeholder="새 비밀번호를 입력하세요"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={() => handleBlur('newPassword')}
          icon={showNewPassword ? <Hide /> : <Show />}
          onClick={() => setShowNewPassword((prev) => !prev)}
        />
        {errors.newPassword !== '' && (
          <ErrorMessage>
            <Warning />
            {errors.newPassword}
          </ErrorMessage>
        )}
      </div>

      <div>
        <InputBox
          title="새 비밀번호 확인"
          type={showConfirmNewPassword ? 'text' : 'password'}
          placeholder="새 비밀번호 확인을 입력하세요"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          onBlur={() => handleBlur('confirmNewPassword')}
          icon={showConfirmNewPassword ? <Hide /> : <Show />}
          onClick={() => setShowConfirmNewPassword((prev) => !prev)}
        />
        {errors.confirmNewPassword !== '' && (
          <ErrorMessage>
            <Warning />
            {errors.confirmNewPassword}
          </ErrorMessage>
        )}
      </div>

      <Bottom>
        <Button
          variant={isErrorExist ? 'gray' : 'red'}
          disabled={isErrorExist}
          onClick={handleChangePassword}
        >
          비밀번호 변경
        </Button>
      </Bottom>

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  margin: 0px 20px;
  margin-top: 76px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  display: flex;
  gap: 2px;

  color: ${({ theme }) => theme.colors.red600};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const Bottom = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;
