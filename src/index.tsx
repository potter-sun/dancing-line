import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import store from './store'
import router from './router'
import { Provider } from 'react-redux'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css';
import { isDev } from './tools/env';
// import * as Sentry from "@sentry/react";
// import VConsole from 'vconsole'
import ReactGA from "react-ga4";

// new VConsole()
if (!isDev()) {
  // GA
  ReactGA.initialize("G-RC5MV09DN0");
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
