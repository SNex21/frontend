import { User } from "@/models";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import { GetUserProps, UpdateUserProps } from "./types";
import { UserStats } from "@/models/User";

export const getUser = async ({ id, token }: GetUserProps): Promise<User> => {
  const { data } = await apiClient.get<User>(`${API_ENDPOINTS.USER_DEFAULT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: `${id}`,
    },
  });
  return data;
};

export const updateUser = async ({ id, token, ...body }: UpdateUserProps) => {
  const { data } = await apiClient.patch(`${API_ENDPOINTS.USER}/settings`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: `${id}`,
    },
  });
  return data;
};

export const getUserStats = async ({ id, token }: GetUserProps): Promise<UserStats> => {
  const { data } = await apiClient.get<UserStats>(`${API_ENDPOINTS.USER}/statistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
      id: `${id}`,
    },
  });
  return data;
};
