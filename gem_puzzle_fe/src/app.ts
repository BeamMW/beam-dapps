import Loader from './components/loader/loader.component';
import StartMenu from './components/menu/menu.component';
import { BeamAPI } from './utils/beamAPI';
import bg from './assets/bg.png';
import { ApiHandler } from './utils/api_handler';

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
      this.rootElement.style.backgroundImage = `url('${bg}')`;
      this.rootElement.append(new StartMenu().element);
    });
  }
}
