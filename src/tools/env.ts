export const isDev = () => {
  const REACT_APP_ARDDES_ID = process.env.REACT_APP_ARDDES_ID as string
  return parseInt(REACT_APP_ARDDES_ID) === 2
}