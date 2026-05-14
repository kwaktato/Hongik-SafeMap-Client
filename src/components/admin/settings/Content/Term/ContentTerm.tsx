import styled from 'styled-components';
import { useState } from 'react';
import {
  useAdminPrivacyPolicyLatest,
  useAdminPrivacyPolicyVersion,
  useAdminTermsLatest,
  useAdminTermsVersion,
} from '@/api/term';
import { Modal } from '@/components/common/Modal';
import { ContentTermModal } from '@/components/admin/settings/Content/Term/ContentTermModal';
import { formatDashDate } from '@/utils/formatDate';

export const ContentTerm = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const { data: terms } = useAdminTermsLatest();
  const { data: privacy } = useAdminPrivacyPolicyLatest();

  const { data: termsVersion } = useAdminTermsVersion();
  const { data: privacyVersion } = useAdminPrivacyPolicyVersion();

  return (
    <Container>
      <Terms>
        <div className="term" onClick={() => setIsServiceModalOpen(true)}>
          이용약관 {termsVersion ? '편집' : '등록'}
        </div>
        {termsVersion && (
          <Version>
            <span>현재 버전</span>
            <div>
              v{termsVersion?.version} (
              {formatDashDate(termsVersion?.updatedAt ?? '')} 업데이트)
            </div>
          </Version>
        )}
      </Terms>

      <Terms>
        <div className="term" onClick={() => setIsPrivacyModalOpen(true)}>
          개인정보처리방침 {privacyVersion ? '편집' : '등록'}
        </div>
        {privacyVersion && (
          <Version>
            <span>현재 버전</span>
            <div>
              v{privacyVersion?.version} (
              {formatDashDate(privacyVersion?.updatedAt ?? '')} 업데이트)
            </div>
          </Version>
        )}
      </Terms>

      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      >
        <ContentTermModal
          onClose={() => setIsServiceModalOpen(false)}
          type="이용약관"
          initialTerms={terms}
        />
      </Modal>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      >
        <ContentTermModal
          onClose={() => setIsPrivacyModalOpen(false)}
          type="개인정보처리방침"
          initialTerms={privacy}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 12px;
`;

const Terms = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .term {
    width: 100%;
    padding: 12px 0px;
    border: 1.5px solid ${({ theme }) => theme.colors.gray400};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.white};
    cursor: pointer;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
    text-align: center;
  }
`;

const Version = styled.div`
  padding: 16px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body18};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  span {
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;
