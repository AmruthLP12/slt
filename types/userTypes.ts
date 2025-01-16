export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export const ROLES = ['user', 'admin', 'manager', 'editor'] as const;
  export type Role = typeof ROLES[number];
  
  