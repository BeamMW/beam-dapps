import { BeamAPI } from './utils/BeamAPI';
import MainPage from './components/MainPage/mainPage.component';
import Loader from './components/Loader/loader.component';
import './scss/main.scss';
import { ApiHandler } from './utils/api_handlers';
import Container from './components/Container/container.component';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.rootElement.append(new Loader().element);
    this.API.loadAPI()
      .then(() => {
        ApiHandler.setApiHandlers({
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
