import { TopicEssay, UserEssayShort, UserEssay } from "@/models/Essay.ts";

export type GetEssaysTopicsRes = TopicEssay[];
export type GetUserEssaysRes = UserEssayShort[];

export interface GetEssayReq {
    isHard?: boolean;
    isWorkOnMistakes?: boolean;
    topic_id?: number;
    amount?: number;
    is_onboarding?: boolean;
  
    token: string;
  }
  
export type GetEssaysRes = TopicEssay;
export type GetUserEssayRes = UserEssay;
