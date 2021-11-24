import { Uploader } from '@components/shared';
import {
  AppThunkDispatch, RC, onResponse, RootState, thunks
} from '@libs/redux';
import AC from '@libs/redux/action-creators/action-creators';
import { Button, Input, PageHeader } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

type HeaderProps = {
  loading:boolean;
  cid:string;
  pKey: string | null;
  getPKey: (cid: string) => void;
  uploadImage: (pKey:string, cid: string) => (hex: string) => void;
  setCid:(txt: string) => void
};

const Header = ({
  loading, pKey, cid, setCid, getPKey, uploadImage
}:HeaderProps) => {
  const [text, setText] = useState('');
  useEffect(() => {
    if (cid && !pKey) getPKey(cid);
  }, [loading, cid]);

  const textHandler = (e:any) => {
    console.log(e);
    setText(e.target?.value);
  };

  const submitCidToState = () => {
    setCid(text);
    setText('');
  };

  return (
    <PageHeader
      ghost
      title="Dogs"
      subTitle={cid}
      footer={
        [
          <Input.Group compact>
            <Input
              onChange={textHandler}
              style={
                { width: 'calc(100% - 200px)' }
              }
              disabled={!!cid.length}
              value={text}
            />
            <Button
              disabled={!!cid.length}
              onClick={submitCidToState}
              type="primary"
            >
              Sumbit

            </Button>
          </Input.Group>
        ]
      }
      extra={[
        <div key="uploader">
          {
            !loading
            && pKey
            && <Uploader uploadImage={uploadImage(pKey, cid)} />
          }
        </div>

      ]}
    />
  );
};

const MapState = ({
  app: { pKey, loading, cid }
}: RootState) => ({
  loading,
  cid,
  pKey
});

const MapDispatch = (dispatch: AppThunkDispatch) => ({
  setCid: (txt:string) => {
    dispatch(AC.setCID(txt));
  },
  getPKey: (cid: string) => {
    dispatch(thunks.callApi(RC.getPKey(cid), onResponse.getPKey()));
  },
  uploadImage: (pKey: string, cid:string) => (hex: string) => {
    dispatch(
      thunks.callApi(
        RC.uploadImage(hex, pKey, cid), onResponse.uploadImage(hex)
      )
    );
  }
});

export default connect(MapState, MapDispatch)(Header);
