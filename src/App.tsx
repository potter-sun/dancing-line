import { WebLoginProvider, init } from '@aelf-web-login/wallet-adapter-react';
import { config } from '@/config/aelf';

function App(props: React.PropsWithChildren) {
  const bridgeAPI = init(config);
  return <>
    <div className='App'>
      <WebLoginProvider bridgeAPI={bridgeAPI}>
        {props.children}
      </WebLoginProvider>
    </div>
  </>
}
export default App;
