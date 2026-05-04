import type { ReportPageResponse } from '@/types/Pageable';
import type { ReportBase } from '@/types/Report';
import type { MissingPost, ResourcePost } from '@/types/Post';

export interface AccountResponse {
  name: string;
  email: string;
  status: string;
  phone: string;
}

export interface PasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MedicalInfoResponse {
  sensitiveInfoId: number;
  bloodType: string;
  allergies: string;
  chronicDiseases: string;
  medications: string;
}

export interface MedicalInfoRequest {
  bloodType: string;
  allergies: string;
  chronicDiseases: string;
  medications: string;
}

export interface EmergencyContactResponse {
  emergencyContactId: number;
  name: string;
  relationship: string;
  phone: string;
}

export interface EmergencyContactsRequest {
  name: string;
  relationship: string;
  phone: string;
}

/* [get] /members/me/reports */
export type MyReportListResponse = ReportPageResponse<ReportBase>;

/* [get] /members/me/resource-reports */
export type MyResourceReportListResponse = ReportPageResponse<ResourcePost>;

/* [get] /members/me/lost-reports */
export type MyMissingReportListResponse = ReportPageResponse<MissingPost>;
