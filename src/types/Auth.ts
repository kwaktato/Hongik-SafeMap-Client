export type LoginType = '일반' | '카카오' | '구글';

export type MemberStatus = 'USER' | 'ADMIN';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}

export interface SignupResponse {
  name: string;
  email: string;
  phone: string;
}

export interface GeneralLoginRequest {
  email: string;
  password: string;
}

export interface SNSLoginRequest {
  token: string;
  loginType: LoginType;
}

export interface ReissueRequest {
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  status: MemberStatus;
  loginType: LoginType;
}
