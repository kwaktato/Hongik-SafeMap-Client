import { axiosInstance } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CommentRequest,
  CommentResponse,
  MissingListResponse,
  MissingParams,
  MissingPost,
  MissingRequest,
  ResourceListResponse,
  ResourceParams,
  ResourcePost,
  ResourceRequest,
  StatusRequest,
} from '@/types/Post';

// ===================== 실종 게시판 =====================
/* 실종 게시판 리스트 조회 */
export const useMissingList = (params: MissingParams) => {
  return useQuery<MissingListResponse>({
    queryKey: ['missing', 'list', params],
    queryFn: async () => {
      const response = await axiosInstance.get('/missing-board', {
        params,
      });
      return response.data;
    },
  });
};

/* 실종 게시글 조회 */
export const useMissingPost = (id: number) => {
  return useQuery<MissingPost>({
    queryKey: ['missing', 'detail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/missing-board/${id}`);
      return response.data;
    },
  });
};

/* 실종 게시글 등록 */
export const useCreateMissingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MissingRequest) => {
      const response = await axiosInstance.post('/missing-board', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missing'] });
    },
  });
};

// ===================== 자원 게시판 =====================
/* 자원 게시판 리스트 조회 */
export const useResourceList = (params: ResourceParams) => {
  return useQuery<ResourceListResponse>({
    queryKey: ['resource', 'list', params],
    queryFn: async () => {
      const response = await axiosInstance.get('/resource-board', {
        params,
      });
      return response.data;
    },
  });
};

/* 자원 게시글 조회 */
export const useResourcePost = (id: number) => {
  return useQuery<ResourcePost>({
    queryKey: ['resource', 'detail', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/resource-board/${id}`);
      return response.data;
    },
  });
};

/* 자원 게시글 등록 */
export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ResourceRequest) => {
      const response = await axiosInstance.post('/resource-board', request);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
    },
  });
};

// ===================== 게시판 공통 =====================
/* 게시글 상태 변경 */
export const useUpdatePostStatusMutation = (endpoint: string, id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: StatusRequest) => {
      const response = await axiosInstance.patch(
        `/${endpoint}-board/${id}/status`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

/* 게시글 삭제 */
export const useDeletePostMutation = (endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/${endpoint}-board/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

// ===================== 댓글 =====================
/* 게시글 댓글 조회*/
export const useComments = (endpoint: string, id: number) => {
  return useQuery<CommentResponse>({
    queryKey: ['comment', endpoint, id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/${endpoint}-board/${id}/comments`,
      );
      return response.data;
    },
  });
};

/* 게시글 댓글 등록 */
export const useCreateCommentMutation = (endpoint: string, id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CommentRequest) => {
      const response = await axiosInstance.post(
        `/${endpoint}-board/${id}/comments`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', endpoint, id] });
    },
  });
};
