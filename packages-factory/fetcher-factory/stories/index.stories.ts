import {
  Meta
} from '@storybook/react-vite';

export default {
  title: 'fetcher-factory'
} satisfies Meta;

export { default as InterceptorBiz } from './story-interceptor-biz';
export { default as InterceptorCacheLocal } from './story-interceptor-cache-local';
export { default as InterceptorMerging } from './story-interceptor-merging';
