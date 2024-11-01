import { WebLoginProvider, init } from '@aelf-web-login/wallet-adapter-react';
import { config } from '@/config/aelf';
import { useEffect, useState } from 'react';



function WebLoginProviderELE(props: {children: React.ReactNode}) {
  const bridgeAPI = init(config);
  return <>
    <div className='App'>
      <WebLoginProvider bridgeAPI={bridgeAPI}>
        {props.children}
      </WebLoginProvider>
    </div>
  </>
}

function App(props: React.PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const scpt = document.createElement("script");
    scpt.src = "./telegram-web-app.js";
    document.body.appendChild(scpt);

    scpt?.addEventListener("load", () => {
      setIsLoaded(true);
      return;
    });
  }, []);


  return isLoaded ? (
    <WebLoginProviderELE>{props.children}</WebLoginProviderELE>
  ) : null;
}
export default App;

