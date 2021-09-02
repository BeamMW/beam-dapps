import Loader from './components/loader/loader.component';
import { BeamAPI } from './logic/beam_api/beamAPI';
import { ApiHandler } from './logic/beam_api/api_handler';
import Main from './components/main/main.component';
import './style/index.scss';

const isLoaded = new Loader().element;

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.rootElement.append(isLoaded);
    this.API = new BeamAPI();
    this.API.loadAPI().then(() => {
      ApiHandler.setApiHandlers({
        callApi: this.API.callApi,
        addObservers: this.API.addObservers
      });
      this.rootElement.removeChild(isLoaded);
      this.rootElement.append(new Main().element);
    });
  }
}
