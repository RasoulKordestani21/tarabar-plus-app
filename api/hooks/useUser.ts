import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "@/api/services/userServices";

type User = {
  id: string;
  name: string;
  email: string;
};

// Hook for fetching a single user
export const useUser = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUser(id)
  });
};
