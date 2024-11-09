import {
  generateAccessTokenByPortkeyServer,
  getCommunicationSocketUrl,
  getCustomNetworkType,
  getServiceUrl,
  getStorageInstance,
  getTelegramBotId,
  IApproveDetail,
  ISocialLogin,
  NetworkType,
  OpenLogin,
  socialLoginInPortkeyApp,
  TelegramPlatform,
} from "@portkey/did-ui-react";
import { devicesEnv } from "@portkey/utils";
const expirationError =
  "The verification has expired. Please reload the page to start the login process again.";

export const telegramLoginAuth = async () => {
  const telegramUserInfo = TelegramPlatform.getInitData();
  if (!telegramUserInfo) throw new Error("Telegram user info is not found");
  const expirationTime =
    Number(telegramUserInfo.auth_date) * 1000 + 60 * 60 * 10000;

  const telegramBotId = getTelegramBotId();
  const accessToken = await generateAccessTokenByPortkeyServer({
    ...telegramUserInfo,
    bot_id: telegramBotId,
  });
  return accessToken.token;
};

export const socialLoginAuthCurr = async ({
  type,
  clientId,
  redirectURI = "",
  guardianIdentifier,
  serviceUrl = "",
  useCurrentTelegramAuth = true,
  approveDetail,
  managerAddress,
  verifyType,
  networkType = "MAINNET",

}: {
  type: ISocialLogin;
  clientId?: string;
  redirectURI?: string;
  guardianIdentifier?: string;
  serviceUrl?: string;
  useCurrentTelegramAuth?: boolean;
  approveDetail?: IApproveDetail;
  managerAddress?: string;
  verifyType?: any;
  networkType?: NetworkType;
}): Promise<{
  token: string;
  idToken?: string;
  nonce?: string;
  timestamp?: number;
  provider: ISocialLogin;
} | void> => {
  // const serviceURI = getServiceUrl();
  // const socketURI = getCommunicationSocketUrl();
  // const ctw = getCustomNetworkType();
  // const currentStorage = getStorageInstance();
  console.log(networkType, "network=====redirectURI");
  // console.log(serviceURI, "serviceURI");
  // const openlogin = new OpenLogin({
  //   customNetworkType: ctw,
  //   networkType: "TESTNET",
  //   serviceURI: serviceURI,
  //   clientId,
  //   socketURI,
  //   currentStorage,
  //   // sdkUrl: 'http://localhost:3000',
  // });
  // try {
  //   // check platform
  //   const app = await devicesEnv.getPortkeyShellApp();

  //   if (app) return socialLoginInPortkeyApp(app, type);
  // } catch (error) {
  //   console.log("getPortkeyShellApp", error);
  // }
  // try {
  //   if (
  //     type === "Telegram" &&
  //     TelegramPlatform.isTelegramPlatform() &&
  //     ((guardianIdentifier &&
  //       guardianIdentifier === TelegramPlatform.getTelegramUserId()) ||
  //       !guardianIdentifier) &&
  //     useCurrentTelegramAuth
  //   ) {
  //     const token = await telegramLoginAuth();
  //     return { token, provider: "Telegram" };
  //   }
  // } catch (error) {
  //   console.log("telegramLoginAuth", error);
  // }
  // try {
  //   const result = await openlogin.login({
  //     from: "openlogin",
  //     loginProvider: type,
  //     approveDetail,
  //     managerAddress,
  //     verifyType,
  //   });
  //   if (!result) throw "Not result";
  //   if (result?.code) throw result.message;
  //   console.log(result, "socialLoginAuthBySocket result===");
  //   return result;
  // } catch (error) {
  //   console.log("openlogin.login", error);
  // }
};
