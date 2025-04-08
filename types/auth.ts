export enum UserRole {
  DRIVER = "1",
  CARGO_OWNER = "2"
}

export interface AuthState {
  role: UserRole | null;
  isLogged: boolean;
  token: string | null;
  deviceId: string | null;
  deviceName: string | null;
  phoneNumber: string | null;
}

export interface AuthContextType extends AuthState {
  setRole: (role: UserRole) => void;
  setToken: (token: string) => void;
  setDeviceInfo: () => void;
  setPhoneNumber: (phone: string) => void;
}
