export interface SessionCookie {
  token: string;
  refreshToken: string;
  id: number;
}

export interface Session {
  jwt?: string;
  rt?: string;
}
