/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDispatchUserInfoAction, setPayAction } from '@/store/features/gameSlice';
import { timesDecimals } from '@/tools/converter';
import { hideLoading, showLoading } from '@/tools/animation';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { ICallContractParams, TChainId } from '@aelf-web-login/wallet-adapter-base';
import { genOrderId, checkOrderResult, fetchUser } from '@/apis/business/lib';
import { sleep } from '@/tools/schedual';
import { IframeEventEnum, IframeEventTypeEnum } from '@/types/common';
import { useAelfWallet } from '@/hooks/wallet';
import { setInfo, setPostDisconnectAction } from '@/store/features/userSlice';

const checkOrderResultInterval = async (txId: string) => {
  let checkResult = false
  const loop = async () => {
   
    const result = await checkOrderResult({
      tx_id: txId,
    });

    if (result.msg === 'ok') {
      checkResult = true
      return;
    }

    if (result.error) {
      return checkResult
    }

    await sleep(1000)
    await loop()
  }

  await loop()

  return checkResult
}

export function WebGLMessageSubscriber(props: { sendMessage: Function, isLoaded: boolean }) {
  const GAME_OBJECT = process.env.REACT_APP_UNITY_ASSET_GAME_OBJECT as string
  const dispatch = useAppDispatch()
  const { callSendMethod, walletInfo, connectWallet  } = useConnectWallet();
  const { getToken, } = useAelfWallet()
  const payAction = useAppSelector((state) => state.game.payAction)
  const dispatchUserInfoAction = useAppSelector((state) => state.game.dispatchUserInfoAction)
  const postDisconnectAction = useAppSelector((state) => state.user.postDisconnectAction)
  const user = useAppSelector((state) => state.user.info)
  const unityPayPayload = useAppSelector((state) => state.game.unityPayPayload)

  /**
   * Transaction steps
   * 1. To gen an orderID.
   * 2. Send transaction with orderID in contract.
   * 3. Check the returned tx result repeatedly.
   * 4. Post the checking result to game if it's minted successfully.
   * @returns void
   */
  const sendTransaction = async () => {
    if (!walletInfo) {
      dispatch(setPayAction(false))
      message.warning('[Warn] please connect your wallet first.')
      await connectWallet()
      return
    }

    if (!unityPayPayload.amount_coins || !unityPayPayload.amount ) {
      dispatch(setPayAction(false))
      message.warning('[Warn] invalid amount_coins or amount.')
      return
    }

    const { data: { order_id = '' } } = await genOrderId({
      amount: unityPayPayload.amount,
      amount_coins: unityPayPayload.amount_coins,
      address: walletInfo.address,
    })

    if (!order_id) {
      dispatch(setPayAction(false))
      return message.warning('[Warn] The order_id is undefined.')
    }

    showLoading()
    
    const CHAIN_ID = process.env.REACT_APP_CHAIN_ID as TChainId
    const CONTRACT_ADDRESS = process.env.REACT_APP_tDVW_OR_tDVV_MUTILE_CONTRACT_ADDRESS as string
    const TO = process.env.REACT_APP_RECEIVER_ADDRESS
    const SYMBOL = process.env.REACT_APP_SYMBOL_TOKEN
    const amount = timesDecimals(unityPayPayload.amount, 8).toString()

    const transferParams: ICallContractParams<Record<string, any>> = {
      methodName: 'Transfer',
      chainId: CHAIN_ID,
      contractAddress: CONTRACT_ADDRESS,
      args: {
        to: TO,
        symbol: SYMBOL,
        amount,
        memo: JSON.stringify({
          amount,
          order_id,
        }),
      },
    }
    console.log('[Info] -> sendTransaction -> params:', transferParams);

    try {
      const res: any = await callSendMethod(transferParams);
      console.log('[Info] callSendMethod res:', res);
      
      if (res?.transactionId && !res.error) {
        message.success('You transaction was successfully sent. Please wait until the transaction is included to the Aelf blockchain.');
        const checkResult = await checkOrderResultInterval(res.transactionId)
        if (checkResult) {
          message.success('Successful payment')
          const payload = {
            eventType: IframeEventTypeEnum.PAY,
            eventData: {
              msg: 'MINTED',
              ...unityPayPayload,
            }
          }

          props.sendMessage(GAME_OBJECT, IframeEventEnum.ON_PAY, JSON.stringify(payload))

          const { data: user } = await fetchUser()
          props.sendMessage(GAME_OBJECT, IframeEventEnum.ON_GET_USER_INFO, {
            eventType: IframeEventTypeEnum.GET_USER_INFO,
            eventData: user || {}
          })
          dispatch(setInfo(user))
        }
      // Web2 error like google, tg.
      } else if (res.error) {
        message.error(`[Err] -> ${res.error || 'Web2 payment is failed without reason.'}`)
      } else {
      // Web3 error like portKey.
        message.error(`[Err] Web3 payment is failed by: ${JSON.stringify(res || '{}') }`)
      }
      
    } catch(err: any) {
      message.error(err?.message || '[Err] Payment catch error: ' + JSON.stringify(err))
    }

    dispatch(setPayAction(false))
    hideLoading()
  }

  /**
   * Dispatch user info to DL Unity.
   * @returns void
   */
  const dispatchUserInfo = async () => {
    const payload = {
      eventType: IframeEventTypeEnum.GET_USER_INFO,
      eventData: user,
    }
    
    if (!user.uid) {
      const token = getToken()

      if (token) {
        const { data: getUser } = await fetchUser()
        payload.eventData = getUser

        dispatch(setInfo(user))
      } else {
        console.log('[Info] -> user info does not exist');
        dispatch(setDispatchUserInfoAction(false))
        return
      }
    }

    props.sendMessage(GAME_OBJECT, IframeEventEnum.ON_GET_USER_INFO, JSON.stringify(payload))
    props.sendMessage(GAME_OBJECT, IframeEventEnum.ON_CONNECT_WALLET, JSON.stringify({
      eventType: IframeEventTypeEnum.ON_CONNECT_WALLET,
      eventData: {
        msg: 'ok'
      }
    }))

    dispatch(setDispatchUserInfoAction(false))
  }

  /**
   * Subscribe actions.
   */
  useEffect(() => {
    if (payAction && props.isLoaded) {
      sendTransaction()
    }
    
    if (dispatchUserInfoAction && props.isLoaded) {
      dispatchUserInfo()
    }
  }, [payAction, dispatchUserInfoAction, props.isLoaded])


  useEffect(() => {
    if (postDisconnectAction) {
      const payload = {
        eventType: IframeEventTypeEnum.ON_DISCONNECT_WALLET,
        eventData: {
          msg: 'ok'
        }
      }

      props.sendMessage(GAME_OBJECT, IframeEventEnum.ON_DISCONNECT_WALLET, JSON.stringify(payload))
      dispatch(setPostDisconnectAction(false))
    }

  }, [postDisconnectAction])
  

  return (<Fragment>
  </Fragment>);
}
