import { axiosInstance } from '@/api/axiosInstance';
import type {
  AdminNotification,
  AdminNotificationRequset,
} from '@/types/Notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* 알림 설정 조회 */
export const useNotification = () => {
  return useQuery<AdminNotification[]>({
    queryKey: ['admin', 'notifications', 'preferences'],
    queryFn: async () => {
      const response = await axiosInstance.get('/notifications/preferences');
      return response.data;
    },
  });
};

/* 서버 점검 상태 변경 */
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AdminNotificationRequset) => {
      const response = await axiosInstance.patch(
        `/notifications/preferences`,
        request,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'notifications', 'preferences'],
      });
    },
  });
};
