import { Preloader } from '@components/shared';
import CardElem from '@components/shared/card.component';
import {
  AppThunkDispatch, RC, thunks, RootState, onResponse
} from '@libs/redux';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { connect } from 'react-redux';

type GalleryType = {
  cid: string,
  items: { id: number, pic: string | null, name: string } [];
  dispatch: AppThunkDispatch;
  getItems: (cid: string) => void
};

const resetMargin = {
  marginLeft: 0,
  marginRight: 0
};

const colStyle = {
  opacity: 1,
  transition: '.55s opacity',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center'
};

const Gallery = ({
  items, cid, dispatch, getItems
}:GalleryType) => {
  useEffect(() => {
    if (!items.length) getItems(cid);
  }, []);

  const itemsPics = items.map(
    (el, i) => (
      <Col
        key={el.id + i}
        style={colStyle}
        span={6}
        xs={{ span: 16 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 6 }}
      >
        <CardElem
          {...el}
          cid={cid}
          Preloader={Preloader}
          dispatch={dispatch}
        />
      </Col>
    )
  );

  return (
    <Row gutter={32} style={resetMargin}>
      {itemsPics}
    </Row>
  );
};

const mapState = ({
  gallery: { items },
  app: { cid }
}: RootState) => ({
  items, cid
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
  dispatch,
  getItems: (cid: string) => {
    dispatch(thunks.callApi(RC.getAllItems(cid), onResponse.getItems()));
  }
});

export default connect(mapState, mapDispatch)(Gallery);
