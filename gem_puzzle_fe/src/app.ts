import { Store } from './logic/store/state_handler';
import Loader from './components/shared/loader/loader.component';
import { BeamAPI } from './logic/beam/beamAPI';
import { Beam } from './logic/beam/api_handler';
import './style/index.scss';
import AppState from './logic/store/reducer';
import Footer from './components/footer/footer.components';
import { Container } from './components/container/container';
import LoadingPage from './components/loading-page/loading-page.component';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  private readonly AppState: AppState;

  constructor(rootElement: HTMLElement) {
    const ua = navigator.userAgent;
    const loader = /QtWebEngine/i.test(ua)
      ? new Loader('preload').element
      : new LoadingPage(
        'Gem-Puzzle',
        // eslint-disable-next-line max-len
        'https://chrome.google.com/webstore/detail/beam-web-wallet/ilhaljfiglknggcoegeknjghdgampffk'
      ).element;

    this.rootElement = rootElement;
    this.rootElement.append(loader);
    this.API = new BeamAPI();
    this.AppState = new AppState();
    this.API.loadAPI().then(() => {
      Store.setAppHandlers({
        dispatch: this.AppState.dispatch,
        addObservers: this.AppState.addObservers,
        getState: this.AppState.getState
      });
      Beam.setApiHandlers({
        callApi: this.API.callApi,
        addObservers: this.API.addObservers
      });
      this.rootElement.removeChild(loader);
      this.rootElement.append(
        new Container().element,
        new Footer().element
      );
    });
  }
}
