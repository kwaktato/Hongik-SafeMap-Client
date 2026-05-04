import { axiosInstance } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageableRequest } from '@/types/Pageable';
import type {
  EmergencyContactsRequest,
  EmergencyContactResponse,
  AccountResponse,
  PasswordRequest,
  MedicalInfoRequest,
  MedicalInfoResponse,
  MyReportListResponse,
  MyResourceReportListResponse,
  MyMissingReportListResponse,
} from '@/types/Mypage';

// ===================== 계정 정보 =====================
/* 마이페이지 정보 조회 */
export const useMyAccount = () => {
  return useQuery<AccountResponse>({
    queryKey: ['me', 'account'],
    queryFn: async () => {
      const response = await axiosInstance.get('/members/me');
      return response.data;
    },
  });
};

/* 비밀번호 변경 */
export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: async (request: PasswordRequest) => {
      const response = await axiosInstance.patch(
        '/members/me/password',
        request,
      );
      return response;
    },
  });
};

// ===================== 의료정보 =====================
/* 의료 정보 조회 */
export const useMedicalInfo = () => {
  return useQuery<MedicalInfoResponse>({
    queryKey: ['me', 'medical'],
    queryFn: async () => {
      const response = await axiosInstance.get('/members/me/sensitive-info');
      return response.data;
    },
  });
};

/* 의료 정보 수정 */
export const useUpdateMedicalInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MedicalInfoRequest) => {
      const response = await axiosInstance.put<MedicalInfoResponse>(
        '/members/me/sensitive-info',
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me', 'medical'],
      });
    },
  });
};

// ===================== 비상연락처 =====================
/* 비상연락처 조회 */
export const useEmergencyContact = () => {
  return useQuery<EmergencyContactResponse[]>({
    queryKey: ['me', 'emergencyContacts'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/members/me/emergency-contacts',
      );
      return response.data;
    },
  });
};

/* 비상연락처 등록 */
export const useCreateEmergencyContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: EmergencyContactsRequest) => {
      const response = await axiosInstance.post(
        '/members/me/emergency-contacts',
        request,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me', 'emergencyContacts'],
      });
    },
  });
};

/* 비상연락처 수정 */
export const useUpdateEmergencyContactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      emergencyContactId,
      request,
    }: {
      emergencyContactId: number;
      request: EmergencyContactsRequest;
    }) => {
      const response = await axiosInstance.put<EmergencyContactResponse>(
        `/members/me/emergency-contacts/${emergencyContactId}`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me', 'emergencyContacts'],
      });
    },
  });
};

/* 비상연락처 삭제 */
export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emergencyContactId: number) => {
      const response = await axiosInstance.delete(
        `/members/me/emergency-contacts/${emergencyContactId}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me', 'emergencyContacts'],
      });
    },
  });
};

// ===================== 내 제보 =====================
/* 내 제보 조회 */
export const useGetMyReports = (pageable: PageableRequest) => {
  return useQuery<MyReportListResponse>({
    queryKey: ['me', 'reports', pageable],
    queryFn: async () => {
      const response = await axiosInstance.get('/members/me/reports', {
        params: pageable,
      });
      return response.data;
    },
  });
};

/* 내 자원 게시글 조회 */
export const useGetMyResourceReports = (pageable: PageableRequest) => {
  return useQuery<MyResourceReportListResponse>({
    queryKey: ['me', 'resource', pageable],
    queryFn: async () => {
      const response = await axiosInstance.get('/members/me/resource-reports', {
        params: pageable,
      });
      return response.data;
    },
  });
};

/* 내 실종 게시글 조회 */
export const useGetMyMissingReports = (pageable: PageableRequest) => {
  return useQuery<MyMissingReportListResponse>({
    queryKey: ['me', 'missing', pageable],
    queryFn: async () => {
      const response = await axiosInstance.get('/members/me/lost-reports', {
        params: pageable,
      });
      return response.data;
    },
  });
};
