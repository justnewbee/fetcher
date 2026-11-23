import {
  TInterceptorEject
} from '../types';

/**
 * 推拦截器入队，并返回出队方法
 */
export default function queueInterceptor<T>(interceptors: T[], item: T): TInterceptorEject {
  interceptors.push(item);
  
  return () => {
    const index = interceptors.indexOf(item);
    
    if (index >= 0) {
      interceptors.splice(index, 1);
    }
  };
}
