
export const showLoading = (msg?: string) => {
  const loadingDom = document.querySelector('#loading') as HTMLElement
  loadingDom.style.cssText = `visibility: visible; opacity: 1;`

  if (msg) {
    const textDom = loadingDom.querySelector('.loading__text') as HTMLElement
    textDom.innerHTML = msg
  }
}

export const hideLoading = () => {
    const loadingDom = document.getElementById('loading') as HTMLElement
    const textDom = loadingDom.querySelector('.loading__text') as HTMLElement
    loadingDom.style.cssText = `visibility: hidden; opacity: 0;`
    if (textDom && textDom.innerHTML) {
      textDom.innerHTML = ''
    }
}