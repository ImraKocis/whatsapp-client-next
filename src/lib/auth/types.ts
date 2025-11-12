export interface SessionCookie {
  accessToken: string;
  refreshToken: string;
  id: number;
}

export interface Session {
  jwt?: string;
  rt?: string;
}
