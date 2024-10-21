/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { showLoading, hideLoading } from '@/tools/animation'
import { AxiosServiceCacheKey } from '@/types/apis'
import { STORAGE_CACHE_TOKEN_KEY } from '@/config/const';
import store from '@/store'
import { setAuthExpiredAction } from '@/store/features/userSlice';

const cacheService: Record<string, AxiosInstance> = {}
const axiosDefaultCreateConfig: AxiosRequestConfig = {
 baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000 * 60,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
}

/**
 * Cache Axios Services
 * @param axiosCreateConfig
 * @param cacheKey 
 * @returns Axios Http Service
 */
function axiosService(axiosCreateConfig: AxiosRequestConfig, cacheKey: AxiosServiceCacheKey) {
  if (cacheService[cacheKey]) {
    return cacheService[cacheKey]
  }

  cacheService[cacheKey] = axios.create(axiosCreateConfig || axiosDefaultCreateConfig);

  cacheService[cacheKey].interceptors.request.use((res: any) => {
    const { isLoading } = res.headers
    isLoading && showLoading()
    

    const token = window.localStorage.getItem(STORAGE_CACHE_TOKEN_KEY);
    if (token) {
      Object.assign(res.headers, {
        'Authorization': 'Bearer ' + token,
      })
    }

    return res;

  }, function (error: AxiosResponse) {
    const { isLoading } = error.config.headers
    isLoading && hideLoading()

    return Promise.reject(error);
  });

  cacheService[cacheKey].interceptors.response.use(
    (response: AxiosResponse | any) => {
      const { isLoading } = response.config.headers
      isLoading && hideLoading()

      const rs = response.data || {}
      switch (rs.code) {
        case 0: {
          message.error(`${rs.error}: ${rs.msg}`)
          break
        }
        case 401: {
          message.error(`${rs.error}: ${rs.msg}`)
          store.dispatch(setAuthExpiredAction(true))
          break
        }
      }

      return response.data;
    },
    (error: AxiosError & AxiosResponse & any) => {
      const { isLoading } = error.config.headers
      isLoading && hideLoading()

      if (error.message.indexOf('timeout') !== -1) {
        message.error('Network timeout');
      }
      if (error.message === 'Network Error') {
        message.error('Network error');
      }
      
      console.log('🚀 -> axiosService -> response -> error:', error);
      return Promise.reject(error);
    }
  );
  
  return cacheService[cacheKey]
}

export default axiosService;
