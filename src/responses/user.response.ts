export interface UserResponse {
  type: string;
  app_id: number;
  user_id: string;
  scopes: string[];
  issued_at: number;
  is_valid: boolean;
  expires_at: number;
  application: string;
  metadata: {
    sso: string
  };
}