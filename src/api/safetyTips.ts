import { axiosInstance } from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { SafetyTipItem, SafetyTipSummary } from '@/types/SafetyTips';

// ===================== 행동 요령 =====================
/* 전체 행동 요령 조회 */
export const useSafetyTips = () => {
  return useQuery<SafetyTipItem[]>({
    queryKey: ['safetyTips'],
    queryFn: async () => {
      const response = await axiosInstance.get('/safety-tips');
      return response.data;
    },
  });
};

/* 전체 행동 요령 요약 조회 */
export const useSafetyTipSummary = () => {
  return useQuery<SafetyTipSummary[]>({
    queryKey: ['safetyTips', 'summary'],
    queryFn: async () => {
      const response = await axiosInstance.get('/safety-tips/summary');
      return response.data;
    },
  });
};

/* 재난 유형별 행동 요령 조회 */
export const useSafetyTipsByDisasterType = (disasterTypeId: number) => {
  return useQuery<SafetyTipItem>({
    queryKey: ['admin', 'safetyTips', disasterTypeId],
    queryFn: async () => {
      const response = await axiosInstance.get('/safety-tips/disaster-type', {
        params: { disasterTypeId },
      });
      return response.data;
    },
  });
};
