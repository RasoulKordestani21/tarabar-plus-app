import apiClient from "@/api/apiClient";

type Props = {
  phoneNumber: string;
};

// GET a single user
export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// POST (Create) a user
export const createUser = async (userData: Props) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

// PUT (Update) a user
export const updateUser = async (id: string, userData: Props) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

// DELETE a user
export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
