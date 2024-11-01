import { Unity } from "react-unity-webgl";
import { useEffect,  useMemo } from 'react';
import { message, notification } from 'antd';
import { useAppDispatch } from "@/store/hooks";
import { setUnityPayPayload, setPayAction, setDispatchUserInfoAction } from "@/store/features/gameSlice";
import { WebGLMessageSubscriber } from "./WebGLMessageSubscriber";
import { IframeEventEnum, IframeEventTypeEnum } from "@/types/common";
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { ICallContractParams, TChainId } from '@aelf-web-login/wallet-adapter-base';
import { divDecimals } from "@/tools/converter";
import { fetchItemConfig, fetchLeaderBoard, fetchLeaderBoardAll, fetchUser, requestUpdateLevel, requestUseCoin } from "@/apis/business/lib";
import { UnityPayPayload } from "@/types/unity";
import { setInfo, setPostDisconnectAction } from "@/store/features/userSlice";
import { getSignatureForUpdateLevel } from "@/tools/auth";
import { isOk } from "@/tools/api";
import { useAelfWallet } from "@/hooks/wallet";
import { useUnity } from "@/hooks/unity";
import { shareURL, postEvent, isViewportMounted } from '@telegram-apps/sdk';
import { ErrorTip } from "./BoxTip";

function UnityApp() {
  const dispatch = useAppDispatch()
  const { getToken, saveInfo } = useAelfWallet()
  const { walletInfo, getAccountByChainId, callViewMethod, connectWallet, disConnectWallet } = useConnectWallet();
  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnity();
  
  const sendMessageToUnity = (gameObject: string, controllerMethod: string, payload: any) => {
    console.log('[Info] post message: ', gameObject, controllerMethod, payload);
    sendMessage(gameObject, controllerMethod, JSON.stringify(payload))
  };

  // Handle message from Unity
  const handler = (payload: any) => {
    console.log('[Info] receive message from unity: ', payload);

    async function runEvent() {
      const GAME_OBJECT = process.env.REACT_APP_UNITY_ASSET_GAME_OBJECT as string
      const parsePayload = JSON.parse(payload)

      switch (parsePayload.eventType) {
        case IframeEventTypeEnum.GET_WALLET_INFO: {
          const CHAIN_ID = process.env.REACT_APP_CHAIN_ID as TChainId
          const CONTRACT_ADDRESS = process.env.REACT_APP_tDVW_OR_tDVV_MUTILE_CONTRACT_ADDRESS as string
          const SYMBOL = process.env.REACT_APP_SYMBOL_TOKEN as string
          const viewParams: ICallContractParams<any> = {
            methodName: 'GetBalance',
            chainId: CHAIN_ID,
            contractAddress: CONTRACT_ADDRESS,
            args: {
              symbol: SYMBOL,
              owner: await getAccountByChainId(CHAIN_ID),
            },
          }

          try {
            const { data = {} }: any = await callViewMethod<typeof viewParams, Promise<Record<string,any>>>(viewParams);

            sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_WALLET_INFO, {
              eventType: IframeEventTypeEnum.GET_WALLET_INFO,
              eventData: {
                balance: divDecimals(data.balance, 8).toString(),
                isConnected: !!walletInfo
              }
            })
          } catch (err: any) {
            message.error(<ErrorTip msg={'[Err] -> wallet Info error: ' + err?.message}></ErrorTip>)
          }

          break;
        }

        case IframeEventTypeEnum.PAY: {
          dispatch(setUnityPayPayload(parsePayload.eventData as UnityPayPayload))
          dispatch(setPayAction(true))
          break;
        }

        case IframeEventTypeEnum.USE_COIN: {
          const ret = await requestUseCoin({
            amount_coins: parsePayload.eventData.amount_coins
          })

          if (isOk(ret)) {
            const { data: user } = await fetchUser()

            sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_USE_COIN, {
              eventType: IframeEventTypeEnum.USE_COIN,
              eventData: {
                msg: 'ok',
                remaining_revive_coins: user.remaining_revive_coins
              }
            })

            dispatch(setInfo(user))
          }

          break;
        }

        case IframeEventTypeEnum.UPDATE_LEVEL: {
          const payload = getSignatureForUpdateLevel({
            level_index: parsePayload.eventData.level_index,
            level_user_score: parsePayload.eventData.level_user_score,
            level_user_completed_progress: parsePayload.eventData.level_user_completed_progress,
          })

          const ret = await requestUpdateLevel(payload)

          if (isOk(ret)) {
            sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_UPDATE_LEVEL, {
              eventType: IframeEventTypeEnum.UPDATE_LEVEL,
              eventData: {
                msg: 'ok'
              }
            })

            const { data: user } = await fetchUser()
            if (user) {
              saveInfo(user)
              sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_USER_INFO, {
                eventType: IframeEventTypeEnum.GET_USER_INFO,
                eventData: user
              })
            }
          }

          break;
        }

        case IframeEventTypeEnum.GET_USER_TOKEN: {
          const token = getToken()

          sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_USER_TOKEN, {
            eventType: IframeEventTypeEnum.GET_USER_TOKEN,
            eventData: {
              token,
              msg: token ? 'ok' : 'failed'
            }
          })

          break;
        }

        case IframeEventTypeEnum.GET_USER_INFO: {
          const { data: user } = await fetchUser()
          sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_USER_INFO, {
            eventType: IframeEventTypeEnum.GET_USER_INFO,
            eventData: user || {}
          })

          dispatch(setInfo(user))
          break;
        }

        case IframeEventTypeEnum.GET_LEADER_BOARD: {
          const { page_size = 10, page_num = 1, level_index = 0 } = parsePayload.eventData
          const { data: {
            list,
            total,
            user,
          } } = await fetchLeaderBoard({
            level_index,
            page_size,
            page_num,
          })

          sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_LEADER_BOARD, {
            eventType: IframeEventTypeEnum.GET_LEADER_BOARD,
            eventData: {
              list,
              total,
              user,
            }
          })

          break;
        }

        case IframeEventTypeEnum.GET_LEADER_BOARD_ALL: {
          const { page_size = 100, page_num = 1 } = parsePayload.eventData
          const { data: {
            list,
            total,
            user,
          } } = await fetchLeaderBoardAll({
            page_size,
            page_num,
          })
          
          sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_LEADER_BOARD_ALL, {
            eventType: IframeEventTypeEnum.GET_LEADER_BOARD_ALL,
            eventData: {
              list,
              total,
              user,
            }
          })

          break;
        }

        case IframeEventTypeEnum.ON_LOADED: {
          dispatch(setDispatchUserInfoAction(true))
          break;
        }

        case IframeEventTypeEnum.ON_CONNECT_WALLET: {
          // if (!walletInfo) {
          //   await connectWallet()
          // } else {
          //   dispatch(setDispatchUserInfoAction(true))
          // }
          try {
            localStorage.clear()
            await connectWallet()
          } catch (err: any) {
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
          // await disConnectWallet()

          break;
        }

        case IframeEventTypeEnum.ON_DISCONNECT_WALLET: {
          try {
            await disConnectWallet()
            dispatch(setPostDisconnectAction(true))
            localStorage.clear()
          } catch(err: any) {
            let description = ''
            if (err?.nativeError) {
              description = err.nativeError?.error + ':' + err.nativeError?.error_description
            }
            notification.error({
              message: 'Disconnect error: ' + err?.message,
              description,
              duration: 60,
            })
          }
          
          break;
        }

        case IframeEventTypeEnum.ON_SHARE: {
          try {
            const shareBot = process.env.REACT_APP_TELEGRAM_BOT
            const shareApp = process.env.REACT_APP_TELEGRAM_BOT_APP
            const url = `https://t.me/${shareBot}/${shareApp}?startapp=dl`

            sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_SHARE, {
              eventType: IframeEventTypeEnum.ON_SHARE,
              eventData: {
                msg: 'ok',
                link: url,
              }
            })
            shareURL(url, 'Join block beats with me!');

          } catch (err: any) {
            message.error(<ErrorTip msg={'[Err] share error: ' + err.message}></ErrorTip>)
          }

          break;
        }

        case IframeEventTypeEnum.ON_GET_ITEM_CONFIG: {
          const result = await fetchItemConfig()

          sendMessageToUnity(GAME_OBJECT, IframeEventEnum.ON_GET_ITEM_CONFIG, {
            eventType: IframeEventTypeEnum.ON_GET_ITEM_CONFIG,
            eventData: {
              msg: 'ok',
              list: result?.data?.list || [],
            }
          })

          break;
        }

        default: {
          message.warning('[Warn] unknown event type: ' + parsePayload.eventType)
        }
      }
    }

    runEvent()
  };

  useEffect(() => {
    if (isLoaded) {
      addEventListener(IframeEventEnum.ON_LOADED, handler);
      addEventListener(IframeEventEnum.ON_CONNECT_WALLET, handler);
      addEventListener(IframeEventEnum.ON_DISCONNECT_WALLET, handler);
      addEventListener(IframeEventEnum.ON_GET_WALLET_INFO, handler);
      addEventListener(IframeEventEnum.ON_PAY, handler);
      addEventListener(IframeEventEnum.ON_USE_COIN, handler);
      addEventListener(IframeEventEnum.ON_UPDATE_LEVEL, handler);
      addEventListener(IframeEventEnum.ON_GET_USER_TOKEN, handler);
      addEventListener(IframeEventEnum.ON_GET_USER_INFO, handler);
      addEventListener(IframeEventEnum.ON_GET_LEADER_BOARD, handler);
      addEventListener(IframeEventEnum.ON_GET_LEADER_BOARD_ALL, handler);
      addEventListener(IframeEventEnum.ON_SHARE, handler);
      addEventListener(IframeEventEnum.ON_GET_ITEM_CONFIG, handler);
    }

    return () => {
      removeEventListener(IframeEventEnum.ON_LOADED, handler);
      removeEventListener(IframeEventEnum.ON_CONNECT_WALLET, handler);
      removeEventListener(IframeEventEnum.ON_DISCONNECT_WALLET, handler);
      removeEventListener(IframeEventEnum.ON_GET_WALLET_INFO, handler);
      removeEventListener(IframeEventEnum.ON_PAY, handler);
      removeEventListener(IframeEventEnum.ON_USE_COIN, handler);
      removeEventListener(IframeEventEnum.ON_UPDATE_LEVEL, handler);
      removeEventListener(IframeEventEnum.ON_GET_USER_TOKEN, handler);
      removeEventListener(IframeEventEnum.ON_GET_USER_INFO, handler);
      removeEventListener(IframeEventEnum.ON_GET_LEADER_BOARD, handler);
      removeEventListener(IframeEventEnum.ON_GET_LEADER_BOARD_ALL, handler);
      removeEventListener(IframeEventEnum.ON_SHARE, handler);
      removeEventListener(IframeEventEnum.ON_GET_ITEM_CONFIG, handler);
    };
  }, [addEventListener, removeEventListener, isLoaded, walletInfo]);

  
  return <>
    {
      useMemo(
        () => <WebGLMessageSubscriber sendMessage={sendMessage} isLoaded={isLoaded} />, [sendMessage, isLoaded]
      )
    }
    <Unity style={{ width: '100vw', height: '100vh' }} unityProvider={unityProvider} />
  </>
}

function WebGLProvider(props: React.PropsWithChildren) {
  try {
    if (!isViewportMounted()) {
      postEvent('web_app_expand');
    }
  } catch (err: any) {
    console.log('[Err] app expand: ', err.message)
  }

  return <>
    <div className='unity--container' style={{ height: '100vh'}}>
      <UnityApp />
      {props.children}
    </div>
  </>
}


export default WebGLProvider;
