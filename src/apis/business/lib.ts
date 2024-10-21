/* eslint-disable @typescript-eslint/no-explicit-any */

import http from '@/apis/business/rest-auth-service'
import { 
  GenOrderRequestPayload, LoginRequestPayload, CheckOrderRequestPayload,
  UseCoinRequestPayload, UpdateLevelRequestPayload,
  FetchLeaderBoardRequestPayload,
  FetchLeaderBoardAllRequestPayload
} from '@/types/user'

export const login = async (params: LoginRequestPayload) => {
  const data: any = await http({
    url: '/api/user/login',
    method: 'POST',
    data: params,
  })
  return data
}


export const fetchUser = async () => {
  const data: any = await http({
    url: '/api/user',
    method: 'GET',
  })
  return data
}


export const genOrderId = async (params: GenOrderRequestPayload) => {
  const data: any = await http({
    url: '/api/coin/order/gen',
    method: 'POST',
    data: params,
  })
  return data
}

export const checkOrderResult = async (params: CheckOrderRequestPayload) => {
  const data: any = await http({
    url: '/api/coin/order/check',
    method: 'POST',
    data: params,
  })
  return data
}


export const requestUseCoin = async (params: UseCoinRequestPayload) => {
  const data: any = await http({
    url: '/api/coin/use',
    method: 'POST',
    data: params,
  })
  return data
}

export const fetchItemConfig = async () => {
  const data: any = await http({
    url: '/api/coin/item/config',
    method: 'GET',
  })
  return data
}

export const requestUpdateLevel = async (params: UpdateLevelRequestPayload) => {
  const data: any = await http({
    url: '/api/level/update',
    method: 'POST',
    data: params,
  })
  return data
}


export const fetchLeaderBoard = async (params: FetchLeaderBoardRequestPayload) => {
  const data: any = await http({
    url: '/api/level/leader-board',
    method: 'GET',
    params,
  })
  return data
}
export const fetchLeaderBoardAll = async (params: FetchLeaderBoardAllRequestPayload) => {
  const data: any = await http({
    url: '/api/level/leader-board-all',
    method: 'GET',
    params,
  })
  return data
}



