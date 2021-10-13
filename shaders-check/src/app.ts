import { BeamAPI } from './logic/beam/BeamAPI';
import MainPage from './components/drop_page/drop_page.component';
import './scss/main.scss';
import { BEAM } from './controllers/beam.controller';
import Container from './components/main/main.component';
import Loader from './components/Loader/loader.component';

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
