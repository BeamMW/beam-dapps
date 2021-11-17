import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './libs/redux/store';
import './index.css';
import 'antd/dist/antd.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
