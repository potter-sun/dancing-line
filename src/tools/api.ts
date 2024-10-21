export const isOk = (response: any) => {
  if (response?.code || response?.data?.code === 200) {
    return true
  }
  return false
}