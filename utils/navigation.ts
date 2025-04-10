import { UserRole } from "@/types/auth";

export const getHomeRoute = (
  role: UserRole
): "/driver-home" | "/cargo-owner-home" | "/" => {
  switch (role) {
    case UserRole.DRIVER:
      return "/driver-home";
    case UserRole.CARGO_OWNER:
      return "/cargo-owner-home";
    default:
      return "/";
  }
};
