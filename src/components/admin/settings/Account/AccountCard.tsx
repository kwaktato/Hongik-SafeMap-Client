import styled from 'styled-components';
import { useState } from 'react';
import Delete from '@/assets/icons/TrashCan.svg?react';
import { useAdminDemoteMutation, useUpdateAdminNickname } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import { Toast } from '@/components/common/Toast';
import type {
  AdminAccountsResponse,
  AdminNicknameRequest,
} from '@/types/Admin';

interface AccountCardProps {
  account: AdminAccountsResponse;
  canDelete: boolean;
}

export const AccountCard = ({ account, canDelete }: AccountCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(account.name);

  const { mutate: updateNickname } = useUpdateAdminNickname();
  const { mutate: deleteAdminAccount } = useAdminDemoteMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handleEditClick = () => {
    setTempName(account.name);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    if (!canDelete) return;

    deleteAdminAccount(account.email, {
      onSuccess: () => showToast('관리자 계정을 삭제했습니다.'),
      onError: () => alert('관리자 계정 삭제에 실패했습니다.'),
    });
  };

  const handleSaveClick = () => {
    if (tempName.trim() === '') return;

    const request: AdminNicknameRequest = {
      memberId: account.id,
      nickname: tempName,
    };

    updateNickname(request, {
      onSuccess: () => {
        setIsEditing(false);
        showToast('닉네임을 변경했습니다.');
      },
      onError: () => alert('닉네임 변경에 실패했습니다.'),
    });
  };

  return (
    <Container>
      <Account>
        {isEditing ? (
          <InputBox
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="name">{account.name}</div>
        )}
        <div className="email">{account.email}</div>
      </Account>

      {isEditing ? (
        <Edit>
          <Button
            variant="white"
            width="60px"
            height="36px"
            onClick={handleSaveClick}
          >
            저장
          </Button>
          <Button
            variant="white"
            width="60px"
            height="36px"
            onClick={() => setIsEditing(false)}
          >
            취소
          </Button>
        </Edit>
      ) : (
        <Edit>
          <Button
            variant="white"
            width="60px"
            height="36px"
            onClick={handleEditClick}
          >
            편집
          </Button>
          {canDelete && (
            <div className="delete" onClick={handleDeleteClick}>
              <Delete />
            </div>
          )}
        </Edit>
      )}

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  padding: 8px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Account = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .email {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Edit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .delete {
    cursor: pointer;
  }

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.red600};
  }
`;
