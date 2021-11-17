import {
  AppThunkDispatch, RC, onResponse, thunks
} from '@libs/redux';
import { Card, Image } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect } from 'react';

type CardElemProps = {
  id: number,
  pic: string | null,
  name: string,
  dispatch: AppThunkDispatch,
  Preloader: () => JSX.Element
};

const preloaderCss = {
  height: '100%',
  backgroundColor: 'white',
  minHeight: '200px',
  minWidth: '200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const CardElem = ({
  id, pic, name, dispatch, Preloader
}:CardElemProps) => {
  useEffect(() => {
    dispatch(thunks.callApi(RC.getPic(id), onResponse.getPic(id)));
  }, []);

  return (
    <Card
      bordered
      hoverable
      style={{ width: '200px' }}
      cover={(
        pic
          ? (
            <Image
              style={{ objectFit: 'cover' }}
              width={200}
              height={200}
              preview
              src={pic || ''}
              placeholder={(
                <div style={preloaderCss}>
                  {Preloader()}
                </div>
              )}
            />
          )
          : (
            <div style={{ ...preloaderCss }}>
              {Preloader()}
            </div>
          )
      )}
    >
      <Meta
        style={{ textAlign: 'center' }}
        title={name || 'loading...'}
      />
    </Card>
  );
};

export default React.memo(CardElem);
