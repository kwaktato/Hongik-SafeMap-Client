import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import LocationIcon from '@/assets/icons/PositionS.svg?react';
import { useCreateReportMutation } from '@/api/report';
import { useDisasterType } from '@/api/disasterType';
import { NavBar } from '@/components/common/NavBar';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { FileUploadSection } from '@/components/report/FileUploadSection';
import { Modal } from '@/components/common/Modal';
import { ModalMap } from '@/components/common/ModalMap';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { MediaItem, RiskLevel } from '@/types/common';
import type { ReportRequest } from '@/types/Report';
import { useImgUpload } from '@/hooks/useImgUpload';

export const UserReportPostPage = () => {
  const { handleGoBack, handleNavigate } = useHandleNavigate();

  const { data: disasters } = useDisasterType();
  const disasterOptions = useMemo(() => {
    return (
      disasters?.map((disaster) => ({
        option: (
          <Disaster>
            {disaster.iconUrl ? (
              <img src={disaster.iconUrl} alt={disaster.name} />
            ) : null}
            {disaster.name}
          </Disaster>
        ),
        value: String(disaster.id),
      })) ?? []
    );
  }, [disasters]);

  const riskLevelList: RiskLevel[] = ['긴급', '높음', '보통', '낮음'];

  const [disasterTypeId, setDisasterTypeId] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [description, setDescription] = useState('');

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { latitude, longitude, address, updateLocation } = useCurrentLocation();

  const [uploadedFiles, setUploadedFiles] = useState<MediaItem[]>([]);
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((media) => URL.revokeObjectURL(media.previewUrl));
    };
  }, [uploadedFiles]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const { mutate: createReport } = useCreateReportMutation();
  const { uploadMultipleImages } = useImgUpload();
  const handleButtonClick = async () => {
    const files = uploadedFiles.map((f) => f.file);
    const fileUrls = await uploadMultipleImages(files);

    const reportRequest: ReportRequest = {
      disasterTypeId: Number(disasterTypeId),
      riskLevel: riskLevel as RiskLevel,
      disasterDescription: description,
      latitude: latitude,
      longitude: longitude,
      address: address,
      fileUrls: fileUrls,
    };

    // console.log(reportRequest);

    createReport(reportRequest, {
      onSuccess: () => {
        showToast('제보가 완료되었습니다.');
        handleNavigate('/user');
      },
      onError: () => {
        alert('제보를 등록하지 못했습니다.');
      },
    });
  };

  const isValid =
    disasterTypeId && riskLevel && address.length > 0 && description.length > 0;

  return (
    <Container>
      <NavBar
        center={<NavCenter>재난 상황 제보</NavCenter>}
        right={<Exit onClick={handleGoBack} />}
      />

      <div className="section">
        <div>재난 유형</div>
        <Dropdown
          title="재난 유형을 선택하세요"
          options={disasterOptions}
          selectedOption={disasterTypeId}
          setSelectedOption={setDisasterTypeId}
        />
      </div>

      <div className="section">
        <div>위험 등급</div>
        <Dropdown
          title="위험 등급을 선택하세요"
          options={riskLevelList}
          selectedOption={riskLevel}
          setSelectedOption={setRiskLevel}
        />
      </div>

      <div className="section">
        <label htmlFor="description">상황 설명</label>
        <Description
          id="description"
          typeof="text"
          placeholder="현재 상황을 자세히 설명해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="section">
        <div>위치 정보</div>
        <Location>
          <LocationIcon />
          <div>{address}</div>
        </Location>
        <div className="location">
          현재 위치: {longitude?.toFixed(4)}, {latitude?.toFixed(4)}
        </div>
        <Button variant="white" onClick={() => setIsMapModalOpen(true)}>
          지도에서 위치 수정
        </Button>
      </div>

      <div className="section">
        <div>사진/영상 첨부</div>
        <FileUploadSection
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      </div>

      <Bottom>
        <Button
          variant={isValid ? 'red' : 'gray'}
          // disabled={!isValid}
          onClick={handleButtonClick}
        >
          제보 등록하기
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
  // padding: 0px 20px;
  // padding-bottom: 80px;

  margin: 68px 20px 100px 20px;

  display: flex;
  flex-direction: column;
  gap: 28px;

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .location {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const NavCenter = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const Description = styled.textarea`
  padding: 10px 6px 10px 16px;
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

const Location = styled.div`
  padding: 11px 13px;
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const Bottom = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Disaster = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
