import { TopicEssay, UserEssayShort, UserEssay, PaymentLink, PaymentStatus } from "@/models/Essay.ts";

export type GetEssaysTopicsRes = TopicEssay[];
export type GetUserEssaysRes = UserEssayShort[];

export type GetEssaysRes = TopicEssay;
export type GetUserEssayRes = UserEssay;

export interface GetEssayPaymentLinkReq {
  token: string;

  id: number;
  email: string;
}

export type GetPayLinkRes = PaymentLink;
export type CheckPaymentRes = PaymentStatus;


export interface StartEssayProp {
  token: string;

  essay_id: string;
  deadline: string;
}

export interface CheckTransactionProp {
  token: string;

  id: string;
}
