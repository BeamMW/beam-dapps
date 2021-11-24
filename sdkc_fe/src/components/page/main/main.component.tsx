import { AppThunkDispatch, RootState, thunks } from '@libs/redux';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Err from '../error/error.component';
import Gallery from '../gallery/gallery.component';
import Header from '../header/header.component';
import Loading from '../loading/loading.component';
import Notifications from '../notifications/notifications.component';
import TestGallery from '../test-pics/test-gallery';

type MainProps = {
  cid: string;
  loading: boolean;
  error: {
    code: number;
    status: string;
    message: string;
  } | null;
  beamLoading: () => void;
};

const Main = ({
  cid, loading, beamLoading, error
}: MainProps) => {
  useEffect(() => {
    if (loading) beamLoading();
  }, [loading, cid]);

  return (
    <>
      <Header />
      {error
        ? <Err {...error} />
        : loading
          ? <Loading />
          : cid
            ? <Gallery />
            : ''}
      <TestGallery />
      <Notifications />
    </>
  );
};

const mapState = ({ app }: RootState) => {
  const { loading, error, cid } = app;
  return {
    cid,
    loading,
    error
  };
};

const mapDispatch = (dispatch: AppThunkDispatch) => ({
  beamLoading: () => dispatch(thunks.connectBeamApi())
});

export default connect(mapState, mapDispatch)(Main);
