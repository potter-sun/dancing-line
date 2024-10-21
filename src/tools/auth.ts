import { LoginRequestPayload } from '@/types/user';
import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import CryptoJS from 'crypto-js'
const AElf = require('aelf-sdk');

export function genTickForUser(walletInfo: TWalletInfo): LoginRequestPayload {
  const payload = {
    address: walletInfo?.address,
    username: walletInfo?.name || walletInfo?.extraInfo?.nickName,
  }
  const ticket = AElf.wallet.AESEncrypt(JSON.stringify(payload), process.env.REACT_APP_AELF_WALLET_AES_SECRET as string)

  return {
    ticket,
  }
}

export function getSignatureForUpdateLevel(payload: any) {
  const randomStr = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const params: any = {
    ...payload,
    timestamp: Date.now() / 1000,
    randomStr
  }

  const keys = Object.keys(params).sort();
  const str = keys.map(key => `${key}=${params[key]}`).join('&');

  const hash = CryptoJS.HmacSHA256(str, process.env.REACT_APP_DL_API_UPDATE_LEVEL_SECRET as string);
  const hmacSha256 = hash.toString(CryptoJS.enc.Hex);

  params.signature = CryptoJS.MD5(hmacSha256).toString();
  return params
}