import { GetEssaysTopicsRes } from "@/services/api/tasks/types.ts";
import { apiClient } from "@/services/api/client.ts";
import { API_ENDPOINTS } from "@/services/api/endpoints.ts";
import { TopicEssay, UserEssay } from "@/models/Essay.ts";



export const getEssaysTopics = async ({ token }: { token: string }): Promise<GetEssaysTopicsRes> => {
  const { data } = await apiClient.get<GetEssaysTopicsRes>(`${API_ENDPOINTS.GET_TOPICS}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
