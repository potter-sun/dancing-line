import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum } from '@aelf-web-login/wallet-adapter-base';

const APP_NAME = 'Block beats';
const WEBSITE_ICON = 'https://explorer.aelf.io/favicon.main.ico';

const CHAIN_ID = 'AELF' as TChainId;
const NETWORK_TYPE = process.env.REACT_APP_NETWORK_TYPE as NetworkEnum;

const RPC_SERVER_AELF = process.env.REACT_APP_RPC_SERVER_AELF as string;
const RPC_SERVER_TDVV = process.env.REACT_APP_RPC_SERVER_TDVV as string;
const RPC_SERVER_TDVW = process.env.REACT_APP_RPC_SERVER_TDVW as string;

const GRAPHQL_SERVER = process.env.REACT_APP_GRAPHQL_SERVER;
const CONNECT_SERVER = process.env.REACT_APP_CONNECT_SERVER;
const SERVICE_SERVER = process.env.REACT_APP_SERVICE_SERVER;

const TELEGRAM_BOT_ID = process.env.REACT_APP_TELEGRAM_BOT_ID;

const didConfig = {
  graphQLUrl: GRAPHQL_SERVER,
  connectUrl: CONNECT_SERVER,
  serviceUrl: SERVICE_SERVER,
  requestDefaults: {
    baseURL: SERVICE_SERVER,
    timeout: 30000,
  },
  socialLogin: {
    Portkey: {
      websiteName: APP_NAME,
      websiteIcon: WEBSITE_ICON,
    },
    Telegram: {
      botId: "7077363609",
    },
  },
};


const baseConfig = {
  networkType: NETWORK_TYPE,
  chainId: CHAIN_ID,
  design: SignInDesignEnum.CryptoDesign, // "SocialDesign" | "CryptoDesign" | "Web2Design"
  titleForSocialDesign: 'Dancing Crypto',
  iconSrcForSocialDesign: 'https://docs.aelf.com/img/Logo.aelf.svg',
  // showVconsole: process.env.REACT_APP_ARDDES_ID as string === '2',
  showVconsole: false,
  keyboard: true,
  noCommonBaseModal: false,
};

const wallets = [
  new PortkeyAAWallet({
    appName: APP_NAME,
    chainId: CHAIN_ID,
    autoShowUnlock: true,
  }),
  new PortkeyDiscoverWallet({
    networkType: NETWORK_TYPE,
    chainId: CHAIN_ID,
    autoRequestAccount: true, // If set to true, please contact Portkey to add whitelist @Rachel
    autoLogoutOnDisconnected: true,
    autoLogoutOnNetworkMismatch: true,
    autoLogoutOnAccountMismatch: true,
    autoLogoutOnChainMismatch: true,
  }),
  new NightElfWallet({
    chainId: CHAIN_ID,
    appName: APP_NAME,
    connectEagerly: true,
    defaultRpcUrl: RPC_SERVER_AELF,
    nodes: {
      AELF: {
        chainId: 'AELF',
        rpcUrl: RPC_SERVER_AELF,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: RPC_SERVER_TDVW,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: RPC_SERVER_TDVV,
      },
    },
  }),
];

export const config: IConfigProps = {
  didConfig,
  baseConfig,
  wallets,
};