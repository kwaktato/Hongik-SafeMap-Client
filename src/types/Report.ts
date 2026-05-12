import type {
  DisasterReportStatus,
  DisasterType,
  RiskLevel,
} from '@/types/common';

// ===================== 공통 인터페이스 =====================
export interface ReportBase {
  id: number;
  disasterType: DisasterType;
  riskLevel: RiskLevel;
  disasterDescription: string;
  address: string;
  status: DisasterReportStatus;
  trustScore: number;
  createdAt: string;
}

// ===================== 파라미터 =====================
export interface DisasterGroupParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  isActive?: boolean;
  disasterTypesId?: number[];
  riskLevels?: RiskLevel[];
}

// ===================== 재난 제보 그룹 조회 =====================
/* 재난 제보 클러스터 조회: [get] /disaster-reports/grouped */
export interface DisasterGroup {
  id: number;
  disasterType: DisasterType;
  centerLatitude: number;
  centerLongitude: number;
  earliestReportTime: string;
  latestReportTime: string;
  reportCount: number;
  latestRiskLevel: RiskLevel;
}

/* 재난 제보 그룹 상세 조회
[get] /disaster-reports/grouped/${groupId}
[get] /admin/disaster-archive/disaster-records/${groupId}
 */
export interface DisasterGroupDetail extends Omit<DisasterGroup, 'id'> {
  groupId: number;
  isActive: boolean;
  reports: ReportBase[];
}

// ===================== 재난 제보 =====================
/* [post] /disaster-reports */
export interface ReportRequest {
  disasterTypeId: number;
  riskLevel: RiskLevel;
  disasterDescription: string;
  latitude: number;
  longitude: number;
  address: string;
  fileUrls: string[];
}

/* [get] /disaster-reports/${reportId} */
export interface ReportDetailResponse extends ReportBase {
  latitude: number;
  longitude: number;
  fileUrls: string[];
  aiGeneratedProbability: number;
  realProbability: number;
  aiPrediction: string;
  informativeProbability: number;
  notInformativeProbability: number;
  informativePrediction: string;
  memberId: number;
}

/* [get] /disaster-reports/{reportId}/evaluations */
export interface ReportEvaluationResponse {
  helpfulCount: number;
  notHelpfulCount: number;
  userEvaluatedHelpful: boolean;
  userEvaluatedNotHelpful: boolean;
}
