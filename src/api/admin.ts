import { axiosInstance } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageableRequest } from '@/types/Pageable';
import type {
  AdminAccountsResponse,
  AdminReportListResponse,
  AdminDashboardResponse,
  Member,
  AdminReportParams,
  AdminLogsResponse,
  AdminNicknameRequest,
  AdminPromoteRequest,
  ReportStatusRequest,
  AdminRecordsResponse,
  DisasterRecordsParams,
  AdminStatisticsResponse,
  DisasterStatisticsParams,
} from '@/types/Admin';
import type { ReportDetailResponse } from '@/types/Report';
import type { DisasterTypeRequest, SafetyTipItem } from '@/types/SafetyTips';
import type { DisasterType } from '@/types/common';

// ===================== 대시보드 =====================
/* 대시보드 */
export const useAdminDashboard = () => {
  return useQuery<AdminDashboardResponse>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/dashboard');
      return response.data;
    },
  });
};

// ===================== 제보 검토 =====================
/* 재난 상황 목록 조회 */
export const useAdminReports = (params: AdminReportParams) => {
  return useQuery<AdminReportListResponse>({
    queryKey: ['admin', 'reports', params],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/disaster-reports', {
        params,
      });
      return response.data;
    },
  });
};

/* 재난 제보 상태 변경 */
export const useUpdateReportStatusMutation = (reportId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReportStatusRequest) => {
      const response = await axiosInstance.put(
        `/admin/disaster-reports/${reportId}/status`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'reports'],
      });
    },
  });
};

/* 재난 제보 상세 조회 */
export const useAdminReportDetail = (reportId: number) => {
  return useQuery<ReportDetailResponse>({
    queryKey: ['admin', 'reports', 'detail', reportId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/disaster-reports/${reportId}`,
      );
      return response.data;
    },
  });
};

// ===================== 사용자 관리 =====================
/* 사용자 관리 */
export const useAdminMembers = () => {
  return useQuery<Member[]>({
    queryKey: ['admin', 'members'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/members');
      return response.data;
    },
  });
};

/* 사용자 공신력 관리 */
export const useUpdateMemberCredible = (memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.patch(
        `/admin/members/${memberId}/credible`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'members'] });
    },
  });
};

// ===================== 관리자 통계 및 아카이브 =====================
/* 재난 통계 요약 */
export const useAdminDisasterStatistics = (
  params: DisasterStatisticsParams,
) => {
  return useQuery<AdminStatisticsResponse>({
    queryKey: ['admin', 'statistics', params],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/admin/disaster-archive/statistics',
        { params },
      );
      return response.data;
    },
  });
};

/* 재난 기록 전체 조회 */
export const useAdminDisasterRecords = (params: DisasterRecordsParams) => {
  return useQuery<AdminRecordsResponse>({
    queryKey: ['admin', 'records', params],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/admin/disaster-archive/disaster-records',
        { params },
      );
      return response.data;
    },
  });
};

// ===================== 설정 - 계정 관리 =====================
/* 관리자 계정 목록 조회 */
export const useAdminAccounts = () => {
  return useQuery<AdminAccountsResponse[]>({
    queryKey: ['admin', 'accounts'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/accounts');
      return response.data;
    },
  });
};

/* 관리자 계정 추가 */
export const useAdminPromoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AdminPromoteRequest) => {
      const response = await axiosInstance.post('/admin/promote', request);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

/* 관리자 권한 박탈 */
export const useAdminDemoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post('/admin/demote', { email });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

/* 관리자 닉네임 수정 */
export const useUpdateAdminNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AdminNicknameRequest) => {
      const response = await axiosInstance.patch(`/admin/nickname`, request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });
    },
  });
};

/* 관리자 활동 로그 조회 */
export const useAdminActivityLogs = (pageable: PageableRequest) => {
  return useQuery<AdminLogsResponse>({
    queryKey: ['admin', 'logs', pageable],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/activity-logs', {
        params: pageable,
      });
      return response.data;
    },
  });
};

// ===================== 관리자 재난 유형 및 행동요령 관리 =====================
/* 전체 재난 유형 조회 */
export const useAdminDisasterType = () => {
  return useQuery<DisasterType[]>({
    queryKey: ['admin', 'disasterTypes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/disaster-types');
      return response.data;
    },
  });
};

/* 재난 유형별 행동 요령 조회 */
export const useAdminSafetyTipsByDisasterType = (disasterTypeId: number) => {
  return useQuery<SafetyTipItem>({
    queryKey: ['admin', 'safetyTips', disasterTypeId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/disaster-types/${disasterTypeId}/safety-tip`,
      );
      return response.data;
    },
  });
};

/* 재난 유형 및 행동 요령 등록 */
export const useCreateDisasterTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DisasterTypeRequest) => {
      const response = await axiosInstance.post<DisasterType>(
        `/admin/disaster-types`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disasterTypes'] });
      queryClient.invalidateQueries({ queryKey: ['disasterType'] });
    },
  });
};

/* 재난 유형 및 행동 요령 수정 */
export const useUpdateDisasterTypeMutation = (disasterTypeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DisasterTypeRequest) => {
      const response = await axiosInstance.put<DisasterType>(
        '/admin/safety-tips/disaster-type',
        request,
        {
          params: { disasterTypeId },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disasterTypes'] });
      queryClient.invalidateQueries({ queryKey: ['disasterType'] });
      queryClient.invalidateQueries({ queryKey: ['safetyTips'] });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'safetyTips', disasterTypeId],
      });
    },
  });
};

// ===================== 설정 - 시스템 운영 =====================
/* 서버 점검 상태 조회 */
export const useSystemMaintenance = () => {
  return useQuery<{
    maintenance: boolean;
  }>({
    queryKey: ['admin', 'system', 'maintenance'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/system/maintenance');
      return response.data;
    },
  });
};

/* 서버 점검 상태 변경 */
export const useUpdateSystemMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: boolean) => {
      const response = await axiosInstance.patch(
        `/admin/system/maintenance`,
        null,
        {
          params: { status },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'system', 'maintenance'],
      });
    },
  });
};
