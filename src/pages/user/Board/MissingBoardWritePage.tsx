import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import { useCreateMissingMutation } from '@/api/board';
import { NavBar } from '@/components/common/NavBar';
import { Dropdown } from '@/components/common/Dropdown';
import { InputBox } from '@/components/common/InputBox';
import { FileUploadSection } from '@/components/report/FileUploadSection';
import { Modal } from '@/components/common/Modal';
import { ModalMap } from '@/components/common/ModalMap';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import { useImgUpload } from '@/hooks/useImgUpload';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { MediaItem } from '@/types/common';
import type { MissingRequest } from '@/types/Post';

export const MissingBoardWritePage = () => {
  const { handleGoBack, handleNavigate } = useHandleNavigate();

  const categoryList = ['사람', '반려동물', '소지품'];

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [characteristic, setCharacteristic] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
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
    setCurrentLocation(address);
  });

  const { mutate: postMissing } = useCreateMissingMutation();
  const { uploadMultipleImages } = useImgUpload();
  const handleButtonClick = async () => {
    const files = uploadedFiles.map((f) => f.file);
    const fileUrls = await uploadMultipleImages(files);

    const postRequest: MissingRequest = {
      category: category,
      title: title,
      description: description,
      age: age,
      characteristic: characteristic,
      lastSeen: lastSeen,
      currentLocation: currentLocation,
      fileUrls: fileUrls,
    };

    postMissing(postRequest, {
      onSuccess: () => {
        showToast('제보가 완료되었습니다.');
        handleNavigate('/user/missing');
      },
      onError: () => alert('제보를 등록하지 못했습니다.'),
    });
  };

  const isValid =
    category &&
    title.length > 0 &&
    description.length > 0 &&
    characteristic.length > 0 &&
    lastSeen.length > 0 &&
    currentLocation.length > 0;

  return (
    <Container>
      <NavBar
        center={<NavCenter>실종/분실 신고 등록</NavCenter>}
        right={<Exit onClick={handleGoBack} />}
      />

      <div className="section">
        <div className="title">
          카테고리
          <Dot />
        </div>
        <Dropdown
          title="카테고리를 선택하세요"
          options={categoryList}
          selectedOption={category}
          setSelectedOption={setCategory}
        />
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
          <label htmlFor="description">상세 설명</label>
          <Dot />
        </div>
        <Description
          id="description"
          typeof="text"
          placeholder="실종/분실 상황을 자세히 설명해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">나이 / 연령</div>
        <InputBox
          placeholder="예 : 72세, 3살"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">
          특징
          <Dot />
        </div>
        <InputBox
          placeholder="특징을 입력하세요"
          value={characteristic}
          onChange={(e) => setCharacteristic(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">
          마지막 목격 장소
          <Dot />
        </div>
        <InputBox
          placeholder="위치를 입력하세요 (예 : 서울시 강남구 역삼동)"
          value={lastSeen}
          onChange={(e) => setLastSeen(e.target.value)}
        />
      </div>

      <div className="section">
        <div className="title">
          현재 위치
          <Dot />
        </div>
        <InputBox
          placeholder="위치를 입력하세요 (예 : 서울시 강남구 역삼동)"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
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
          신고 등록하기
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
  padding: 12px 8px 12px 16px;
  width: 100%;
  height: 80px;
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
