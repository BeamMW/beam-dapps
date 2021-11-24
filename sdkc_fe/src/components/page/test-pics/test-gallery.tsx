import { CardElem, Preloader } from '@components/shared';
import { AppThunkDispatch, RootState } from '@libs/redux';
import { Pic } from '@types';
import { connect } from 'react-redux';

type TestGalleryProps = {
  cid: string,
  items: Pic[],
  dispatch: AppThunkDispatch
};

const TestGallery = ({ items, dispatch, cid }: TestGalleryProps) => {
  console.log('sdfsdf');
  return (
    <>
      <h1>Parsed</h1>
      <div>
        {items.map((el) => (
          <CardElem
            {...el}
            cid={cid}
            dispatch={dispatch}
            Preloader={Preloader}
          />
        ))}
      </div>
    </>
  );
};

const mapState = ({
  app: { cid },
  test: { items }
}: RootState) => ({
  cid,
  items
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
  dispatch
});

export default connect(mapState, mapDispatch)(TestGallery);
