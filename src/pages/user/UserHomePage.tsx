import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MarkerClusterer,
} from 'react-kakao-maps-sdk';
import Position from '@/assets/icons/PositionXS.svg?react';
import Down from '@/assets/icons/FilterDown.svg?react';
import ResetIcon from '@/assets/icons/FilterReset.svg?react';
import { useReportClusters, useReportGroupDetail } from '@/api/report';
import { useDisasterType } from '@/api/disasterType';
import { HOME_FILTER } from '@/constant/Filter';
import { useMapContext } from '@/contexts/MapContext';
import { TitleHeader } from '@/components/common/TitleHeader';
import { CheckBox } from '@/components/common/CheckBox';
import { BottomSheetReport } from '@/components/common/BottomSheetReport';
import { BottomSheetFilter } from '@/components/common/BottomSheetFilter';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { DisasterGroup, DisasterGroupParams } from '@/types/Report';
import type { FilterState, RiskLevel } from '@/types/common';

export const UserHomePage = () => {
  const { handleNavigate } = useHandleNavigate();
  const { latitude, longitude } = useCurrentLocation();

  const { lastCenter, setLastCenter, lastLevel, setLastLevel } =
    useMapContext();

  const [mapCenter, setMapCenter] = useState(() => {
    if (lastCenter) return lastCenter;
    return { lat: latitude, lng: longitude };
  });
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>();
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);

  const { data: disasterTypes } = useDisasterType();
  const [filters, setFilters] = useState<FilterState>({
    disasterType: ['전체'],
    riskLevel: ['전체'],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('disasterType');

  const params: DisasterGroupParams = useMemo(() => {
    console.log(mapCenter.lat, mapCenter.lng);
    return {
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
      disasterTypesId: filters.disasterType.includes('전체')
        ? undefined
        : disasterTypes
            ?.filter((disaster) => filters.disasterType.includes(disaster.name))
            .map((disaster) => disaster.id),
      riskLevels: filters.riskLevel.includes('전체')
        ? undefined
        : (filters.riskLevel as RiskLevel[]),
      isActive: false,
    };
  }, [mapCenter, filters, disasterTypes]);

  const { data: clusters } = useReportClusters(params);
  const { data: groupDetail } = useReportGroupDetail(selectedGroupId!);

  const [currentLevel, setCurrentLevel] = useState(lastLevel);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const [showCluster, setShowCluster] = useState(false);
  // const [showHeatmap, setShowHeatmap] = useState(false);

  const handleMoveToCurrentLocation = () => {
    if (latitude && longitude) {
      setMapCenter({
        lat: latitude,
        lng: longitude,
      });
      setLastCenter({
        lat: latitude,
        lng: longitude,
      });
    }
  };

  useEffect(() => {
    if (!lastCenter && latitude && longitude) {
      const initialLoc = { lat: latitude, lng: longitude };
      setMapCenter(initialLoc);
      setLastCenter(initialLoc);
    }
  }, [latitude, longitude, lastCenter, setLastCenter]);

  useEffect(() => {
    if (clustererRef.current) {
      clustererRef.current.redraw();
    }
  }, [showCluster, currentLevel]);

  const handleClusterClick = (
    target: kakao.maps.MarkerClusterer,
    cluster: kakao.maps.Cluster,
  ) => {
    const map = target.getMap();
    if (!map) return;

    const level = map.getLevel();
    const markers = cluster.getMarkers();
    const firstMarker = markers[0];
    const groupId =
      firstMarker instanceof kakao.maps.Marker
        ? Number(firstMarker.getTitle())
        : null;

    if (level >= 5 && !showCluster) {
      const center = cluster.getCenter();
      map.setCenter(center);
      map.setLevel(level - 1, { animate: true });
    } else {
      if (groupId) handleGroupClick(groupId);
    }
  };

  const handleMarkerClick = (group: DisasterGroup) => {
    if (currentLevel <= 3) {
      handleNavigate(`/user/report/${group.id}`);
    } else {
      handleGroupClick(group.id);
    }
  };

  const handleGroupClick = async (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsReportSheetOpen(true);
  };

  const clusterVariant = (
    size: number,
    bgColor: string,
    borderColor: string,
  ) => ({
    width: `${size}px`,
    height: `${size}px`,
    background: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '50%',
    color: '#fff',
    textAlign: 'center' as const,
    opacity: '0.8',
    fontSize: '18px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const filter = useMemo(() => {
    const config = { ...HOME_FILTER };
    if (disasterTypes) {
      config.disasterType.items = [
        { label: '전체' },
        ...disasterTypes.map((disaster) => ({
          label: disaster.name,
          icon: disaster.iconUrl ? (
            <img src={disaster.iconUrl} alt={disaster.name} />
          ) : null,
        })),
      ];
    }
    return config;
  }, [disasterTypes]);

  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

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

  const CustomMarker = ({
    loc,
    iconUrl,
    onClick,
  }: {
    loc: any;
    iconUrl: string;
    onClick: () => void;
  }) => {
    return (
      <CustomOverlayMap
        position={{ lat: loc.centerLatitude, lng: loc.centerLongitude }}
      >
        <MarkerContainer
          color={RISK_COLORS[loc.latestRiskLevel as keyof typeof RISK_COLORS]}
          border={
            BORDER_COLOR[loc.latestRiskLevel as keyof typeof BORDER_COLOR]
          }
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <img src={iconUrl} alt="disaster-icon" />
        </MarkerContainer>
      </CustomOverlayMap>
    );
  };

  return (
    <Container>
      <TitleHeader
        home={true}
        mainTitle="실시간 지도"
        subTitle="실시간 재난 현황 지도"
      />

      <FilterWrapper>
        {Object.entries(filter).map(([key, value]) => {
          const selectedValues = filters[key as keyof FilterState];
          const displayLabel = selectedValues.includes('전체')
            ? value.tabLabel
            : selectedValues.length > 1
              ? `${selectedValues[0]} 외 ${selectedValues.length - 1}`
              : selectedValues[0];

          return (
            <Filter
              key={key}
              isSelected={!selectedValues.includes('전체')}
              onClick={() => {
                setActiveTab(key);
                setIsFilterOpen(true);
              }}
            >
              {displayLabel}
              <Down />
            </Filter>
          );
        })}
        <Reset
          onClick={() =>
            setFilters({ disasterType: ['전체'], riskLevel: ['전체'] })
          }
        >
          <ResetIcon />
        </Reset>
      </FilterWrapper>

      <div className="map">
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
          style={{ width: '100%', height: '100%' }}
          level={currentLevel}
          onZoomChanged={(map) => {
            setCurrentLevel(map.getLevel());
            setLastLevel(map.getLevel());
          }}
          onIdle={(map) => {
            setMapCenter({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            });
            setLastCenter({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            });
          }}
        >
          <MarkerClusterer
            averageCenter={true}
            minLevel={showCluster ? 1 : 4}
            disableClickZoom={true}
            onCreate={(clusterer) => {
              clusterer.setMinClusterSize(1);
              clustererRef.current = clusterer;
            }}
            onClusterclick={handleClusterClick}
            calculator={[5, 15]}
            styles={[
              clusterVariant(36, '#EEA3AB', '#E57482'),
              clusterVariant(46, '#DD4658', '#D4182E'),
              clusterVariant(56, '#D4182E', '#AA1325'),
            ]}
          >
            {clusters?.map((group, index) => {
              if (showCluster || currentLevel >= 4) {
                return (
                  <MapMarker
                    key={group.id}
                    position={{
                      lat: group.centerLatitude,
                      lng: group.centerLongitude,
                    }}
                    title={String(group.id)}
                    image={{
                      src: '',
                      size: { width: 0, height: 0 },
                    }}
                    onClick={() => handleMarkerClick(group)}
                  />
                );
              }

              return (
                <CustomMarker
                  key={index}
                  loc={group}
                  iconUrl={group.disasterType.iconUrl}
                  onClick={() => handleMarkerClick(group)}
                />
              );
            })}
          </MarkerClusterer>
        </Map>

        <LocationReset onClick={handleMoveToCurrentLocation} />
      </div>

      <BottomSheetFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        height="450px"
        filter={filter}
        initialValue={filters}
        defaultTab={activeTab}
        onApply={handleApplyFilter}
        buttonBottom="56px"
      />

      {groupDetail && (
        <BottomSheetReport
          isOpen={isReportSheetOpen}
          onClose={() => {
            setIsReportSheetOpen(false);
            setSelectedGroupId(null);
          }}
          group={groupDetail}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 56px;
  bottom: 56px;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;

  .map {
    flex: 1;
    width: 100%;
    position: relative;
  }
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
  top: 8px;
  left: 8px;
  z-index: 10;
`;

const MarkerContainer = styled.div<{ color: string; border: string }>`
  width: 36px;
  height: 36px;
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

const LocationReset = styled(Position)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.red600};
  cursor: pointer;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

  position: absolute;
  right: 33px;
  bottom: 96px;
  z-index: 10;
`;

const FilterWrapper = styled.div`
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

const Filter = styled.div<{ isSelected: boolean }>`
  padding: 6px 4px 6px 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.colors.red600 : theme.colors.gray400};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.red600 : theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  svg {
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.red600 : theme.colors.gray600};
  }
`;

const Reset = styled.div`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
`;
