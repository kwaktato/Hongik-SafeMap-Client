import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MarkerClusterer,
} from 'react-kakao-maps-sdk';
import ModalClose from '@/assets/icons/Exit.svg?react';
import Play from '@/assets/icons/PlayerButtonPlay.svg?react';
import Pause from '@/assets/icons/PlayerButtonStop.svg?react';
import Reset from '@/assets/icons/PlayerButtonReset.svg?react';
import ZoomIn from '@/assets/icons/Upscale.svg?react';
import ZoomOut from '@/assets/icons/Downscale.svg?react';
import { useAdminReportSimulation } from '@/api/admin';
import { CheckBox } from '@/components/common/CheckBox';
import { Button } from '@/components/common/Button';
import { formatSimpleDate } from '@/utils/formatDate';

interface ModalSimulationProps {
  onClose: () => void;
  reportId: number;
  title: string;
  date: string;
}

export const ModalSimulation = ({
  onClose,
  reportId,
  title,
  date,
}: ModalSimulationProps) => {
  const { data } = useAdminReportSimulation(reportId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [map, setMap] = useState<kakao.maps.Map>();
  const [showCluster, setShowCluster] = useState(false);

  const frames = data?.frames ?? [];
  const totalFrames = frames.length;
  const currentFrame = frames[currentIdx] ?? null;

  const elapsedTime = useMemo(() => {
    const start = new Date(frames[0]?.statistics?.reportTime).getTime();
    const current = new Date(currentFrame?.statistics?.reportTime).getTime();
    const diffMs = current - start;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) return `${diffMinutes}분`;
    return `${diffHours}시간 ${diffMinutes}분`;
  }, [frames, currentFrame]);

  useEffect(() => {
    if (frames.length > 0 && frames[0].locations?.length > 0) {
      setMapCenter({
        lat: frames[0].locations[0].latitude,
        lng: frames[0].locations[0].longitude,
      });
    }
  }, [frames]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && totalFrames > 0 && currentIdx < totalFrames - 1) {
      timer = setInterval(() => {
        setCurrentIdx((prev) => prev + 1);
      }, speed);
    } else if (currentIdx >= totalFrames - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentIdx, totalFrames, speed]);

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

  const accumulatedMarkers = useMemo(() => {
    if (totalFrames === 0) return [];
    return frames
      .slice(0, currentIdx + 1)
      .flatMap((frame) => frame.locations ?? []);
  }, [frames, currentIdx, totalFrames]);

  useEffect(() => {
    if (!map || accumulatedMarkers.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();

    accumulatedMarkers.forEach((loc) => {
      bounds.extend(new kakao.maps.LatLng(loc.latitude, loc.longitude));
    });

    map.setBounds(bounds);
  }, [accumulatedMarkers, map]);

  const progress = totalFrames > 1 ? (currentIdx / (totalFrames - 1)) * 100 : 0;

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
          재난 확산 패턴 시뮬레이션
          <ModalXImg onClick={onClose} />
        </div>
        <div className="title">{title}</div>
        <div className="date">{date}</div>
      </div>

      <div className="content">
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
            onCreate={setMap}
            style={{ width: '480px', height: '400px' }}
            level={2}
          >
            {showCluster ? (
              <MarkerClusterer
                averageCenter={true}
                minLevel={1}
                minClusterSize={1}
                styles={[clusterVariant('#D4182E', '#AA1325')]}
              >
                {frames.slice(0, currentIdx + 1).map((frame, index) => (
                  <MapMarker
                    key={`cluster-${index}`}
                    position={{
                      lat: frame.locations[0].latitude,
                      lng: frame.locations[0].longitude,
                    }}
                    image={{
                      src: data?.summary?.disasterType?.iconUrl,
                      size: { width: 56, height: 56 },
                    }}
                  />
                ))}
              </MarkerClusterer>
            ) : (
              accumulatedMarkers.map((loc, index) => (
                <CustomMarker
                  key={`${currentIdx}-${index}`}
                  loc={loc}
                  iconUrl={data?.summary?.disasterType?.iconUrl}
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

        <SummaryWrapper>
          <div>실시간 통계 데이터</div>

          <BoxWrapper>
            <div className="time">
              <div>시뮬레이션 시간</div>
              <div className="red">
                {currentFrame
                  ? formatSimpleDate(currentFrame?.statistics?.reportTime, true)
                  : '-'}
              </div>
            </div>

            <div className="bottom">
              <div className="time">
                <div>경과 시간</div>
                <div className="black">{elapsedTime}</div>
              </div>

              <div className="time">
                <div>제보</div>
                <div className="black">
                  {currentFrame?.statistics.cumulativeCount}건
                  <div className="gray">
                    / {data?.summary?.totalReportCount}건
                  </div>
                </div>
              </div>
            </div>
          </BoxWrapper>

          <div className="risks">
            <RiskBox color="red">
              <div className="level">긴급</div>
              <div className="count">
                {currentFrame
                  ? currentFrame.statistics.riskLevelCounts.긴급
                  : 0}
                건
              </div>
            </RiskBox>

            <RiskBox color="black">
              <div className="level">높음</div>
              <div className="count">
                {currentFrame
                  ? currentFrame.statistics.riskLevelCounts.높음
                  : 0}
                건
              </div>
            </RiskBox>

            <RiskBox color="gray">
              <div className="level">보통</div>
              <div className="count">
                {currentFrame
                  ? currentFrame.statistics.riskLevelCounts.보통
                  : 0}
                건
              </div>
            </RiskBox>

            <RiskBox color="low">
              <div className="level">낮음</div>
              <div className="count">
                {currentFrame
                  ? currentFrame.statistics.riskLevelCounts.낮음
                  : 0}
                건
              </div>
            </RiskBox>
          </div>
        </SummaryWrapper>
      </div>

      <ControlWrapper>
        <ControlBar
          type="range"
          min={0}
          max={totalFrames - 1}
          value={currentIdx}
          progress={progress}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIdx(Number(e.target.value));
          }}
        />

        <div className="bottom">
          <div className="icons">
            <div onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause /> : <Play />}
            </div>
            <div
              onClick={() => {
                setCurrentIdx(0);
                setIsPlaying(false);
              }}
            >
              <Reset />
            </div>
          </div>
          <div className="icons">
            <Button
              width="44px"
              height="32px"
              variant={speed === 1000 ? 'red' : 'white'}
              onClick={() => setSpeed(1000)}
            >
              0.5x
            </Button>
            <Button
              width="44px"
              height="32px"
              variant={speed === 500 ? 'red' : 'white'}
              onClick={() => setSpeed(500)}
            >
              1x
            </Button>
            <Button
              width="44px"
              height="32px"
              variant={speed === 250 ? 'red' : 'white'}
              onClick={() => setSpeed(250)}
            >
              2x
            </Button>
          </div>
        </div>
      </ControlWrapper>

      <Guide>
        <span>시뮬레이션 안내</span>
        <div>
          이 시뮬레이션은 과거 재난 발생 시점부터 24시간 동안의 제보 확산 패턴을
          보여줍니다. 타임라인을 조정하거나 재생 버튼을 눌러 시간에 따른 재난
          상황 변화를 확인할 수 있습니다.
        </div>
      </Guide>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  padding: 20px;
  width: 1048px;
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

  .date {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .content {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
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
  left: 12px;
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

const SummaryWrapper = styled.div`
  width: 100%;
  height: 360px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .risks {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
`;

const BoxWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;

  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .time {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;

    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .black {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.font.fontSize.head26};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .red {
    color: ${({ theme }) => theme.colors.red600};
    font-size: ${({ theme }) => theme.font.fontSize.head26};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .gray {
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.head26};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const RiskBox = styled.div<{ color: string }>`
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme, color }) => {
    switch (color) {
      case 'red':
        return theme.colors.red600;
      case 'black':
        return theme.colors.black;
      case 'gray':
        return theme.colors.gray400;
      case 'low':
        return theme.colors.gray200;
      default:
        return theme.colors.gray400;
    }
  }};
  border-radius: 8px;

  .level {
    color: ${({ theme, color }) =>
      color === 'gray' || color === 'low'
        ? theme.colors.gray800
        : theme.colors.white};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .count {
    color: ${({ theme, color }) =>
      color === 'gray' || color === 'low'
        ? theme.colors.gray900
        : theme.colors.white};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .reset {
    width: 36px;
    height: 36px;
  }
`;

const ControlBar = styled.input<{ progress: number }>`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: ${({ theme, progress }) =>
    `linear-gradient(to right, ${theme.colors.red600} ${progress}%, ${theme.colors.gray300} ${progress}%)`};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.colors.red600};
    border-radius: 50%;
    transition: transform 0.1s ease-in-out;
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
