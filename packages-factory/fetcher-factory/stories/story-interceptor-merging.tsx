import {
  ReactElement,
  useState,
  useCallback
} from 'react';

import {
  Button,
  PromiseViewer,
  InputSwitch
} from '@kcuf/demo-rc';

import fetcherFactory from '../src';

const fetcher = fetcherFactory({
  interceptorBizOptions: {
    isSuccess: '0'
  },
  interceptorMergingOptions: true
});

export default function StoryInterceptorMerging(): ReactElement {
  const [stateMerging, setStateMerging] = useState<boolean>(true);
  const [statePromise, setStatePromise] = useState<Promise<unknown> | null>(null);

  const handleJsonp = useCallback(() => {
    function callJsonpOnce(): Promise<unknown> {
      return fetcher.jsonp({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/jsonp');
    }

    setStatePromise(Promise.all([
      callJsonpOnce(),
      callJsonpOnce(),
      callJsonpOnce(),
      callJsonpOnce()
    ]));
  }, [stateMerging, setStatePromise]);
  const handleGet = useCallback(() => {
    function callGetOnce(): Promise<unknown> {
      return fetcher.get({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/artist/fav');
    }

    setStatePromise(Promise.all([
      callGetOnce(),
      callGetOnce(),
      callGetOnce(),
      callGetOnce()
    ]));
  }, [stateMerging, setStatePromise]);
  const handlePost = useCallback(() => {
    function callPostOnce(): Promise<unknown> {
      return fetcher.post({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/artist/fav/ARTIST_ID_ADD');
    }

    setStatePromise(Promise.all([
      callPostOnce(),
      callPostOnce(),
      callPostOnce(),
      callPostOnce()
    ]));
  }, [stateMerging, setStatePromise]);
  const handleDelete = useCallback(() => {
    function callDeleteOnce(): Promise<unknown> {
      return fetcher.delete({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/artist/fav/ARTIST_ID_DEL');
    }

    setStatePromise(Promise.all([
      callDeleteOnce(),
      callDeleteOnce(),
      callDeleteOnce(),
      callDeleteOnce()
    ]));
  }, [stateMerging, setStatePromise]);
  const handlePut = useCallback(() => {
    function callPutOnce(): Promise<unknown> {
      return fetcher.put({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/playlist/PLAYLIST_ID_UPDATE', {
        name: 'new name'
      });
    }

    setStatePromise(Promise.all([
      callPutOnce(),
      callPutOnce(),
      callPutOnce(),
      callPutOnce()
    ]));
  }, [stateMerging, setStatePromise]);
  const handlePatch = useCallback(() => {
    function callPatchOnce(): Promise<unknown> {
      return fetcher.patch({
        merging: stateMerging
      }, 'https://apifoxmock.com/m1/4847676-4502957-default/playlist/PLAYLIST_ID_PATCH', {
        name: 'new name'
      });
    }

    setStatePromise(Promise.all([
      callPatchOnce(),
      callPatchOnce(),
      callPatchOnce(),
      callPatchOnce()
    ]));
  }, [stateMerging, setStatePromise]);

  return <>
    <div>
      <InputSwitch {...{
        label: 'merging',
        value: stateMerging,
        onChange: setStateMerging
      }} />
    </div>
    <Button onClick={handleJsonp}>jsonp x4</Button>
    <Button onClick={handleGet}>get x4</Button>
    <Button onClick={handlePost}>post x4</Button>
    <Button onClick={handleDelete}>delete x4</Button>
    <Button onClick={handlePut}>put x4</Button>
    <Button onClick={handlePatch}>patch x4</Button>
    <PromiseViewer promise={statePromise} />
  </>;
}
