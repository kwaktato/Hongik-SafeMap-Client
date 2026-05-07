import styled from 'styled-components';
import { useState } from 'react';
import Back from '@/assets/icons/ChevronLeft.svg?react';
import Logout from '@/assets/icons/OutS.svg?react';
import { useLogoutMutation } from '@/api/auth';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { Modal } from '@/components/common/Modal';
import { ModalButtons } from '@/components/common/ModalButtons';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const MyPage = () => {
  const { handleGoBack, handleNavigate } = useHandleNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutate: logout } = useLogoutMutation();
  const handleLogout = () => {
    logout(undefined, {
      onError: () => {
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <Container>
      <NavBar
        left={<Back onClick={handleGoBack} />}
        center={
          <TitleMainSub
            main="마이페이지"
            sub="내 정보 및 활동 관리"
            align="center"
          />
        }
      />

      {/* <MenuWrapper>
        <div className="title">이용약관</div>
        <div className="menu" onClick={}>
          서비스 이용약관
        </div>
        <div className="menu" onClick={}>
          개인정보처리 방침
        </div>
      </MenuWrapper> 

      <Border />
      */}

      <MenuWrapper>
        <div className="title">내 정보</div>
        <div
          className="menu"
          onClick={() => handleNavigate('/user/my/account')}
        >
          계정 정보
        </div>
        <div
          className="menu"
          onClick={() => handleNavigate('/user/my/password')}
        >
          비밀번호 변경
        </div>
      </MenuWrapper>

      <Border />

      <MenuWrapper>
        <div className="title">민감 정보</div>
        <div
          className="menu"
          onClick={() => handleNavigate('/user/my/medical')}
        >
          의료 정보
        </div>
        <div
          className="menu"
          onClick={() => handleNavigate('/user/my/contact')}
        >
          비상 연락처
        </div>
      </MenuWrapper>

      <Border />

      <MenuWrapper>
        <div className="title">내 제보</div>
        <div className="menu" onClick={() => handleNavigate('/user/my/report')}>
          내가 제보한 글
        </div>
      </MenuWrapper>

      <Border />

      <MenuWrapper>
        <div className="title">기타</div>
        <div className="menu" onClick={() => setIsLogoutModalOpen(true)}>
          <Logout />
          로그아웃
        </div>
      </MenuWrapper>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <ModalButtons
          onClose={() => setIsLogoutModalOpen(false)}
          title="로그아웃 하시겠습니까?"
          detail="현재 계정에서 로그아웃됩니다. 계속하시겠습니까?"
          left="취소"
          right="로그아웃"
          handleLeftBtnClick={() => setIsLogoutModalOpen(false)}
          handleRightBtnClick={handleLogout}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  margin: 76px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Border = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  svg {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;
