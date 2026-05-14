import styled from 'styled-components';
import { useState } from 'react';
import ChevronDown from '@/assets/icons/ChevronDown.svg?react';
import ChevronUp from '@/assets/icons/ChevronUp.svg?react';
import { CheckBox } from '@/components/common/CheckBox';
import type { Term } from '@/types/Term';

interface SignupTermsProps {
  term: Term | undefined;
  checked: boolean;
  onChange: () => void;
}

export const SignupTerms = ({ term, checked, onChange }: SignupTermsProps) => {
  const [showOptions, setShowOptions] = useState(false);

  if (!term) return null;

  return (
    <Wrapper>
      <div className="top">
        <div className="left" onClick={onChange}>
          <CheckBox
            width="20px"
            height="20px"
            borderRadius="50%"
            checked={checked}
            readOnly
          />
          <div className="title">{term.title}</div>
        </div>
        <div
          className="icons"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions((prev) => !prev);
          }}
        >
          {showOptions ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {showOptions && (
        <TermWrapper>
          {term.sections?.map((section) => (
            <div className="terms">
              <div className="header">{section.header}</div>
              <div className="content">{section.content}</div>
            </div>
          ))}
        </TermWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    cursor: pointer;
  }

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .icons {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

const TermWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  border: 1px solid ${({ theme }) => theme.colors.gray500};
  border-radius: 8px;

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
    gap: 8px;
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
