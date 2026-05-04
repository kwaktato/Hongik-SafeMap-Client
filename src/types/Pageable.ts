export interface PageableRequest {
  page?: number;
  size?: number;
}

export interface BasePageResponse {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ReportPageResponse<T> extends BasePageResponse {
  reports: T[];
}

export interface LogPageResponse<T> extends BasePageResponse {
  logs: T[];
}
