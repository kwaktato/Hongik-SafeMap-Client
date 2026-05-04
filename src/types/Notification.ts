// ===================== 알림 =====================
/* [get] /notifications/preferences */
export interface AdminNotification {
  disasterTypeId: number;
  disasterTypeName: string;
  iconUrl: string;
  isEnabled: boolean;
}

/* [put] /notifications/preferences */
export interface AdminNotificationRequset {
  disasterTypeId: number;
  isEnabled: boolean;
}
