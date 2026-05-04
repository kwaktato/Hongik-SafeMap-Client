import type { DisasterType } from '@/types/common';

// ===================== 행동 요령 =====================
export interface Actions {
  id: number;
  title: string;
  guide: string;
}

/* [get] /safety-tips */
/* [get] /safety-tips/disaster-type */
/* [get] /admin/disaster-types/{disasterTypeId}/safety-tip */
export interface SafetyTipItem {
  id: string;
  disasterType: DisasterType;
  title: string;
  detail: string;
  supplies: string[];
  warnings: string[];
  actions: Actions[];
  createdAt: string;
  updatedAt: string;
}

/* [get] /safety-tips/summary */
export interface SafetyTipSummary {
  id: string;
  disasterType: DisasterType;
  title: string;
  detail: string;
}

export type ActionsRequest = Omit<Actions, 'id'>;

// ===================== 관리자 재난 유형 및 행동요령 관리 =====================
interface SafetyTip {
  title: string;
  detail: string;
  supplies: string[];
  warnings: string[];
  actions: ActionsRequest[];
}

/* [put] /admin/disaster-types/{disasterTypeId} */
/* [post] /admin/disaster-types */
export interface DisasterTypeRequest {
  name: string;
  iconUrl: string;
  safetyTip: SafetyTip;
}
