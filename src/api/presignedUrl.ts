import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import type { PresignedUrlRequest } from '@/types/common';

// ===================== 파일 업로드 =====================
/* 파일 업로드용 Presigned URL 생성 */
export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: async (request: PresignedUrlRequest) => {
      const response = await axiosInstance.post('/upload-url', request);
      return response.data;
    },
  });
};

// ===================== 관리자 재난 유형 관리 =====================
/* 재난 유형 아이콘 업로드 URL 발급 */
export const useGetDisasterIconUrl = () => {
  return useMutation({
    mutationFn: async (request: PresignedUrlRequest) => {
      const response = await axiosInstance.post(
        '/admin/disaster-types/upload-icon-url',
        request,
      );
      return response.data;
    },
  });
};
