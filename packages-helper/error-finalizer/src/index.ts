import {
  TErrorInform,
  IErrorFinalizer
} from './types';
import {
  ErrorFinalizer
} from './util';

const singleton = new ErrorFinalizer();

export default {
  inform: singleton.inform.bind(singleton),
  ignore: singleton.ignore.bind(singleton)
} satisfies IErrorFinalizer;

export function errorFinalizerSetup(adapter: TErrorInform, freeze = true): void {
  singleton.setAdapter(adapter);
  
  if (freeze) {
    singleton.freeze();
  }
}
