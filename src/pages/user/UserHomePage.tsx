import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import Position from '@/assets/icons/PositionXS.svg?react';
import Down from '@/assets/icons/FilterDown.svg?react';
import ResetIcon from '@/assets/icons/FilterReset.svg?react';
import { useReportClusters, useReportGroupDetail } from '@/api/report';
import { useDisasterType } from '@/api/disasterType';
import { HOME_FILTER } from '@/constant/Filter';
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

  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });
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
    return {
      latitude,
      longitude,
      disasterTypesId: filters.disasterType.includes('전체')
        ? undefined
        : disasterTypes
            ?.filter((disaster) => filters.disasterType.includes(disaster.name))
            .map((disaster) => disaster.id),
      riskLevels: filters.riskLevel.includes('전체')
        ? undefined
        : (filters.riskLevel as RiskLevel[]),
    };
  }, [latitude, longitude, filters, disasterTypes]);

  const { data: clusters } = useReportClusters(params);
  const { data: groupDetail } = useReportGroupDetail(selectedGroupId!);

  const [currentLevel, setCurrentLevel] = useState(3);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);
  const [showCluster, setShowCluster] = useState(false);
  // const [showHeatmap, setShowHeatmap] = useState(false);

  const handleMoveToCurrentLocation = () => {
    setMapCenter({
      lat: latitude,
      lng: longitude,
    });
  };

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

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
    if (currentLevel <= 2) {
      handleNavigate(`/reports/${group.id}`);
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
          onZoomChanged={(map) => setCurrentLevel(map.getLevel())}
          onIdle={(map) => {
            setMapCenter({
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
            calculator={[10, 100]}
            styles={[
              clusterVariant(36, '#EEA3AB', '#E57482'),
              clusterVariant(46, '#DD4658', '#D4182E'),
              clusterVariant(56, '#D4182E', '#AA1325'),
            ]}
          >
            {clusters?.map((group) => {
              const shouldHideIcon = showCluster || currentLevel >= 4;

              return (
                <MapMarker
                  key={group.id}
                  position={{
                    lat: group.centerLatitude,
                    lng: group.centerLongitude,
                  }}
                  title={String(group.id)}
                  image={{
                    src: shouldHideIcon ? '' : 'group.disasterType.iconUrl',
                    size: shouldHideIcon
                      ? { width: 0, height: 0 }
                      : { width: 36, height: 36 },
                  }}
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
  padding: 56px 0px;
  height: calc(100vh - 112px);

  .map {
    width: 100%;
    height: 100%;
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
  top: 72px;
  left: 8px;
  z-index: 10;
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
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  z-index: 10;
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
