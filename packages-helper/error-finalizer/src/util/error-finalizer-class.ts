import {
  TErrorInform,
  IErrorFinalizerClass
} from '../types';

import defaultErrorInform from './default-error-inform';

export default class ErrorFinalizer implements IErrorFinalizerClass {
  private frozen = false;
  private adapter?: TErrorInform;
  
  inform(error: unknown, title?: string): void {
    if (!error || (error as Error).name === 'AbortError') {
      return;
    }
    
    const informFn = this.adapter ?? defaultErrorInform;
    
    informFn(error, title);
  }
  
  ignore(error: unknown): void {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.error('%c[IgnoredInProd]%o', 'background-color:#e60;color:#fff;', error); // eslint-disable-line no-console
    }
  }
  
  setAdapter(adapter: TErrorInform): void {
    this.assertNotFrozen('setAdapter');
    this.adapter = adapter;
  }
  
  freeze(): void {
    this.frozen = true;
  }
  
  private assertNotFrozen(fn: string): void {
    if (this.frozen) {
      throw new Error(`[ErrorFinalizer#${fn}] This ErrorFinalizer instance is frozen.`);
    }
  }
}
