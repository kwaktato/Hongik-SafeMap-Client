import { axiosInstance } from '@/api/axiosInstance';
import type { PageableRequest } from '@/types/Pageable';
import type {
  PrivacyPageResponse,
  Term,
  TermAgreeRequest,
  TermMyAgreeResponse,
  TermPageResponse,
  TermSection,
  TermVersionInfo,
} from '@/types/Term';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ===================== 사용자 이용약관 & 개인정보처리방침 =====================
/* 최신 버전 이용약관 조회 */
export const useTerms = () => {
  return useQuery<Term>({
    queryKey: ['terms', 'latest', 'service'],
    queryFn: async () => {
      const response = await axiosInstance.get('/terms');
      return response.data;
    },
  });
};

/* 최신 버전 개인정보처리방침 조회 */
export const usePrivacyPolicy = () => {
  return useQuery<Term>({
    queryKey: ['terms', 'latest', 'privacy'],
    queryFn: async () => {
      const response = await axiosInstance.get('/privacy-policy');
      return response.data;
    },
  });
};

/* 내 이용약관 및 개인정보처리방침 동의 현황 조회 */
export const useTermsMyAgree = () => {
  return useQuery<TermMyAgreeResponse[]>({
    queryKey: ['terms', 'my-agreements'],
    queryFn: async () => {
      const response = await axiosInstance.get('/terms/my-agreements');
      return response.data;
    },
  });
};

/* 특정 버전 이용약관 및 개인정보처리방침 동의 */
export const useTermsAgree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: TermAgreeRequest) => {
      const response = await axiosInstance.post('/terms/agree', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms', 'my-agreements'] });
    },
  });
};

// ===================== 관리자 이용약관 =====================
/* 전체 개인정보처리방침 조회 */
export const useAdminTerms = (page: PageableRequest) => {
  return useQuery<TermPageResponse>({
    queryKey: ['admin', 'terms', 'list', page],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/terms');
      return response.data;
    },
  });
};

/* 최신 버전 조회 */
export const useAdminTermsVersion = () => {
  return useQuery<TermVersionInfo>({
    queryKey: ['admin', 'terms', 'version', 'latest'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/terms/versions/latest');
      return response.data;
    },
  });
};

/* 최신 버전 개인정보처리방침 조회 */
export const useAdminTermsLatest = () => {
  return useQuery<Term>({
    queryKey: ['admin', 'terms', 'detail', 'latest'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/terms/latest');
      return response.data;
    },
  });
};

/* 이용약관 등록 */
export const useCreateTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Term) => {
      const response = await axiosInstance.post<TermSection>(
        '/admin/terms',
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'terms'] });
    },
  });
};

/* 이용약관 수정 */
export const useUpdateTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Term) => {
      const response = await axiosInstance.put<TermSection>(
        '/admin/terms',
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'terms'] });
    },
  });
};

// ===================== 관리자 개인정보처리방침 =====================
/* 전체 개인정보처리방침 조회 */
export const useAdminPrivacyPolicy = (page: PageableRequest) => {
  return useQuery<PrivacyPageResponse>({
    queryKey: ['admin', 'privacy', 'list', page],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/privacy-policy');
      return response.data;
    },
  });
};

/* 최신 버전 조회 */
export const useAdminPrivacyPolicyVersion = () => {
  return useQuery<TermVersionInfo>({
    queryKey: ['admin', 'privacy', 'version', 'latest'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/admin/privacy-policy/versions/latest',
      );
      return response.data;
    },
  });
};

/* 최신 버전 개인정보처리방침 조회 */
export const useAdminPrivacyPolicyLatest = () => {
  return useQuery<Term>({
    queryKey: ['admin', 'privacy', 'detail', 'latest'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/privacy-policy/latest');
      return response.data;
    },
  });
};

/* 개인정보처리방침 등록 */
export const useCreatePrivacyPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Term) => {
      const response = await axiosInstance.post<TermSection>(
        '/admin/privacy-policy',
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'privacy'] });
    },
  });
};

/* 개인정보처리방침 수정 */
export const useUpdatePrivacyPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Term) => {
      const response = await axiosInstance.put<TermSection>(
        '/admin/privacy-policy',
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'privacy'] });
    },
  });
};
