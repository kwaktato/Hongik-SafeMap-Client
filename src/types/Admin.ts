import type {
  BasePageResponse,
  PageableRequest,
  ReportPageResponse,
} from '@/types/Pageable';
import type {
  DisasterReportStatus,
  DisasterType,
  RiskLevel,
} from '@/types/common';
import type { DisasterGroup, ReportBase } from '@/types/Report';

// ===================== 대시보드 =====================
export type DashboardReport = Omit<ReportBase, 'address' | 'trustScore'>;

export interface AdminDashboardResponse {
  totalReports: number;
  falseReports: number;
  totalUsers: number;
  suspiciousReports: number;
  blindedReports: number;
  credibleUsers: number;
  recentReports: DashboardReport[];
}

// ===================== 제보 검토 =====================
export interface AdminReport {
  reportId: number;
  disasterType: DisasterType;
  description: string;
  status: DisasterReportStatus;
  reviewComment: string;
  helpfulCount: number;
  notHelpfulCount: number;
  accusationCount: number;
}

export interface ReportStatusRequest {
  status: DisasterReportStatus;
  reviewComment: string;
}

export interface AdminReportParams extends PageableRequest {
  disasterTypeIds?: number[];
  riskLevel?: RiskLevel[];
  statuses?: DisasterReportStatus[];
}

/* [get] /admin/disaster-reports */
export type AdminReportListResponse = ReportPageResponse<AdminReport>;

// ===================== 사용자 관리 =====================
export interface Member {
  id: number;
  name: string;
  email: string;
  reportCount: number;
  accuracy: number;
  isCredible: boolean;
}

// ===================== 관리자 통계 및 아카이브 =====================
export interface DisasterRecord extends DisasterGroup {
  address: string;
  approvedReportCount: number;
  pendingReportCount: number;
}

export interface DisasterRecordsParams extends PageableRequest {
  riskLevels?: RiskLevel[];
  from?: string;
  to?: string;
}

/* [get] /admin/disaster-archive/disaster-records */
export interface AdminRecordsResponse extends BasePageResponse {
  disasterRecords: DisasterRecord[];
}

export interface DisasterStatisticsParams {
  disasterTypeIds?: number[];
  from?: string;
  to?: string;
}

interface DisasterTypeStats {
  disasterType: DisasterType;
  reportCount: number;
}

interface RiskLevelDistribution {
  riskLevel: RiskLevel;
  reportCount: number;
}

/* [get] /admin/disaster-archive/statistics */
export interface AdminStatisticsResponse {
  totalGroupCount: number;
  totalReportCount: number;
  blindedReportCount: number;
  averageReportsPerGroup: number;
  mostFrequentDisasterType: DisasterType;
  disasterTypeStats: DisasterTypeStats[];
  riskLevelDistribution: RiskLevelDistribution[];
}

interface Summary {
  disasterType: DisasterType;
  totalReportCount: number;
  startTime: string;
  endTime: string;
}

interface SimulationLocation {
  latitude: number;
  longitude: number;
  riskLevel: string;
}

interface RiskLevelCounts {
  긴급: number;
  높음: number;
  보통: number;
  낮음: number;
}

interface Statistics {
  reportTime: string;
  cumulativeCount: number;
  riskLevelCounts: RiskLevelCounts;
}

interface SimulationFrame {
  reportIndex: number;
  locations: SimulationLocation[];
  statistics: Statistics;
}

/* [get] /admin/disaster-archive/disaster-records/${groupId}/simulation */
export interface AdminSimulationResponse {
  summary: Summary;
  frames: SimulationFrame[];
}

interface ReportLocations extends SimulationLocation {
  reportId: number;
}

/* [get] /admin/disaster-archive/disaster-records/${groupId}/locations */
export interface AdminLocationResponse extends Omit<DisasterGroup, 'id'> {
  groupId: number;
  isActive: boolean;
  earliestAddress: string;
  reportLocations: ReportLocations[];
}

// ===================== 관리자 계정 관리 =====================
/* [get] /admin/accounts */
export interface AdminAccountsResponse {
  id: number;
  name: string;
  email: string;
}

/* [post] /admin/promote */
export interface AdminPromoteRequest {
  email: string;
  nickname: string;
}

/* [patch] /admin/nikcname */
export interface AdminNicknameRequest {
  memberId: number;
  nickname: string;
}

// ===================== 관리자 활동 로그 =====================
export interface AdminLog {
  id: number;
  adminId: number;
  description: string;
  createdAt: string;
}

/* [get] /admin/activity-logs */
export interface AdminLogsResponse extends BasePageResponse {
  logs: AdminLog[];
}
