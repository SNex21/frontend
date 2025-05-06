import { 
  GetEssaysTopicsRes, 
  GetUserEssaysRes, 
  GetEssaysRes, 
  GetUserEssayRes, 
  GetEssayPaymentLinkReq, 
  GetPayLinkRes,
  StartEssayProp, } from "@/services/api/essays/types.ts";
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

export const getEssayPaymentLink = async ({ token, ...params }: GetEssayPaymentLinkReq): Promise<GetPayLinkRes> => {
  const { data } = await apiClient.post<GetPayLinkRes>(`${API_ENDPOINTS.PAYMENT}`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const patchStartEssay = async ({ essay_id, deadline, token }: StartEssayProp) => {
  console.log(deadline)
  const { data } = await apiClient.patch(`${API_ENDPOINTS.GET_USERS_ESSAYS}/${essay_id}/start`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
  return data;
};

