import styled from 'styled-components';
import ModalClose from '@/assets/icons/Exit.svg?react';
import { useTermsAgree, useTermsMyAgree } from '@/api/term';
import { AgreeToggle } from '@/components/user/mypage/AgreeToggle';
import type { Term, TermAgreeRequest } from '@/types/Term';
import { formatDashDate } from '@/utils/formatDate';
import { useMemo } from 'react';

interface TermModalProps {
  onClose: () => void;
  type: string;
  term: Term | undefined;
}

export const TermModal = ({ onClose, type, term }: TermModalProps) => {
  const { data: myAgreements } = useTermsMyAgree();

  const { mutate: agree } = useTermsAgree();

  const isAgreed = useMemo(() => {
    if (!myAgreements || !term) return false;

    return myAgreements.some((agree) =>
      type === '이용약관'
        ? agree.termsVersion === term.version
        : agree.privacyPolicyVersion === term.version,
    );
  }, [myAgreements, term, type]);

  const handleToggle = () => {
    if (!term) return;

    const latest = myAgreements?.[0];

    const request: TermAgreeRequest = {
      termsVersion:
        type === '이용약관' ? term.version : (latest?.termsVersion ?? '1.0'),
      privacyPolicyVersion:
        type === '개인정보처리방침'
          ? term.version
          : (latest?.privacyPolicyVersion ?? '1.0'),
    };

    agree(request);
  };

  if (!term) return null;

  return (
    <ModalWrapper>
      <div className="top">
        <div>{type} 조항</div>
        <ModalClose onClick={onClose} />
      </div>

      <div className="top">
        <div className="title">{term.title}</div>
        <div className="agree">
          동의
          <AgreeToggle checked={isAgreed} onChange={handleToggle} />
        </div>
      </div>

      <VersionWrapper>
        <div className="version">
          버전
          <span>{term.version}</span>
        </div>
        <div className="divider" />
        <div className="version">
          날짜
          <span>{formatDashDate(term.date)}</span>
        </div>
      </VersionWrapper>

      <TermWrapper>
        {term.sections?.map((section) => (
          <div className="terms">
            <div className="header">{section.header}</div>
            <div className="content">{section.content}</div>
          </div>
        ))}
      </TermWrapper>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 600px;
  max-height: 75vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .agree {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const VersionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .version {
    display: flex;
    align-items: center;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};

    span {
      color: ${({ theme }) => theme.colors.gray1000};
    }
  }

  .divider {
    width: 1px;
    height: 8px;
    background: ${({ theme }) => theme.colors.gray500};
  }
`;

const TermWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;

  /* 1. 전체 스크롤바 너비 */
  &::-webkit-scrollbar {
    width: 12px;
  }

  /* 2. 스크롤바 트랙 (바탕) */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 3. 스크롤바 막대 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray500};
    border-radius: 12px;
    border: 4px solid ${({ theme }) => theme.colors.white};
  }

  & {
    scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
  }

  .terms {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .header {
    box-sizing: border-box;
    width: 100%;

    border-radius: 8px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .content {
    padding: 16px;
    width: 100%;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.gray200};
    resize: none;
    box-sizing: border-box;
    border: none;
    word-break: break-all;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;
