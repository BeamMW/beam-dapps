import { Tags } from '../../../../constants/html_elements';
import { STORE } from '../../../../controllers';
import { AC } from '../../../../logic/store/action-creators';
import {
  BaseComponent, Button, DropButton, FlexContainer, HeaderInfo
} from '../../../shared';
import './header.scss';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const headerDrop = new DropButton({
      mainSelector: 'header__app',
      labelSelector: 'header__app-label'
    });
    const btn = new Button({
      name: 'Set Cid',
      action: 'cid-setter',
      classes: (action:string) => [action]
    });
    btn.element.addEventListener('click', () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText) {
        STORE.dispatch(AC.setDefaultCid(selectedText));
      }
    });
    const flex = new FlexContainer(headerDrop, new HeaderInfo());
    flex.classList.add('header-information');
    this.append(flex, btn);
  }
}
