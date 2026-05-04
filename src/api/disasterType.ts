import { axiosInstance } from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { DisasterType } from '@/types/common';

// ===================== 재난 유형 =====================
/* 재난 유형 전체 조회 */
export const useDisasterType = () => {
  return useQuery<DisasterType[]>({
    queryKey: ['disasterType'],
    queryFn: async () => {
      const response = await axiosInstance.get('/disaster-types');
      return response.data;
    },
  });
};
