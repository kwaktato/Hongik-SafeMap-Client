import { useState, useEffect } from 'react';

export const useCurrentLocation = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        console.error('위치 정보 가져오기 오류:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    if (latitude === 0 || longitude === 0) return;

    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_REST_KEY}`,
            },
          },
        );

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
          const doc = data.documents[0];
          const fullAddress =
            doc.road_address?.address_name || doc.address.address_name;
          setAddress(fullAddress);
        } else {
          setAddress('주소를 찾을 수 없는 위치입니다.');
        }
      } catch (err) {
        console.error('위치 정보 가져오기 오류:', err);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  const updateLocation = (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  return {
    latitude,
    longitude,
    address,
    updateLocation,
  };
};
