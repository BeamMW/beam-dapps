import { BeamAPI } from './BeamAPI/BeamAPI';
import './scss/main.scss';
import Container from './components/Container/Container';
import Loader from './components/Loader/Loader';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.rootElement.append(new Loader().element);
    this.API.loadAPI()
      .then(() => {
        console.log(this.API);
        this.rootElement.innerHTML = '';
        this.rootElement.append(new Container().element);
      });
  }
}
