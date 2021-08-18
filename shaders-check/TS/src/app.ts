import { BeamAPI } from './beamAPI/beamAPI';
import Container from './components/Container/container.component';
import Loader from './components/Loader/loader.component';
import './scss/main.scss';

export class App {
  private readonly rootElement: HTMLElement;

  private readonly API: BeamAPI;

  constructor(rootElement: HTMLElement) {
    console.log(window.beam);
    this.rootElement = rootElement;
    this.API = new BeamAPI();
    this.rootElement.append(new Loader().element);
    this.API.loadAPI()
      .then(() => {
        console.log(this.API);
        this.rootElement.innerHTML = '';
        this.rootElement.append(new Container(this.API).element);
      });
  }
}
