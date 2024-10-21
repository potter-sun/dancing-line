/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { fetchUser, login } from '@/apis/business/lib';
import { useAelfWallet } from '@/hooks/wallet';
import { genTickForUser } from '@/tools/auth';
import { notification } from 'antd';
import { setDispatchUserInfoAction } from '@/store/features/gameSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthExpiredAction, setPostDisconnectAction } from '@/store/features/userSlice';

let connectTimer: any;

export default function Connector() {
  const dispatch = useAppDispatch()
  const { walletInfo, connectWallet, disConnectWallet } = useConnectWallet();
  const { getToken, saveToken, removeInfoAndToken, saveInfo } = useAelfWallet()
  const authExpiredAction = useAppSelector((state) => state.user.authExpiredAction)
  const confirmingLogoutAction = useAppSelector((state) => state.user.confirmingLogoutAction)
  
  
  useEffect(() => {
    async function tryToLogin() {

      if (walletInfo) {
        clearTimeout(connectTimer)

        if (getToken()) {
          const { data: user } = await fetchUser()
          if (user) {
            saveInfo(user)
            dispatch(setDispatchUserInfoAction(true))
          }
          return
        }

        const { data: { token = '' } } = await login(genTickForUser(walletInfo))
        if (token) {
          saveToken(token)
          const { data: user } = await fetchUser()
          if (user) {
            saveInfo(user)
            dispatch(setDispatchUserInfoAction(true))
          }
        }
        return
      }

      // Logout for web2.
      if (!walletInfo && confirmingLogoutAction) {
        dispatch(setPostDisconnectAction(true))
      }

      connectTimer = setTimeout(async () => {
        removeInfoAndToken()
        try {
          await connectWallet()
        } catch(err: any) {
          let description = ''
          if (err?.nativeError) {
            description = err.nativeError?.error + ':' + err.nativeError?.error_description
          }
          notification.error({
            message: 'Connect error: ' + err?.message,
            description,
            duration: 60,
          })
        }
      }, 5000)
    }

    tryToLogin()
    
  }, [walletInfo])


  useEffect(() => {
    if (authExpiredAction) {
      const disconnect = async () => {
        await disConnectWallet()
      }

      disconnect()
      dispatch(setPostDisconnectAction(true))
      dispatch(setAuthExpiredAction(false))
    }

  }, [authExpiredAction])

  return <>
    <React.Fragment></React.Fragment>
  </>
}
