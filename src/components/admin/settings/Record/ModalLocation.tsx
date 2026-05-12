import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MarkerClusterer,
} from 'react-kakao-maps-sdk';
import ModalClose from '@/assets/icons/Exit.svg?react';
import ZoomIn from '@/assets/icons/Upscale.svg?react';
import ZoomOut from '@/assets/icons/Downscale.svg?react';
import { useAdminReportLocations } from '@/api/admin';
import { CheckBox } from '@/components/common/CheckBox';
import { formatYearMonth } from '@/utils/formatDate';

interface ModalLocationProps {
  onClose: () => void;
  groupId: number;
  disasterTitle: string;
  address: string;
}

export const ModalLocation = ({
  onClose,
  groupId,
  disasterTitle,
  address,
}: ModalLocationProps) => {
  const { data } = useAdminReportLocations(groupId);

  const [map, setMap] = useState<kakao.maps.Map>();
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  const [showCluster, setShowCluster] = useState(false);

  useEffect(() => {
    if (data) {
      setMapCenter({
        lat: data.centerLatitude,
        lng: data.centerLongitude,
      });
    }
  }, [data]);

  const RISK_COLORS = {
    긴급: '#D4182E',
    높음: '#E57482',
    보통: '#EEA3AB',
    낮음: '#F6D1D5',
  };

  const BORDER_COLOR = {
    긴급: '#AA1325',
    높음: '#DD4658',
    보통: '#E57482',
    낮음: '#EEA3AB',
  };

  const CustomMarker = ({ loc, iconUrl }: { loc: any; iconUrl: string }) => {
    return (
      <CustomOverlayMap position={{ lat: loc.latitude, lng: loc.longitude }}>
        <MarkerContainer
          color={RISK_COLORS[loc.riskLevel as keyof typeof RISK_COLORS]}
          border={BORDER_COLOR[loc.riskLevel as keyof typeof BORDER_COLOR]}
        >
          <img src={iconUrl} alt="disaster-icon" />
        </MarkerContainer>
      </CustomOverlayMap>
    );
  };

  const clusterVariant = (bgColor: string, borderColor: string) => ({
    width: '56px',
    height: '56px',
    background: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '50%',
    opacity: '0.8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  });

  const zoom = (isZoomIn: boolean) => {
    if (!map) return;
    console.log('줌 클릭됨', isZoomIn);
    const currentLevel = map.getLevel();
    const newLevel = isZoomIn ? currentLevel - 1 : currentLevel + 1;

    if (newLevel < 1 || newLevel > 14) return;

    map.setLevel(newLevel, { animate: true });
  };

  if (!data) return null;

  return (
    <ModalWrapper>
      <div>
        <div className="top">
          {formatYearMonth(data.earliestReportTime)}
          <ModalXImg onClick={onClose} />
        </div>
        <div className="title">{data.title ?? disasterTitle}</div>
        <div className="address">{address}</div>
      </div>

      <MapWrapper>
        <MapOptions>
          <CheckBox
            key="클러스터"
            id="클러스터"
            label="클러스터"
            width="16px"
            height="16px"
            color="black"
            borderRadius="4px"
            checked={showCluster}
            onChange={() => setShowCluster(!showCluster)}
          />
        </MapOptions>

        <Map
          center={mapCenter}
          style={{ width: '100%', height: '400px' }}
          level={2}
          onCreate={setMap}
        >
          {showCluster ? (
            <MarkerClusterer
              averageCenter={true}
              minLevel={1}
              minClusterSize={1}
              calculator={[10, 30]}
              styles={[
                clusterVariant('#EEA3AB', '#E57482'),
                clusterVariant('#DD4658', '#D4182E'),
                clusterVariant('#D4182E', '#AA1325'),
              ]}
            >
              {data.reportLocations.map((location, index) => (
                <MapMarker
                  key={`cluster-${index}`}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  image={{
                    src: data.disasterType.iconUrl,
                    size: { width: 56, height: 56 },
                  }}
                />
              ))}
            </MarkerClusterer>
          ) : (
            data.reportLocations.map((location, index) => (
              <CustomMarker
                key={index}
                loc={location}
                iconUrl={data.disasterType.iconUrl}
              />
            ))
          )}
        </Map>

        <Zoom>
          <div className="icon" onClick={() => zoom(true)}>
            <ZoomIn />
          </div>
          <div className="icon" onClick={() => zoom(false)}>
            <ZoomOut />
          </div>
        </Zoom>
      </MapWrapper>

      <Guide>
        <span>{data.title} 재난 기록</span>
        <div>총 {data.reportCount}건의 제보가 기록되어 있습니다.</div>
      </Guide>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 20px;
  width: 560px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  position: relative;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title22};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .title {
    margin: 4px 0px 8px 0px;
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.head30};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .address {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const ModalXImg = styled(ModalClose)`
  cursor: pointer;
`;

const MapWrapper = styled.div`
  border-radius: 8px;
  position: relative;
`;

const MapOptions = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray500};
  border-radius: 8px;

  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
`;

const Zoom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 10;

  .icon {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.gray500};
    border-radius: 8px;
  }
`;

const MarkerContainer = styled.div<{ color: string; border: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  border: 2px solid ${({ border }) => border};

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

const Guide = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};

  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  span {
    width: 120px;
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;
