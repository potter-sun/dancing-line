import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {
      token: '',
      uid: '',
    },
    authExpiredAction: false,
    confirmingLogoutAction: false,
    postDisconnectAction: false,
  },
  reducers: {
    setInfo: (state, action) => {
      state.info = {
        ...action.payload
      }
    },
    setAuthExpiredAction: (state, data) => {
      state.authExpiredAction = data.payload
    },
    setConfirmingLogoutAction: (state, data) => {
      state.confirmingLogoutAction = data.payload
    },
    setPostDisconnectAction: (state, data) => {
      state.postDisconnectAction = data.payload
    },
  },
})

export const {
  setInfo,
  setAuthExpiredAction,
  setConfirmingLogoutAction,
  setPostDisconnectAction,
} = userSlice.actions

export default userSlice.reducer