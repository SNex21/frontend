import { GetEssaysTopicsRes, GetUserEssaysRes, GetEssaysRes, GetUserEssayRes } from "@/services/api/essays/types.ts";
import { apiClient } from "@/services/api/client.ts";
import { API_ENDPOINTS } from "@/services/api/endpoints.ts";


export const getEssaysTopics = async ({ token }: { token: string }): Promise<GetEssaysTopicsRes> => {
  const { data } = await apiClient.get<GetEssaysTopicsRes>(`${API_ENDPOINTS.GET_ESSAYS_TOPICS}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getUserEssays = async ({ token }: { token: string }): Promise<GetUserEssaysRes> => {
    const { data } = await apiClient.get<GetUserEssaysRes>(`${API_ENDPOINTS.GET_USERS_ESSAYS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };


  export const getEssay = async ({ id, token }: { id: number, token: string }): Promise<GetEssaysRes> => {
  const { data } = await apiClient.get<GetEssaysRes>(`${API_ENDPOINTS.GET_ESSAYS_TOPICS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return data;
};

export const getUserEssay = async ({ id, token }: { id: string, token: string }): Promise<GetUserEssayRes> => {
  const { data } = await apiClient.get<GetUserEssayRes>(`${API_ENDPOINTS.GET_USERS_ESSAYS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
