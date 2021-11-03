import { Tags } from '../../../constants/html_elements';
import { BaseComponent, Button } from '../../shared';
import './fail-page.scss';

export default class FailPage extends BaseComponent {
  constructor(err: { code: number; message: string; data: string }) {
    super(Tags.DIV, ['fail-page']);
    this.append(this.createErrorMessage(err), this.createReloadButton());
  }

  createReloadButton = ():Button => {
    const component = new Button({
      name: 'reload',
      action: 'error'
    });
    component.element.addEventListener('click', () => window.location.reload());
    return component;
  };

  createErrorMessage = ({
    code,
    message,
    data
  }: {
    code: number;
    message: string;
    data: string;
  }): BaseComponent => {
    const component = new BaseComponent(Tags.DIV);
    const title = new BaseComponent(Tags.P);
    const msg = new BaseComponent(Tags.P);
    const status = new BaseComponent(Tags.P);

    title.textContent = 'Oops! Something went wrong...';
    msg.textContent = `message: ${message}`;
    status.textContent = `code: ${code} data: ${data}`;
    component.append(title, msg, status);
    return component;
  };
}
