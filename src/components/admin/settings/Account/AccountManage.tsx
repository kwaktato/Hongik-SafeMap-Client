import styled from 'styled-components';
import { useState } from 'react';
import Plus from '@/assets/icons/PlusS.svg?react';
import { useAdminAccounts } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { AccountAddModal } from '@/components/admin/settings/Account/AccountAddModal';
import { AccountCard } from '@/components/admin/settings/Account/AccountCard';

export const AccountManage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data } = useAdminAccounts();

  return (
    <Container>
      {data?.map((account, index) => (
        <div key={account.id}>
          <AccountCard account={account} canDelete={data?.length > 1} />
          {index !== data?.length - 1 && <Border />}
        </div>
      ))}

      <Button variant="black" onClick={() => setIsAddModalOpen(true)}>
        <Plus />
        <span>관리자 계정 추가</span>
      </Button>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AccountAddModal onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  padding: 12px 24px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.white};
`;

const Border = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray300};
`;
