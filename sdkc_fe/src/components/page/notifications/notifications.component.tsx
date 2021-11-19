import { RootState } from '@libs/redux';
// import {
//   notification
// } from 'antd';
import { connect } from 'react-redux';

type NotificationProps = {
  txs: Map<string, string>
};

const Notifications = ({ txs }: NotificationProps) => {
  // const [api, contextHolder] = notification.useNotification();

  txs.forEach((el) => {
    console.log(el);
    // api.info({
    //   message: `Notification ${el}`,
    //   placement: 'bottomRight',
    //   duration: null
    // });
  });

  return (
    <>
      sdfsdf
    </>
  );
};

const MapState = ({ app: { txs } }: RootState) => ({
  txs
});

export default connect(MapState)(Notifications);
