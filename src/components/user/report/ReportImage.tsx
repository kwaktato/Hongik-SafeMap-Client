import styled from 'styled-components';
import { useState } from 'react';
import Hide from '@/assets/icons/HideS.svg?react';

export const ReportImage = ({ url }: { url: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <ReportImageWrapper onClick={() => !isVisible && setIsVisible(true)}>
      <Image src={url} alt="제보 이미지" isVisible={isVisible} />
      {!isVisible && (
        <Overlay>
          <Hide />
          <span>콘텐츠 경고: 민감한 내용의 콘텐츠</span>
          <div>
            재난 상황의 이미지가 포함되어 예상치 못한 장면으로부터 사용자를
            보호합니다.
          </div>
          <button></button>
        </Overlay>
      )}
    </ReportImageWrapper>
  );
};

const ReportImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.gray200};
  position: relative;
`;

const Image = styled.img<{ isVisible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ isVisible }) => (isVisible ? 'none' : 'blur(40px)')};
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.45);

  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  text-align: center;

  span {
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  position: absolute;
  top: 0;
  left: 0;

  .button {
    background: ${({ theme }) => theme.colors.black};
    border-radius: 50%;

    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};

    position: absolute;
    right: 8px;
    bottom: 8px;
  }
`;
