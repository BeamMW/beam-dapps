import { AppThunkDispatch, RootState, thunks } from '@libs/redux';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Err from '../error/error.component';
import Gallery from '../gallery/gallery.component';
import Header from '../header/header.component';
import Loading from '../loading/loading.component';

type MainProps = {
  loading: boolean;
  error: {
    code: number;
    status: string;
    message: string;
  } | null;
  beamLoading: () => void;
};

const Main = ({ loading, beamLoading, error }: MainProps) => {
  useEffect(() => {
    if (loading) beamLoading();
  }, [loading]);

  return (
    <>
      <Header />
      {error
        ? <Err {...error} />
        : loading
          ? <Loading />
          : <Gallery />}

    </>
  );
};

const mapState = ({ gallery }: RootState) => {
  const { loading, error } = gallery;
  return {
    loading,
    error
  };
};

const mapDispatch = (dispatch: AppThunkDispatch) => ({
  beamLoading: () => dispatch(thunks.connectBeamApi())
});

export default connect(mapState, mapDispatch)(Main);
