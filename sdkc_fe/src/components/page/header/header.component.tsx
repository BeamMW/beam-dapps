import { Uploader } from '@components/shared';
import {
  AppThunkDispatch, RC, onResponse, RootState, thunks
} from '@libs/redux';
import { PageHeader } from 'antd';
import { useEffect } from 'react';
import { connect } from 'react-redux';

type HeaderProps = {
  loading:boolean;
  pKey: string | null;
  getPKey: () => void;
  uploadImage: (hex: string) => void;
};

const Header = ({
  loading, pKey, getPKey, uploadImage
}:HeaderProps) => {
  console.log(getPKey);

  useEffect(() => {
    if (!pKey) getPKey();
  }, [loading]);

  return (
    <PageHeader
      ghost
      title="Dogs"
      subTitle="Test"
      extra={[
        <div key="uploader">
          {!loading && pKey && <Uploader uploadImage={uploadImage} />}
        </div>

      ]}
    />
  );
};

const MapState = ({
  gallery: { loading },
  app: { pKey }
}: RootState) => ({
  loading,
  pKey
});

const MapDispatch = (dispatch: AppThunkDispatch) => ({
  getPKey: () => {
    dispatch(thunks.callApi(RC.getPKey(), onResponse.getPKey()));
  },
  uploadImage: (hex: string) => {
    dispatch(thunks.callApi(RC.uploadImage(hex), onResponse.uploadImage()));
  }
});

export default connect(MapState, MapDispatch)(Header);
