import Connector from '@/components/Connector';
import WebGLProvider from '@/components/WebGLProvider';
import { useEffect } from 'react';

const Aelf = () => {
  return <>
    <Connector />
    {/* <WebGLProvider /> */}
  </>
};


export default function AelfDemo() {
  const debug = process.env.REACT_APP_DEBUG
  useEffect(() => {
    if (debug) {
      // import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);
  return <>
    <Aelf />
  </>
}