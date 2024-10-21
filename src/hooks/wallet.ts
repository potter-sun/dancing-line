import { STORAGE_CACHE_TOKEN_KEY } from "@/config/const"
import { setInfo } from "@/store/features/userSlice"
import { useAppDispatch } from "@/store/hooks"

export function useAelfWallet() {
  const dispatch = useAppDispatch()

  const getToken = () => {
    return window.localStorage.getItem(STORAGE_CACHE_TOKEN_KEY)
  }
  const saveToken = (token: string) => {
    dispatch(setInfo({
      token,
    }))
    window.localStorage.setItem(STORAGE_CACHE_TOKEN_KEY, token)
  }


  const removeToken = () => {
    window.localStorage.removeItem(STORAGE_CACHE_TOKEN_KEY)
    dispatch(setInfo({
      token: '',
    }))
  }

  const restoreToken = () => {
    const token: string = window.localStorage.getItem(STORAGE_CACHE_TOKEN_KEY) || ''
    dispatch(setInfo({
      token: token ?? '',
    }))
  }

  const removeInfoAndToken = () => {
    dispatch(setInfo({}))
    removeToken()
  }

  const saveInfo = (user: any) => {
    dispatch(setInfo(user))
  }

  return {
    getToken,
    saveToken,
    removeToken,
    restoreToken,
    saveInfo,
    removeInfoAndToken,
  }
}