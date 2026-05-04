import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import { useCreateResourceMutation } from '@/api/board';
import { NavBar } from '@/components/common/NavBar';
import { Dropdown } from '@/components/common/Dropdown';
import { InputBox } from '@/components/common/InputBox';
import { FileUploadSection } from '@/components/report/FileUploadSection';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { ModalMap } from '@/components/common/ModalMap';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import { useImgUpload } from '@/hooks/useImgUpload';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { MediaItem } from '@/types/common';
import type { ResourceRequest } from '@/types/Post';

export const ResourceBoardWritePage = () => {
  const { handleGoBack, handleNavigate } = useHandleNavigate();

  const typeList = ['요청', '공급'];
  const categoryList = ['식량', '식수', '의약품', '대피처', '의류', '도구'];

  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<MediaItem[]>([]);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { latitude, longitude, address, updateLocation } = useCurrentLocation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((media) => URL.revokeObjectURL(media.previewUrl));
    };
  }, [uploadedFiles]);

  useEffect(() => {
    setLocation(address);
  });

  const { mutate: postResource } = useCreateResourceMutation();
  const { uploadMultipleImages } = useImgUpload();
  const handleButtonClick = async () => {
    const files = uploadedFiles.map((f) => f.file);
    const fileUrls = await uploadMultipleImages(files);

    const postRequest: ResourceRequest = {
      type: type,
      category: category,
      title: title,
      description: description,
      location: location,
      fileUrls: fileUrls,
    };

    postResource(postRequest, {
      onSuccess: () => {
        showToast('게시물을 등록했습니다.');
        handleNavigate('/user/resource');
      },
      onError: () => alert('게시물을 등록하지 못했습니다.'),
    });
  };

  const isValid =
    type &&
    category &&
    title.length > 0 &&
    location.length > 0 &&
    description.length > 0;

  return (
    <Container>
      <NavBar
        center={<NavCenter>자원 게시물 작성</NavCenter>}
        right={<Exit onClick={handleGoBack} />}
      />

      <div className="dropdown">
        <div className="section">
          <div className="title">
            유형
            <Dot />
          </div>
          <Dropdown
            title="유형"
            options={typeList}
            selectedOption={type}
            setSelectedOption={setType}
          />
        </div>
        <div className="section">
          <div className="title">
            카테고리
            <Dot />
          </div>
          <Dropdown
            title="카테고리"
            options={categoryList}
            selectedOption={category}
            setSelectedOption={setCategory}
          />
        </div>
      </div>

      <div className="section">
        <div className="title">
          제목
          <Dot />
        </div>
        <InputBox
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">
          <label htmlFor="description">상세 내용</label>
          <Dot />
        </div>
        <Description
          id="description"
          typeof="text"
          placeholder="자원에 대한 상세 정보를 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">
          위치 정보
          <Dot />
        </div>
        <InputBox
          placeholder="위치를 입력하세요 (예 : 서울시 강남구 역삼동)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button variant="white" onClick={() => setIsMapModalOpen(true)}>
          지도에서 위치 수정
        </Button>
      </div>

      <div className="section">
        <div className="title">사진/영상 첨부</div>
        <FileUploadSection
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      </div>

      <Bottom>
        <Button
          variant={isValid ? 'red' : 'gray'}
          disabled={!isValid}
          onClick={handleButtonClick}
        >
          게시물 등록하기
        </Button>
      </Bottom>

      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)}>
        <ModalMap
          onClose={() => setIsMapModalOpen(false)}
          currentLat={latitude}
          currentLng={longitude}
          onConfirm={(newLat, newLng) => {
            updateLocation(newLat, newLng);
            setIsMapModalOpen(false);
          }}
        />
      </Modal>

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  margin: 68px 20px 92px 20px;

  display: flex;
  flex-direction: column;
  gap: 28px;

  .dropdown {
    display: flex;
    gap: 8px;
  }

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    display: flex;
    gap: 2px;
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const NavCenter = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const Dot = styled.div`
  margin-top: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.red600};
`;

const Description = styled.textarea`
  padding: 12px 6px 12px 16px;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};
  resize: none;
  box-sizing: border-box;
  border: none;
  word-break: break-all;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    outline: none;
  }

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
    border: 4px solid ${({ theme }) => theme.colors.gray300};
  }

  & {
    scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
  }
`;

const Bottom = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;
