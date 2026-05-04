import { axiosInstance } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  DisasterGroup,
  DisasterGroupParams,
  DisasterGroupDetail,
  ReportDetailResponse,
  ReportRequest,
  ReportEvaluationResponse,
} from '@/types/Report';

/* 재난 제보 클러스터 조회 */
export const useReportClusters = (params: DisasterGroupParams) => {
  return useQuery<DisasterGroup[]>({
    queryKey: ['reports', 'groups', params],
    queryFn: async () => {
      const response = await axiosInstance.get('/disaster-reports/grouped', {
        params,
      });
      return response.data;
    },
  });
};

/* 재난 제보 그룹 상세 조회 */
export const useReportGroupDetail = (groupId: number) => {
  return useQuery<DisasterGroupDetail>({
    queryKey: ['reports', 'groups', 'detail', groupId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/disaster-reports/grouped/${groupId}`,
      );
      return response.data;
    },
    enabled: !!groupId,
  });
};

/* 재난 상황 상세 조회 */
export const useReportDetail = (reportId: number) => {
  return useQuery<ReportDetailResponse>({
    queryKey: ['reports', 'detail', reportId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/disaster-reports/${reportId}`);
      return response.data;
    },
  });
};

/* 재난 상황 제보 */
export const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReportRequest) => {
      const response = await axiosInstance.post('/disaster-reports', request);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

/* 재난 제보 평가 조회 */
export const useReportEvaluation = (reportId: number) => {
  return useQuery<ReportEvaluationResponse>({
    queryKey: ['reports', 'evaluations', reportId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/disaster-reports/${reportId}/evaluations`,
      );
      return response.data;
    },
  });
};

/* 재난 제보 평가 */
export const useReportEvaluationMutation = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationType: string) => {
      const response = await axiosInstance.post(
        `/disaster-reports/${reportId}/evaluations`,
        { evaluationType },
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports', 'evaluations', reportId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reports', 'detail', reportId],
      });
    },
  });
};

/* 재난 제보 평가 취소 */
export const useDeleteEvaluationMutation = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(
        `/disaster-reports/${reportId}/evaluations`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports', 'evaluations', reportId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reports', 'detail', reportId],
      });
    },
  });
};

/* 재난 제보 신고 */
export const useReportAccusationMutation = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `/disaster-reports/${reportId}/accusation`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
