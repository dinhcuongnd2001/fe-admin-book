export interface TypeGenTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TypeLogin {
  username: string;
  password: string;
}

export interface TypeResponse {
  message: string;
  data?: any;
}
