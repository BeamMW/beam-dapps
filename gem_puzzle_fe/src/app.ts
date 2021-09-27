import { Store } from './logic/store/state_handler';
import Loader from './components/shared/loader/loader.component';
import { BeamAPI } from './logic/beam/beamAPI';
import { Beam } from './logic/beam/api_handler';
import Main from './components/main/main.component';
import './style/index.scss';
import AppState from './logic/store/reducer';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.components';
import Widget from './components/widget/widget.component';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  private readonly AppState: AppState;

  constructor(rootElement: HTMLElement) {
    const loader = new Loader().element;
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
        new Header().element,
        new Main().element,
        new Footer().element,
        new Widget().element
      );
    });
  }
}
