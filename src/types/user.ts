
export type LoginRequestPayload = {
  ticket: string
}

export type GenOrderRequestPayload = {
  amount: string;
  amount_coins: string;
  address: string;
}

export type CheckOrderRequestPayload = {
  tx_id: string;
}

export type UseCoinRequestPayload = {
  amount_coins: number;
}

export type UpdateLevelRequestPayload = {
  level_index: number;
  level_user_completed_progress: number;
  level_user_score: number;
  timestamp: Date,
  randomStr: string;
  signature: string;
}

export type LeaderBoardPageReq = {
  page_size?: number;
  page_num?: number;
  sort_type?: string;
}
export type FetchLeaderBoardRequestPayload = {
  level_index: number;
} & LeaderBoardPageReq;


export type FetchLeaderBoardAllRequestPayload = LeaderBoardPageReq

