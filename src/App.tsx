import { WebLoginProvider, init } from "@aelf-web-login/wallet-adapter-react";
import { config } from "@/config/aelf";
import { useEffect } from "react";
import {
  getCommunicationSocketUrl,
  getCustomNetworkType,
  getServiceUrl,
  socialLoginAuth,
  TelegramPlatform,
} from "@portkey/did-ui-react";
import { socialLoginAuthCurr } from "./utils/auth";
import { sleep } from "./tools/schedual";
class ABCK {
  constructor(options: any) {
    console.log(options);
  }
}

function WebLoginProviderELE(props: { children: React.ReactNode }) {
  const bridgeAPI = init(config);
  return (
    <>
      <div className="App">
        <WebLoginProvider bridgeAPI={bridgeAPI}>
          {props.children}
        </WebLoginProvider>
      </div>
    </>
  );
}

function App(props: React.PropsWithChildren) {
  // const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   const scpt = document.createElement("script");
  //   scpt.src = "./telegram-web-app.js";
  //   document.body.appendChild(scpt);

  //   scpt?.addEventListener("load", () => {
  //     setIsLoaded(true);
  //     return;
  //   });
  // }, []);

  // return isLoaded ? (
  //   <WebLoginProviderELE>{props.children}</WebLoginProviderELE>
  // ) : null;
  useEffect(() => {
    try {
      socialLoginAuthCurr({
        type: "Telegram",
        networkType: "TESTNET",
      })
        .then((res: any) => {
          console.log(res, "result==ressocialLoginAuthCurr");
        })
        .catch((error: any) => {
          console.log("error==ressocialLoginAuthCurr", error);
        });
    } catch (error) {
      console.log("result==ressocialLoginAuthCurr===catch", error);
    }

    const serviceURI = getServiceUrl();
    const socketURI = getCommunicationSocketUrl();
    const ctw = getCustomNetworkType();
    console.log(serviceURI, socketURI, ctw, "serviceURI, socketURI, ctw");

    const data = TelegramPlatform.getInitData();
    console.log(data, "data===");
  }, []);
  return (
    <WebLoginProviderELE>
      {props.children}
      <div>-----</div>
      <button
        onClick={async () => {
          const data = TelegramPlatform.getInitData();
          console.log(data, "data===");
          if (!data) return;
          try {
            const res = await socialLoginAuth({
              type: "Telegram",
              network: "TESTNET",
            });

            console.log("socialLoginAuth", res);
          } catch (error) {
            console.log(error, "socialLoginAuth===error");
          }
        }}>
        btn
      </button>
      <div>
        <button
          onClick={async () => {
            const result = await socialLoginAuthCurr({
              type: "Telegram",
              networkType: "TESTNET",
            });
            console.log(result, "result==");
          }}>
          button
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            new ABCK(2);

            new ABCK({ a: 1, b: 2 });
          }}>
          ABCK
        </button>
      </div>
    </WebLoginProviderELE>
  );
}
export default App;
