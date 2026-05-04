import styled from 'styled-components';
import { useState } from 'react';
import { PRIVACY_TERMS, SERVICE_TERMS } from '@/data/Terms';
import { ContentTermModal } from './ContentTermModal';
import { Modal } from '@/components/common/Modal';

export const ContentTerm = () => {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [serviceTerms, setServiceTerms] = useState(SERVICE_TERMS.sections);
  const [privacyTerms, setPrivacyTerms] = useState(PRIVACY_TERMS.sections);

  return (
    <Container>
      <Terms>
        <div className="term" onClick={() => setIsServiceModalOpen(true)}>
          이용약관 편집
        </div>
        <div className="term" onClick={() => setIsPrivacyModalOpen(true)}>
          개인정보처리방침 편집
        </div>
      </Terms>

      <Version>
        <span>현재 버전</span>
        <div>v1.0 (2026-02-13 업데이트)</div>
      </Version>

      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      >
        <ContentTermModal
          onClose={() => setIsServiceModalOpen(false)}
          title="이용약관 조항 편집"
          initialTerms={serviceTerms}
          onSave={(newTerms) => {
            setServiceTerms(newTerms);
            setIsServiceModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      >
        <ContentTermModal
          onClose={() => setIsPrivacyModalOpen(false)}
          title="개인정보처리방침 조항 편집"
          initialTerms={privacyTerms}
          onSave={(newTerms) => {
            setPrivacyTerms(newTerms);
            setIsPrivacyModalOpen(false);
          }}
        />
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Terms = styled.div`
  display: flex;
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
