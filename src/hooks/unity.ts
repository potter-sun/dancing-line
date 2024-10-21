import { isDev } from "@/tools/env";
import { useUnityContext } from "react-unity-webgl";

const UNITY_FILE_NAME = process.env.REACT_APP_UNITY_ASSET_FILE_NAME
const UNITY_CONTEXT_LOCAL = {
  loaderUrl: 'https://dl.pocketland.cn/Build/Build.loader.js',
  dataUrl: 'https://dl.pocketland.cn/Build/Build.data.br',
  frameworkUrl: 'https://dl.pocketland.cn/Build/Build.framework.js.br',
  codeUrl: 'https://dl.pocketland.cn/Build/Build.wasm.br',
  streamingAssetsUrl: 'https://dl.pocketland.cn/Build/StreamingAssets',
}
const UNITY_CONTEXT_LOCAL_PROD = {
  loaderUrl: `/Build/${UNITY_FILE_NAME}.loader.js`,
  dataUrl: `/Build/${UNITY_FILE_NAME}.data.br`,
  frameworkUrl: `/Build/${UNITY_FILE_NAME}.framework.js.br`,
  codeUrl: `/Build/${UNITY_FILE_NAME}.wasm.br`,
  streamingAssetsUrl: `/StreamingAssets`,
}

export function useUnity() {
  return useUnityContext(isDev() ? UNITY_CONTEXT_LOCAL : UNITY_CONTEXT_LOCAL_PROD)
}