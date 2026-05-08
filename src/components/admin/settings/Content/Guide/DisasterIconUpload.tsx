import styled from 'styled-components';
import { useCallback, useRef } from 'react';
import Close from '@/assets/icons/TextRemove.svg?react';
import Camera from '@/assets/icons/ImageS.svg?react';
import { Button } from '@/components/common/Button';
import type { MediaItem } from '@/types/common';

interface DisasterIconUploadProps {
  uploadedFile: MediaItem | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<MediaItem | null>>;
  defaultIcon?: string;
}

export const DisasterIconUpload = ({
  uploadedFile,
  setUploadedFile,
  defaultIcon,
}: DisasterIconUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUrl = uploadedFile?.previewUrl || defaultIcon;

  const handlePhotoButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }

    setUploadedFile({
      id: `${file.name}`,
      file: file,
      previewUrl: URL.createObjectURL(file),
      type: 'image',
    });

    event.target.value = '';
  };

  const handleRemoveFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
      setUploadedFile(null);
    }
  };

  return (
    <Container>
      <div className="input">아이콘</div>

      <div className="file">
        {fileUrl && (
          <Photos>
            <img src={fileUrl} alt="재난유형 아이콘" />
            <DeletePhoto onClick={handleRemoveFile} />
          </Photos>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Button variant="white" width="44px" onClick={handlePhotoButtonClick}>
          <Camera />
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .file {
    display: flex;
    align-items: flex-end;
    gap: 4px;
  }
`;

const Photos = styled.div`
  width: 44px;
  height: 44px;
  position: relative;

  img {
    width: 44px;
    height: 44px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const DeletePhoto = styled(Close)`
  width: 20px;
  height: 20px;
  cursor: pointer;

  position: absolute;
  top: 1px;
  right: 1px;
`;
