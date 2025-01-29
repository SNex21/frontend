import { Topic } from "@/models/Topic.ts";
import { Guess, Session } from "@/models/Session.ts";

export interface GetTasksReq {
  isHard?: boolean;
  isWorkOnMistakes?: boolean;
  topic_id?: number;
  amount?: number;

  token: string;
}

export type GetTasksRes = Session;

export type GetTasksTopicsRes = Topic[];

export interface CompleteSessionReq {
  id: string;
  is_aborted: boolean;
  wastedTime: number;
  guesses: Guess[];

  token: string;
}
