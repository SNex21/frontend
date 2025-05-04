import { TopicEssay, UserEssayShort, UserEssay, PaymentLink } from "@/models/Essay.ts";

export type GetEssaysTopicsRes = TopicEssay[];
export type GetUserEssaysRes = UserEssayShort[];

export type GetEssaysRes = TopicEssay;
export type GetUserEssayRes = UserEssay;

export interface GetEssayPaymentLinkReq {
  id: number;
  email: string;

  token: string;
}

export type GetPayLinkRes = PaymentLink;

export interface StartEssayProp {
  essay_id: string;
  deadline: string;
  token: string;
}
