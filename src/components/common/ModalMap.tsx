import styled from 'styled-components';
import { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import ModalClose from '@/assets/icons/Exit.svg?react';
import Position from '@/assets/icons/PositionXS.svg?react';
import { Button } from '@/components/common/Button';

interface ModalProps {
  onClose: () => void;
  currentLat: number;
  currentLng: number;
  onConfirm: (lat: number, lng: number) => void;
}

export const ModalMap = ({
  onClose,
  currentLat,
  currentLng,
  onConfirm,
}: ModalProps) => {
  const [position, setPosition] = useState({
    lat: currentLat,
    lng: currentLng,
  });

  const handleMoveToCurrentLocation = () => {
    setPosition({
      lat: currentLat,
      lng: currentLng,
    });
  };

  return (
    <ModalWrapper>
      <div className="title">
        위치 수정하기
        <ModalXImg onClick={onClose} />
      </div>

      <div className="map">
        <Map
          center={position}
          style={{ width: '100%', height: '300px' }}
          level={3}
          onCenterChanged={(map) =>
            setPosition({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            })
          }
        >
          <MapMarker position={position} />
        </Map>

        <Reset onClick={handleMoveToCurrentLocation} />
      </div>

      <ModalButtonWrapper>
        <Button variant="gray" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="red"
          onClick={() => onConfirm(position.lat, position.lng)}
        >
          확인
        </Button>
      </ModalButtonWrapper>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .map {
    position: relative;
  }
`;

const ModalXImg = styled(ModalClose)`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Reset = styled(Position)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.blue600};
  cursor: pointer;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

  position: absolute;
  left: 8px;
  bottom: 8px;
  z-index: 10;
`;

const ModalButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
