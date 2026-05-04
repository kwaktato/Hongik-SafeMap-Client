import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import Close from '@/assets/icons/TextRemove.svg?react';
import Camera from '@/assets/icons/ImageS.svg?react';
import Exit from '@/assets/icons/Exit.svg?react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import type { MediaItem } from '@/types/common';

interface FileUploadSectionProps {
  uploadedFiles: MediaItem[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const FileUploadSection = ({
  uploadedFiles,
  setUploadedFiles,
}: FileUploadSectionProps) => {
  const [previewImage, setPreviewImage] = useState('');
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files && files.length > 0) {
        const newUploadedFiles: MediaItem[] = Array.from(files).map((file) => {
          const fileType = file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
              ? 'video'
              : 'unknown';
          return {
            id: `${file.name}`,
            file: file,
            previewUrl: URL.createObjectURL(file),
            type: fileType,
          };
        });

        setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);
      }
    },
    [setUploadedFiles],
  );

  const handleRemoveFile = useCallback(
    (idToRemove: string) => {
      setUploadedFiles((prevFiles) => {
        const fileToRemove = prevFiles.find((f) => f.id === idToRemove);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.previewUrl); // 메모리 해제
        }
        return prevFiles.filter(
          (uploadedFile) => uploadedFile.id !== idToRemove,
        );
      });
    },
    [setUploadedFiles],
  );

  const handleImgClick = (url: string) => {
    setPreviewImage(url);
    setIsImgModalOpen(true);
  };

  return (
    <>
      <Button
        variant="white"
        onClick={handlePhotoButtonClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          lineHeight: '23px',
        }}
      >
        <Camera />
        파일 선택
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*, video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {uploadedFiles.length > 0 && (
        <Photos>
          {uploadedFiles.map((uploadedFile) => (
            <div className="photo" key={uploadedFile.id}>
              {uploadedFile.type === 'image' ? (
                <img
                  src={uploadedFile.previewUrl}
                  alt={uploadedFile.file.name}
                  onClick={() => handleImgClick(uploadedFile.previewUrl)}
                />
              ) : uploadedFile.type === 'video' ? (
                <video src={uploadedFile.previewUrl} controls />
              ) : (
                <div> {uploadedFile.file.name} (미지원 형식)</div>
              )}
              <DeletePhoto onClick={() => handleRemoveFile(uploadedFile.id)} />
            </div>
          ))}
        </Photos>
      )}

      <Modal isOpen={isImgModalOpen} onClose={() => setIsImgModalOpen(false)}>
        <ModalClose onClick={() => setIsImgModalOpen(false)} />
        <img src={previewImage} />
      </Modal>
    </>
  );
};

const Photos = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  flex-wrap: nowrap;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .photo {
    width: 150px;
    height: 150px;
    position: relative;
  }

  img,
  video {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
`;

const DeletePhoto = styled(Close)`
  cursor: pointer;

  position: absolute;
  top: 4px;
  right: 3px;
`;

const ModalClose = styled(Exit)`
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 3px;
`;
