import { GetEssaysTopicsRes, GetUserEssaysRes } from "@/services/api/essays/types.ts";
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
  
