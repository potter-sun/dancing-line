import React, { } from 'react';
import {
  createBrowserRouter,
  useRoutes,
  useLocation,
} from "react-router-dom";
// import {
//   SwitchTransition,
//   CSSTransition
// } from 'react-transition-group';

import App from "@/App";
// import AelfDemo from '@/pages/aelf-demo/aelf-demo';

/**
 * Router auth
 * @param props components
 * @returns
 */
const RouterBeforeEach = (props: any) => {
  if (props.route?.meta?.auth) {
    const isConnected = window.localStorage.getItem('isConnected');
    if (isConnected !== 'true') {
      return <div>
        Login your wallet please!
      </div>
    }
  }
  return <div>{props.children}</div>
}
const formattedRoutes = (routes: any) => {
  return routes.map((route: any) => {
    const _route: any = {
      meta: route.meta || {},
      path: route.path,
      element: <RouterBeforeEach route={route}>
        {route.element}
      </RouterBeforeEach>,
      children: route.children ? formattedRoutes(route.children) : []
    }
    return _route
  })
}

/**
 * Transition
 * @param props transition component
 * @returns 
 */
// const TransitionApp = (props: React.PropsWithChildren) => {
//   const location = useLocation()
//   return <>
//     <SwitchTransition>
//       <CSSTransition
//         key={location.pathname}
//         classNames='fade'
//         timeout={{
//           appear: 0,
//           enter: 300,
//         }}
//       >
//         {props.children}
//       </CSSTransition>
//     </SwitchTransition>
//   </>
// }



const routes = [
  {
    path: '/',
    element:
      <App>
        <div>btn</div>
        {/* <AelfDemo /> */}
      </App>,
  },
]

export default createBrowserRouter([
  {
    path: "*",
    Component: () => useRoutes(formattedRoutes(routes))
  },
]);