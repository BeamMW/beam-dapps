import { AppStateHandler } from './logic/app_state/state.handler';
import Loader from './components/loader/loader.component';
import { BeamAPI } from './logic/beam_api/beamAPI';
import { ApiHandler } from './logic/beam_api/api_handler';
import Main from './components/main/main.component';
import './style/index.scss';
import AppState from './logic/app_state/reducer';
import Header from './components/header/header.component';

const isLoaded = new Loader().element;

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  private readonly AppState: AppState;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.rootElement.append(isLoaded);
    this.API = new BeamAPI();
    this.AppState = new AppState();
    this.API.loadAPI().then(() => {
      AppStateHandler.setApiHandlers({
        dispatch: this.AppState.dispatch,
        addObservers: this.AppState.addObservers,
        getState: this.AppState.getState
      });
      ApiHandler.setApiHandlers({
        callApi: this.API.callApi,
        addObservers: this.API.addObservers
      });
      this.rootElement.removeChild(isLoaded);
      this.rootElement.append(new Header().element, new Main().element);
    });
  }
}
