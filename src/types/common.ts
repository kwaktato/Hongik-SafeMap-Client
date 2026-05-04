import type React from 'react';

// ===================== enum - 게시판 =====================
export type ResourceType = '요청' | '공급';
export type ResourceCategory =
  | '식량'
  | '식수'
  | '의약품'
  | '대피처'
  | '의류'
  | '도구';
export type ResourceStatus = '진행 중' | '대기 중' | '마감';

export type MissingCategory = '사람' | '반려동물' | '소지품';
export type MissingStatus = '찾는 중' | '발견됨';

// ===================== enum - 제보 =====================
export type DisasterReportStatus =
  | '검토대기'
  | '검증됨'
  | 'AI 신뢰도 의심'
  | '승인'
  | '블라인드';
// | '허위정보';
export type DisasterReportStatusEn =
  | 'PENDING'
  | 'VERIFIED'
  | 'SUSPICIOUS'
  | 'APPROVED'
  | 'BLINDED';

// export type DisasterType =  | '화재'  | '지진'  | '홍수'  | '산사태'  | '태풍'  | '기타';
export interface DisasterType {
  id: number;
  name: string;
  iconUrl: string;
}

export type RiskLevel = '긴급' | '높음' | '보통' | '낮음';

// ===================== 미디어 =====================
export interface MediaItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'video' | 'unknown';
}

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  imageUrl: string;
  expiresAt: string;
}

// ===================== 필터 =====================
interface FilterItem {
  label: string;
  icon?: React.ReactNode;
}

interface FilterItems {
  tabLabel: string;
  items: FilterItem[];
}

export interface Filter {
  [key: string]: FilterItems;
}

export interface FilterState {
  [key: string]: string[];
}
