import { BeamAPI } from './utils/BeamAPI';
import MainPage from './components/MainPage/mainPage.component';
import './scss/main.scss';
import { BEAM } from './utils/api_handlers';
import Container from './components/Container/container.component';
import Loader from './components/loader/loader.component';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.rootElement.append(new Loader().element);
    this.API.loadAPI()
      .then(() => {
        BEAM.setApiHandlers({
          addObservers: this.API.addObservers,
          callApi: this.API.callApi,
          initShader: this.API.initShader,
          deleteObserver: this.API.deleteObserver
        });
        this.rootElement.innerHTML = '';
        this.rootElement.append(new Container().element);
        this.rootElement.append(new MainPage().element);
      });
  }
}
