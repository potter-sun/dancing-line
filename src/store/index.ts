import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './features/userSlice'
import { gameSlice } from './features/gameSlice'
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    game: gameSlice.reducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

