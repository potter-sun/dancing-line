import axiosService from '@/apis/axios';
import { AxiosServiceCacheKey } from '@/types/apis';

const service = axiosService({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 1000 * 60,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }, AxiosServiceCacheKey.Business);
  
export default service;
