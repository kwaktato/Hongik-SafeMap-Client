import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import More from '@/assets/icons/MoreVertS.svg?react';
import Edit from '@/assets/icons/WriteS.svg?react';
import Delete from '@/assets/icons/TrashCan.svg?react';
import { useDeletePostMutation } from '@/api/board';
import { Toast } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import { ModalButtons } from './ModalButtons';

interface DropdownBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  path: string;
}

export const DropdownBoard = ({ path }: DropdownBoardProps) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const { handleNavigate } = useHandleNavigate();

  const [showOptions, setShowOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handleEdit = () => {
    handleNavigate(`/user/${path}/edit/${id}`);
  };

  const { mutate: deletePost } = useDeletePostMutation(path);

  const handleDelete = () => {
    deletePost(Number(id), {
      onSuccess: () => {
        showToast('제보가 완료되었습니다.');
        handleNavigate(`/user/${path}`);
      },
      onError: () => alert('게시글 삭제에 실패했습니다.'),
    });
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <DropdownWrapper ref={selectRef}>
      <DropdownHeader onClick={() => setShowOptions((prev) => !prev)}>
        <More />
      </DropdownHeader>

      {showOptions && (
        <DropdownOptionWrapper>
          <DropdownOption onClick={handleEdit} isDelete={false}>
            수정하기 <Edit />
          </DropdownOption>

          <div className="border" />

          <DropdownOption onClick={() => setIsModalOpen(true)} isDelete={true}>
            삭제하기 <Delete />
          </DropdownOption>
        </DropdownOptionWrapper>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalButtons
          onClose={() => setIsModalOpen(false)}
          title="게시글을 삭제하시겠습니까?"
          detail="삭제된 게시글은 복구할 수 없습니다."
          left="취소"
          right="확인"
          handleLeftBtnClick={() => setIsModalOpen(false)}
          handleRightBtnClick={handleDelete}
        />
      </Modal>

      {toastMessage && <Toast text={toastMessage} />}
    </DropdownWrapper>
  );
};

const DropdownWrapper = styled.div`
  width: 120px;
  display: flex;
  align-items: end;
  flex-direction: column;
  position: relative;
`;

const DropdownHeader = styled.div`
  svg {
    cursor: pointer;
    pointer-events: none;
  }

  display: flex;
  align-items: center;
`;

const DropdownOptionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  position: absolute;
  top: 36px;
  z-index: 1;

  .border {
    height: 1px;
    background: ${({ theme }) => theme.colors.gray400};
  }
`;

const DropdownOption = styled.div<{
  isDelete: boolean;
}>`
  padding: 8px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  color: ${({ theme, isDelete }) =>
    isDelete ? theme.colors.red600 : theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    width: 24px;
    height: 24px;
  }
`;
