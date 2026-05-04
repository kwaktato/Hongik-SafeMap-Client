import type { ReportPageResponse } from '@/types/Pageable';
import type {
  MissingCategory,
  MissingStatus,
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from '@/types/common';

// ===================== 공통 인터페이스 =====================
interface BasePost {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  fileUrls: string[];
  memberId: number;
  memberName: string;
  isAuthor: boolean;
  commentCount: number;
}

// ===================== 게시글 =====================
export interface MissingPost extends BasePost {
  category: MissingCategory;
  status: MissingStatus;
  age: string;
  characteristic: string;
  lastSeen: string;
  currentLocation: string;
}

export interface ResourcePost extends BasePost {
  category: ResourceCategory;
  status: ResourceStatus;
  type: ResourceType;
  location: string;
}

export type MissingListResponse = ReportPageResponse<MissingPost>;
export type ResourceListResponse = ReportPageResponse<ResourcePost>;

export interface MissingParams {
  category?: MissingCategory;
  status?: MissingStatus;
  page: number;
  size: number;
}

export interface ResourceParams {
  category?: ResourceCategory;
  status?: ResourceStatus;
  type?: ResourceType;
  page: number;
  size: number;
}

export interface ResourceRequest {
  type: string;
  category: string;
  title: string;
  description: string;
  location: string;
  fileUrls: string[];
}

export interface MissingRequest {
  category: string;
  title: string;
  description: string;
  age: string;
  characteristic: string;
  lastSeen: string;
  currentLocation: string;
  fileUrls: string[];
}

export interface StatusRequest {
  status: string;
}

// ===================== 댓글 =====================
export interface CommentRequest {
  content: string;
}

export interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  memberId: number;
  memberName: string;
}

export interface CommentResponse {
  totalCount: number;
  comments: CommentItem[];
}
