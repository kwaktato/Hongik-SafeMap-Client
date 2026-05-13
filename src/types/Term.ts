import type { BasePageResponse } from '@/types/Pageable';

/* [put] /admin/terms [post] /admin/terms */
/* [put] /admin/privacy-policy [post] /admin/privacy-policy */
export interface TermSection {
  id?: number;
  header: string;
  content: string;
}

/* [get] /terms */
/* [get] /privacy-policy */
/* [get] /admin/terms/latest */
/* [put] /admin/terms [post] /admin/terms */
/* [get] /admin/privacy-policy/latest */
/* [put] /admin/privacy-policy [post] /admin/privacy-policy */
export interface Term {
  version: string;
  title: string;
  date: string;
  createdAt?: string;
  sections: TermSection[];
}

// ===================== 관리자 =====================
/* [get] /admin/terms/versions/latest */
/* [get] /admin/privacy-policy/versions/latest */
export interface TermVersionInfo {
  version: string;
  updatedAt: string;
}

/* [get] /admin/terms */
export interface TermPageResponse extends BasePageResponse {
  terms: Term[];
}

/* [get] /admin/privacy-policy */
export interface PrivacyPageResponse extends BasePageResponse {
  policies: Term[];
}

// ===================== 사용자 =====================
/* [post] /terms/agree */
export interface TermAgreeRequest {
  termsVersion: string;
  privacyPolicyVersion: string;
}

/* [get] /terms/my-agreements */
export interface TermMyAgreeResponse extends TermAgreeRequest {
  agreedAt: string;
}
