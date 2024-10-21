import { UnityPayPayload } from '@/types/unity';
import { createSlice } from '@reduxjs/toolkit'


interface GameSlice {
  payAction: boolean;
  getBalanceAction: boolean;
  getWalletStatusAction: boolean;
  bindWalletAction: boolean;
  dispatchUserInfoAction: boolean;
  unityPayPayload: UnityPayPayload;

}
const initialState: GameSlice = {
  payAction: false,
  getBalanceAction: false,
  getWalletStatusAction: false,
  bindWalletAction: false,
  dispatchUserInfoAction: false,
  unityPayPayload: {
    amount: '',
    amount_coins: '',
  }
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPayAction: (state, data) => {
      state.payAction = data.payload
    },
    setGetBalanceAction: (state, data) => {
      state.getBalanceAction = data.payload
    },
    setGetWalletStatusAction: (state, data) => {
      state.getWalletStatusAction = data.payload
    },
    setBindWalletAction: (state, data) => {
      state.bindWalletAction = data.payload
    },
    setDispatchUserInfoAction: (state, data) => {
      state.dispatchUserInfoAction = data.payload
    },
    setUnityPayPayload: (state, data) => {
      state.unityPayPayload = {
        ...state.unityPayPayload,
        ...data.payload
      }
    },
  },
})

export const { 
  setPayAction, setGetBalanceAction, setUnityPayPayload, 
  setGetWalletStatusAction, setBindWalletAction, setDispatchUserInfoAction,
 } = gameSlice.actions
export default gameSlice.reducer