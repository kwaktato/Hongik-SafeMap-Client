export interface KakaoAddressResult {
  region_1depth_name: string; // 광역 (서울)
  region_2depth_name: string; // 기초 (강남구)
  region_3depth_name: string; // 하위 (역삼동)
}

/* 좌표를 행정동 주소 객체로 변환 */
export const getOfficialAddress = (
  lat: number,
  lng: number,
): Promise<KakaoAddressResult> => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2RegionCode(lng, lat, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const adminRegion = result.find((res: any) => res.region_type === 'H');
        resolve(adminRegion || result[0]);
      } else {
        reject(new Error('주소를 불러오는데 실패했습니다.'));
      }
    });
  });
};

/* 제목 생성: 기초(시/군/구) + 심각도 수식어 + 재난 유형 */
export const formatRecordTitle = (
  addr: KakaoAddressResult,
  level: string,
  type: string,
) => {
  return `${addr.region_2depth_name} ${level === '긴급' ? '대형 ' : ''} ${type}`;
};

/* 주소 포맷팅: 요약(서울 강남구) vs 상세(서울 강남구 역삼동 일대) */
export const formatAddress = (addr: KakaoAddressResult, isDetail: boolean) => {
  const { region_1depth_name, region_2depth_name, region_3depth_name } = addr;

  // 광역 자치단체 줄임표 처리 (서울특별시 -> 서울, 경기도 -> 경기)
  const short1Depth = region_1depth_name.substring(0, 2);

  if (isDetail) {
    return `${short1Depth} ${region_2depth_name} ${region_3depth_name} 일대`;
  }
  return `${short1Depth} ${region_2depth_name}`;
};
